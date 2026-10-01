import { useState } from "react";
import ProjectArt from "./ProjectArt";
export default function ProjectMedia({ project, priority = false }) {
  const [failed, setFailed] = useState(false);
  return project.image && !failed ? (
    <img
      src={project.image}
      alt={project.imageAlt || project.title + " application screenshot"}
      loading={priority ? "eager" : "lazy"}
      width="1000"
      height="650"
      onError={() => setFailed(true)}
    />
  ) : (
    <ProjectArt project={project} priority={priority} />
  );
}
