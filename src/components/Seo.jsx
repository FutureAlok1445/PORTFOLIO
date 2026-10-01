import { useEffect } from "react";
import { content } from "../data/content";
export default function Seo() {
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
