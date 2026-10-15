import { content } from "../data/content.js";
// One world-unit system. Furniture heights are stylized, shared by every controller.
export function archiveLayoutFor(count) {
  const radius = Math.max(
    5.4,
    3.1 / (2 * Math.sin(Math.PI / Math.max(3, count))),
  );
  return {
    count,
    radius,
    centerX: 7.6 + radius,
    centerZ: 1.6,
    baseRadius: radius + 1.05,
  };
}
export const archiveLayout = archiveLayoutFor(content.projects.length);
export const sceneLayout = {
  floorY: 0,
  tabletop: 1.025,
  room: {
    minX: -12.4,
    maxX: archiveLayout.centerX + archiveLayout.baseRadius + 1.4,
    minZ: -7,
    maxZ: archiveLayout.centerZ + archiveLayout.baseRadius + 1.4,
    height: 7.2,
  },
  window: { position: [5.2, 4.45, -6.87], width: 9.4, height: 4.2 },
  anchors: {
    monitor: [-0.35, 2.4, -0.7],
    notebook: [2.05, 1.2, 0.85],
    project: [
      archiveLayout.centerX,
      2,
      archiveLayout.centerZ + archiveLayout.radius + 1,
    ],
    toolkit: [-8, 2.6, -1],
    journey: [-10.08, 4.9, -2.02],
    credentials: [-5, 1.2, 5.8],
    contact: [5.2, 1.4, 1.2],
    window: [5.2, 4.5, -6.7],
  },
  // Major solid proxies, not decoration. Camera radius and swept-segment collision apply.
  solids: [
    {id:"desktop-backboard",min:[-4,0,-2.45],max:[4,4.35,-2.28]},
    {id:"career-board",min:[-11.05,0,-2.35],max:[-5.95,6.15,-2.05]},
    { id: "desk", min: [-4, 0, -2.3], max: [4, 3.35, 2.3] },
    { id: "workbench", min: [-10.7, 0, -1.6], max: [-5.3, 3.4, 3.3] },
    { id: "records", min: [-6.15, 0, 3.9], max: [-3.85, 1.9, 5.7] },
    { id: "message-desk", min: [4.1, 0, 0.1], max: [6.3, 1.4, 2.3] },
    {
      id: "archive",
      cylinder: [
        archiveLayout.centerX,
        archiveLayout.centerZ,
        archiveLayout.baseRadius,
        3.35,
      ],
    },
  ],
};
