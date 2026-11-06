import posthog from "posthog-js";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const isDevelopment = process.env.NODE_ENV === "development";

// PostHog project tokens start with "phc_". Placeholders or empty values would only produce
// 401/404 errors and 3s timeouts, so analytics stays off unless a real token is configured.
// In local development it is also off unless NEXT_PUBLIC_POSTHOG_ENABLE_DEV=true.
const hasRealToken = typeof token === "string" && /^phc_[A-Za-z0-9]+$/.test(token.trim());
const enabled = hasRealToken && (!isDevelopment || process.env.NEXT_PUBLIC_POSTHOG_ENABLE_DEV === "true");

if (enabled) {
  posthog.init(token.trim(), {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-01-30",
    capture_exceptions: true,
    debug: isDevelopment,
  });
}
