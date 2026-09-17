// ────────────────────────────────────────────────────────────
// LifeDrop — usePageSEO hook
// Updates document.title, meta description, and canonical URL
// on each route without any third-party library.
// ────────────────────────────────────────────────────────────
import { useEffect } from "react";

const BASE_URL = "https://blood-donor-30e89.web.app";
const DEFAULT_TITLE = "LifeDrop — Emergency Blood Donor Network";
const DEFAULT_DESC =
  "Pakistan's Emergency Blood Donor Network. Find compatible blood donors near you instantly with real-time geo-location matching and push notifications.";

/**
 * @param {{ title?: string, description?: string, canonicalPath?: string }} options
 */
const usePageSEO = ({ title, description, canonicalPath } = {}) => {
  useEffect(() => {
    // ── Title ──────────────────────────────────────────────
    const prevTitle = document.title;
    document.title = title || DEFAULT_TITLE;

    // ── Meta description ───────────────────────────────────
    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") ?? "";
    if (metaDesc) {
      metaDesc.setAttribute("content", description || DEFAULT_DESC);
    }

    // ── OG title ──────────────────────────────────────────
    let ogTitle = document.querySelector('meta[property="og:title"]');
    const prevOgTitle = ogTitle?.getAttribute("content") ?? "";
    if (ogTitle) {
      ogTitle.setAttribute("content", title || DEFAULT_TITLE);
    }

    // ── OG description ────────────────────────────────────
    let ogDesc = document.querySelector('meta[property="og:description"]');
    const prevOgDesc = ogDesc?.getAttribute("content") ?? "";
    if (ogDesc) {
      ogDesc.setAttribute("content", description || DEFAULT_DESC);
    }

    // ── OG url ────────────────────────────────────────────
    let ogUrl = document.querySelector('meta[property="og:url"]');
    const prevOgUrl = ogUrl?.getAttribute("content") ?? "";
    const fullUrl = canonicalPath ? `${BASE_URL}${canonicalPath}` : BASE_URL;
    if (ogUrl) {
      ogUrl.setAttribute("content", fullUrl);
    }

    // ── Twitter title ─────────────────────────────────────
    let twTitle = document.querySelector('meta[name="twitter:title"]');
    const prevTwTitle = twTitle?.getAttribute("content") ?? "";
    if (twTitle) {
      twTitle.setAttribute("content", title || DEFAULT_TITLE);
    }

    // ── Twitter description ───────────────────────────────
    let twDesc = document.querySelector('meta[name="twitter:description"]');
    const prevTwDesc = twDesc?.getAttribute("content") ?? "";
    if (twDesc) {
      twDesc.setAttribute("content", description || DEFAULT_DESC);
    }

    // ── Canonical link ────────────────────────────────────
    let canonical = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonical?.getAttribute("href") ?? "";
    if (canonical) {
      canonical.setAttribute("href", fullUrl);
    }

    // Cleanup: restore previous values on unmount
    return () => {
      document.title = prevTitle;
      metaDesc?.setAttribute("content", prevDesc);
      ogTitle?.setAttribute("content", prevOgTitle);
      ogDesc?.setAttribute("content", prevOgDesc);
      ogUrl?.setAttribute("content", prevOgUrl);
      twTitle?.setAttribute("content", prevTwTitle);
      twDesc?.setAttribute("content", prevTwDesc);
      canonical?.setAttribute("href", prevCanonical);
    };
  }, [title, description, canonicalPath]);
};

export default usePageSEO;
