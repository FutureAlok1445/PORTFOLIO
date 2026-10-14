import * as THREE from "three";
import { OBB } from "three/addons/math/OBB.js";
import { sceneLayout, archiveLayout } from "./worldLayout";
function bounds(root) {
  root.updateWorldMatrix(true, true);
  const box = new THREE.Box3(),
    inverse = root.matrixWorld.clone().invert();
  root.traverse((o) => {
    if (!o.geometry) return;
    o.geometry.computeBoundingBox();
    box.union(
      o.geometry.boundingBox
        .clone()
        .applyMatrix4(
          new THREE.Matrix4().multiplyMatrices(inverse, o.matrixWorld),
        ),
    );
  });
  return new OBB().fromBox3(box).applyMatrix4(root.matrixWorld);
}
export function spatialAudit(world) {
  world.world.updateMatrixWorld(true);
  const artifacts = world.artifacts.map((f) => ({
      id: f.index,
      obb: bounds(f.artifact),
    })),
    collisions = [];
  for (let i = 0; i < artifacts.length; i++)
    for (let j = i + 1; j < artifacts.length; j++)
      if (artifacts[i].obb.intersectsOBB(artifacts[j].obb, 0.005))
        collisions.push(["artifact", i, j]);
  const furniture = sceneLayout.solids.filter((s) => s.min);
  for (const a of artifacts)
    for (const s of furniture) {
      const b = new THREE.Box3(
        new THREE.Vector3(...s.min),
        new THREE.Vector3(...s.max),
      );
      if (a.obb.intersectsBox3(b)) collisions.push([a.id, s.id]);
    }
  const mountedPairs = new Set([
    "desk:desktop-backboard",
    "desktop-backboard:desk",
    "career-board:workbench",
    "workbench:career-board",
  ]);
  for (let i = 0; i < furniture.length; i++)
    for (let j = i + 1; j < furniture.length; j++) {
      const a = furniture[i],
        b = furniture[j];
      if (mountedPairs.has(a.id + ":" + b.id)) continue;
      const ab = new THREE.Box3(
          new THREE.Vector3(...a.min),
          new THREE.Vector3(...a.max),
        ),
        bb = new THREE.Box3(
          new THREE.Vector3(...b.min),
          new THREE.Vector3(...b.max),
        );
      if (ab.intersectsBox(bb)) collisions.push([a.id, b.id]);
    }
  const r = sceneLayout.room;
  for (const a of artifacts) {
    const b = new THREE.Box3();
    for (const x of [-1, 1])
      for (const y of [-1, 1])
        for (const z of [-1, 1])
          b.expandByPoint(
            new THREE.Vector3(x, y, z)
              .multiply(a.obb.halfSize)
              .applyMatrix3(a.obb.rotation)
              .add(a.obb.center),
          );
    if (b.min.y < -0.01) collisions.push([a.id, "floor"]);
    if (
      b.min.x < r.minX ||
      b.min.z < r.minZ ||
      b.max.x > r.maxX ||
      b.max.z > r.maxZ
    )
      collisions.push([a.id, "room envelope"]);
  }
  const projected = new THREE.Box2();
  for (const a of artifacts)
    for (const x of [-1, 1])
      for (const y of [-1, 1])
        for (const z of [-1, 1]) {
          const point = new THREE.Vector3(x, y, z)
            .multiply(a.obb.halfSize)
            .applyMatrix3(a.obb.rotation)
            .add(a.obb.center)
            .project(world.camera);
          projected.expandByPoint(new THREE.Vector2(point.x, point.y));
        }
  return {
    projected: { min: projected.min.toArray(), max: projected.max.toArray() },
    collisions,
    ring: {
      radius: archiveLayout.radius,
      chord: 2 * archiveLayout.radius * Math.sin(Math.PI / artifacts.length),
      center: [archiveLayout.centerX, archiveLayout.centerZ],
    },
    objects: artifacts.map((a) => ({
      id: a.id,
      center: a.obb.center.toArray(),
      halfSize: a.obb.halfSize.toArray(),
    })),
    solids: sceneLayout.solids,
  };
}
