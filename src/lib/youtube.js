const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * Accepts a YouTube link (watch, youtu.be, embed, shorts, live) or a bare 11-character
 * video ID and returns the video ID. Returns "" when the input is not a valid YouTube video.
 */
export function extractYouTubeId(input) {
  const value = String(input ?? "").trim();
  if (!value) return "";
  if (VIDEO_ID.test(value)) return value;

  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    const host = url.hostname.replace(/^(www|m)\./, "");
    let id = "";

    if (host === "youtu.be") {
      id = url.pathname.split("/")[1] || "";
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (url.pathname === "/watch") {
        id = url.searchParams.get("v") || "";
      } else {
        const match = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/);
        id = match ? match[1] : "";
      }
    }

    return VIDEO_ID.test(id) ? id : "";
  } catch {
    return "";
  }
}

/** Payload field validator: empty is fine, otherwise it must resolve to a YouTube video. */
export function validateYouTubeUrl(value) {
  if (!value || !String(value).trim()) return true;
  return extractYouTubeId(value)
    ? true
    : "Paste a valid YouTube link (for example https://www.youtube.com/watch?v=...) or the 11-character video ID.";
}

/** Payload field validator for optional http(s) links. */
export function validateOptionalUrl(value) {
  if (!value || !String(value).trim()) return true;
  try {
    const url = new URL(String(value).trim());
    return url.protocol === "https:" || url.protocol === "http:"
      ? true
      : "Links must start with https:// or http://";
  } catch {
    return "Enter a full link, for example https://example.com";
  }
}