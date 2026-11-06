import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

import { getSiteSettings } from "@/lib/cms/studio.js";
import { getSiteUrl } from "@/lib/site.js";

export const alt = "CrownForge Studio — Game Development Studio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const revalidate = 3600;

const FONT_DIR = path.join(process.cwd(), "src/assets/fonts");

const COLORS = {
  accent: "#c99212",
  bg: "#090909",
  border: "rgba(255, 255, 255, 0.18)",
  muted: "rgba(240, 237, 232, 0.6)",
  text: "#f0ede8",
};

async function loadFonts() {
  const [bebas, inter] = await Promise.all([
    readFile(path.join(FONT_DIR, "BebasNeue-Regular.ttf")),
    readFile(path.join(FONT_DIR, "Inter-Regular-latin.ttf")),
  ]);

  return [
    { name: "Bebas Neue", data: bebas, weight: 400, style: "normal" },
    { name: "Inter", data: inter, weight: 400, style: "normal" },
  ];
}

async function loadHeroContent() {
  const settings = await getSiteSettings();
  return {
    hero: settings.hero,
    studioName: settings.studioName,
    artPath: settings.seo.ogImage || settings.heroImageUrl || "",
  };
}

/** Reads a configured local /public asset. Returns null when none is configured or the file is missing. */
async function loadKeyArtDataUri(source) {
  if (!source) {
    return null;
  }

  try {
    // Images chosen in the CMS are served from R2 (absolute URL) or /api/media-assets/file/...
    if (/^https?:\/\//i.test(source) || source.startsWith("/api/")) {
      const url = /^https?:\/\//i.test(source) ? source : new URL(source, getSiteUrl()).toString();
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      const type = (response.headers.get("content-type") || "").split(";")[0];
      if (!response.ok || !["image/png", "image/jpeg"].includes(type)) {
        return null;
      }
      return `data:${type};base64,${Buffer.from(await response.arrayBuffer()).toString("base64")}`;
    }

    if (!source.startsWith("/")) {
      return null;
    }

    const file = await readFile(path.join(process.cwd(), "public", source));
    const ext = path.extname(source).slice(1).toLowerCase();
    if (!["png", "jpg", "jpeg"].includes(ext)) {
      return null;
    }
    const mimeType = ext === "png" ? "image/png" : "image/jpeg";
    return `data:${mimeType};base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

const buttonStyle = {
  alignItems: "center",
  display: "flex",
  fontFamily: "Inter",
  fontSize: 15,
  letterSpacing: "0.07em",
  lineHeight: 1,
  padding: "16px 30px",
  textTransform: "uppercase",
};

function boldText(color, strokeWidth) {
  return { color, WebkitTextStroke: `${strokeWidth}px ${color}` };
}

export default async function OpenGraphImage() {
  const fonts = await loadFonts();
  const { hero, studioName, artPath } = await loadHeroContent();
  const keyArt = await loadKeyArtDataUri(artPath);
  const titleLines = hero.titleLines?.length ? hero.titleLines : studioName.split(" ");

  return new ImageResponse(
    <div
      style={{
        background: COLORS.bg,
        color: COLORS.text,
        display: "flex",
        height: "100%",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background:
            "radial-gradient(circle at 68% 35%, rgba(201, 146, 18, 0.28) 0%, rgba(9, 9, 9, 0) 45%)",
          display: "flex",
          height: "100%",
          left: 0,
          position: "absolute",
          top: 0,
          width: "100%",
        }}
      />

      {keyArt ? (
        <img
          alt=""
          src={keyArt}
          style={{
            filter: "saturate(0.75)",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: 0.55,
            position: "absolute",
            right: 0,
            top: 0,
            width: "65%",
          }}
        />
      ) : null}

      <div
        style={{
          background:
            "linear-gradient(to right, rgba(9, 9, 9, 1) 0%, rgba(9, 9, 9, 0.98) 35%, rgba(9, 9, 9, 0.7) 50%, rgba(9, 9, 9, 0) 70%)",
          display: "flex",
          height: "100%",
          left: 0,
          position: "absolute",
          top: 0,
          width: "100%",
        }}
      />
      <div
        style={{
          background: "linear-gradient(to top, rgba(9, 9, 9, 1) 0%, rgba(9, 9, 9, 0) 40%)",
          display: "flex",
          height: "100%",
          left: 0,
          position: "absolute",
          top: 0,
          width: "100%",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "0 72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Bebas Neue",
            fontSize: 116,
            letterSpacing: "0.01em",
            lineHeight: 0.88,
            textTransform: "uppercase",
          }}
        >
          {titleLines.map((line, index) => (
            <span
              key={`${index}-${line}`}
              style={boldText(index === titleLines.length - 1 ? COLORS.accent : COLORS.text, 2.5)}
            >
              {line}
            </span>
          ))}
        </div>

        <div
          style={{
            color: COLORS.muted,
            display: "flex",
            fontFamily: "Inter",
            fontSize: 21,
            lineHeight: 1.55,
            marginTop: 30,
            maxWidth: 620,
          }}
        >
          {hero.body}
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 36 }}>
          <div style={{ ...buttonStyle, ...boldText("#0a0a0a", 0.5), background: COLORS.accent }}>
            {hero.primaryCtaLabel}
          </div>
          {hero.secondaryCtaLabel ? (
            <div
              style={{
                ...buttonStyle,
                ...boldText(COLORS.text, 0.5),
                border: `1px solid ${COLORS.border}`,
              }}
            >
              {hero.secondaryCtaLabel}
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    { ...size, fonts },
  );
}
