import SystemCover from "./project-visuals/SystemCover";
import EditorialCover from "./project-visuals/EditorialCover";
export default function ProjectArt({ project, priority = false }) {
  const kind = project.cover?.kind || project.visual;
  return (
    <div className={"project-cover-art cover-" + kind}>
      {["commerce", "agency"].includes(kind) ? (
        <EditorialCover project={project} priority={priority} />
      ) : (
        <SystemCover project={project} />
      )}
      <span className="cover-evidence">
        {project.cover?.caption || "System illustration"}
      </span>
    </div>
  );
}
