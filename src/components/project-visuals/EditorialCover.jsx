import { ArrowUpRight } from "lucide-react";
export default function EditorialCover({ project, priority }) {
  if (project.visual === "agency")
    return (
      <div className="agency-study">
        <div className="agency-mark">
          <img
            src={project.cover.image.src}
            alt={project.cover.image.alt}
            width="1000"
            height="1000"
            loading={priority ? "eager" : "lazy"}
          />
        </div>
        <div className="agency-composition" aria-label="Agency visitor journey">
          {project.cover.journey.map((label, i) => (
            <span key={label}>
              {label}
              {i === project.cover.journey.length - 1 && (
                <ArrowUpRight size={13} aria-hidden="true" />
              )}
            </span>
          ))}
        </div>
      </div>
    );
  return (
    <div className="commerce-study">
      <div className="commerce-images">
        {project.cover.images.map(({ src, alt }, i) => (
          <img
            key={src}
            src={src}
            alt={alt}
            width="1000"
            height="1000"
            loading={priority && i === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>
      <div className="commerce-journey">
        {project.cover.journey.map((label, i) => (
          <span key={label}>
            {label}
            {i === project.cover.journey.length - 1 && (
              <ArrowUpRight size={13} aria-hidden="true" />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
