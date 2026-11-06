import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";

import { DevelopmentUpdates } from "./collections/DevelopmentUpdates.js";
import { Characters } from "./collections/Characters.js";
import { Games } from "./collections/Games.js";
import { Groups } from "./collections/Groups.js";
import { MediaAssets } from "./collections/MediaAssets.js";
import { MediaCards } from "./collections/MediaCards.js";
import { News } from "./collections/News.js";
import { StudioGames } from "./collections/StudioGames.js";
import { TeamMembers } from "./collections/TeamMembers.js";
import { WorldObjects } from "./collections/WorldObjects.js";
import { RuntimeGameMetrics } from "./collections/RuntimeGameMetrics.js";
import { RuntimeGroupMetrics } from "./collections/RuntimeGroupMetrics.js";
import { RuntimeRefreshRuns } from "./collections/RuntimeRefreshRuns.js";
import { SocialProfiles } from "./collections/SocialProfiles.js";
import { Users } from "./collections/Users.js";
import { PublicSite } from "./globals/PublicSite.js";
import { SiteSettings } from "./globals/SiteSettings.js";
import { WebsiteSettings } from "./globals/WebsiteSettings.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

dotenv.config({ path: path.resolve(dirname, "..", ".env") });

const csrfOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/**
 * Cloudflare R2 is only enabled when every variable holds a real value.
 * Placeholders such as "https://<account-id>.r2.cloudflarestorage.com" are truthy but not valid URLs,
 * and used to enable the plugin with a broken endpoint (ERR_INVALID_URL on every upload).
 * When R2 is not fully configured, Payload falls back to local file storage.
 */
const R2_ENV_KEYS = [
  "R2_BUCKET",
  "R2_PUBLIC_URL",
  "S3_ACCESS_KEY_ID",
  "S3_SECRET_ACCESS_KEY",
  "S3_ENDPOINT",
] as const;

function isRealValue(value: string | undefined) {
  const v = (value || "").trim();
  return v !== "" && !/[<>]/.test(v) && !/^(your[-_ ]|changeme|placeholder)/i.test(v);
}

function isHttpUrl(value: string | undefined) {
  try {
    const url = new URL(String(value));
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

const r2Problems: string[] = R2_ENV_KEYS.filter((key) => !isRealValue(process.env[key]));
for (const key of ["S3_ENDPOINT", "R2_PUBLIC_URL"] as const) {
  if (isRealValue(process.env[key]) && !isHttpUrl(process.env[key]) && !r2Problems.includes(key)) {
    r2Problems.push(key);
  }
}
const r2Enabled = r2Problems.length === 0;

const storageGlobal = globalThis as { __cfR2Warned?: boolean };
if (!r2Enabled && !storageGlobal.__cfR2Warned) {
  storageGlobal.__cfR2Warned = true;
  console.warn(
    `[storage] Cloudflare R2 is disabled; using local file storage. Missing or invalid: ${r2Problems.join(", ")}`
  );
}

/** Explicit pool limits. Supabase session-mode poolers allow very few clients (pool_size 15) shared by every process. */
const poolMax = Number.parseInt(process.env.DATABASE_POOL_MAX || "", 10) || 5;

/** Schema push defaults to "on outside production" as before; set PAYLOAD_DB_PUSH=false to turn it off. */
const pushSchema =
  process.env.PAYLOAD_DB_PUSH !== undefined
    ? process.env.PAYLOAD_DB_PUSH === "true"
    : process.env.NODE_ENV !== "production";

export default buildConfig({
  secret: (() => {
    if (!process.env.PAYLOAD_SECRET) {
      throw new Error("PAYLOAD_SECRET environment variable is required");
    }
    return process.env.PAYLOAD_SECRET;
  })(),
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  csrf: csrfOrigins,
  admin: {
    user: "users",
    meta: {
      titleSuffix: " - CrownForge Studio",
    },
  },
  collections: [
    Users,
    StudioGames,
    Characters,
    WorldObjects,
    TeamMembers,
    Games,
    Groups,
    MediaCards,
    SocialProfiles,
    MediaAssets,
    News,
    DevelopmentUpdates,
    RuntimeGameMetrics,
    RuntimeGroupMetrics,
    RuntimeRefreshRuns,
  ],
  globals: [WebsiteSettings, SiteSettings, PublicSite],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
      max: poolMax,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 15_000,
    },
    push: pushSchema,
  }),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  plugins: [
    s3Storage({
      enabled: r2Enabled,
      collections: {
        "media-assets": {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }: { filename: string; prefix?: string }) => {
            const key = prefix ? `${prefix}/${filename}` : filename;
            return `${process.env.R2_PUBLIC_URL}/${key}`;
          },
        },
      },
      bucket: process.env.R2_BUCKET || "",
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
        region: "auto",
      },
    }),
  ],
});
