import { useEffect } from "react";
import { content } from "../data/content";
import { useLocation } from "react-router-dom";
export default function Seo() {
  const route = useLocation();
  useEffect(() => {
    const pathname = route.pathname.replace(/\/$/, "") || "/";
    const project = content.projects.find(
        (p) => pathname === "/projects/" + p.slug,
      ),
      known = pathname === "/" || pathname === "/projects" || project;
    const title = project
      ? project.title + " — Alok Sahoo"
      : pathname === "/projects"
        ? "Project files — Alok Sahoo"
        : known
          ? "After hours — Alok Sahoo"
          : "Page not found — Alok Sahoo";
    const description = project?.summary || content.profile.summary,
      origin = (
        import.meta.env.VITE_SITE_URL || window.location.origin
      ).replace(/\/$/, "");
    document.title = title;
    for (const [attribute, key, value] of [
      ["name", "description", description],
      ["property", "og:title", title],
      ["property", "og:description", description],
      [
        "property",
        "og:image",
        origin +
          "/images/after-hours/meta/og-" +
          (project?.slug || "home") +
          ".png",
      ],
      ["property", "og:url", origin + pathname],
      ["name", "twitter:title", title],
      ["name", "twitter:description", description],
      [
        "name",
        "twitter:image",
        origin +
          "/images/after-hours/meta/og-" +
          (project?.slug || "home") +
          ".png",
      ],
    ]) {
      let element = document.querySelector(
        "meta[" + attribute + '="' + key + '"]',
      );
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.append(element);
      }
      element.content = value;
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && known) canonical.href = origin + pathname;
  }, [route.pathname]);
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: content.profile.name,
      jobTitle: content.profile.title,
      email: content.profile.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Thane",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      sameAs: content.socials.map((s) => s.url),
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: content.education[0].institution,
      },
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, []);
  return null;
}
