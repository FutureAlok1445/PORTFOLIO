import { useState } from "react";
import ProjectArt from "./ProjectArt";
export default function ProjectMedia({ project }) {
  const [failed, setFailed] = useState(false);
  return project.image && !failed ? (
    <img
      src={project.image}
      alt={project.title + " project preview"}
      loading="lazy"
      width="1000"
      height="650"
      onError={() => setFailed(true)}
    />
  ) : (
    <ProjectArt project={project} />
  );
}
