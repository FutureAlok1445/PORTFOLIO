// Authoritative scene poses. No other component writes camera transforms.
import { archiveLayout, sceneLayout } from "./worldLayout";
import { content } from "../data/content";
export const sceneChapters = [
  {
    id: "desk",
    label: "The desk",
    targetId: "desk",
    position: [
      10 + archiveLayout.radius * 1.7,
      16 + archiveLayout.radius * 0.5,
      21 + archiveLayout.radius * 1.5,
    ],
    target: [(sceneLayout.room.minX + sceneLayout.room.maxX) / 2, 1.8, 1.8],
    halfHeight: Math.max(10.6, archiveLayout.radius + 4.6),
    copySide: "left",
    light: "night",
  },
  {
    id: "about",
    label: "Field notes",
    targetId: "about",
    position: [5.2, 6.8, 6.1],
    target: [1.5, 1.05, 0.7],
    halfHeight: 3.4,
    copySide: "left",
    light: "night",
  },
  {
    id: "work",
    label: "The archive",
    targetId: "work",
    position: [archiveLayout.centerX, 11, archiveLayout.centerZ + 16],
    target: [archiveLayout.centerX, 1.2, archiveLayout.centerZ],
    halfHeight: archiveLayout.baseRadius + 0.8,
    copySide: "right",
    light: "night",
  },
  {
    id: "skills",
    label: "Toolkit",
    targetId: "skills",
    position: [-6.2, 7, 8.5],
    target: [-8, 2.3, 0.1],
    halfHeight: 3.9,
    copySide: "left",
    light: "night",
  },
  {
    id: "experience",
    label: "Journey wall",
    targetId: "experience",
    position: [-9.6, 7.6, 14.4],
    target: [-7.8, 2.7, 1.5],
    halfHeight: 5.4,
    copySide: "right",
    light: "night",
  },
  {
    id: "contact",
    label: "Exit notes",
    targetId: "contact",
    position: [21, 16, 29],
    target: [7, 1.8, 2],
    halfHeight: 10.6,
    copySide: "left",
    light: "night",
  },
];
sceneChapters.forEach((chapter) => {
  chapter.label =
    content.workshop.interface.chapterLabels[chapter.id] || chapter.label;
});
export const chapterById = Object.fromEntries(
  sceneChapters.map((chapter) => [chapter.id, chapter]),
);
export const patchZones = {
  home: [0.55, 1.025, 1.87],
  walkEnd: [1.15, 1.025, 1.87],
};
