import { useEffect } from "react";
import { site } from "../config/site.ts";
import { isHttpsUrl } from "../config/selectors.ts";

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function Metadata() {
  useEffect(() => {
    if (!isHttpsUrl(site.canonicalUrl)) return;
    const origin = site.canonicalUrl.replace(/\/$/, "");
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${origin}/`;
    upsertMeta("property", "og:url", `${origin}/`);
    upsertMeta("property", "og:image", `${origin}${site.assets.socialPreview}`);
    upsertMeta("name", "twitter:image", `${origin}${site.assets.socialPreview}`);
  }, []);

  return null;
}
