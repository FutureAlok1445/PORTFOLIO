import * as THREE from "three";
import { sceneLayout } from "./worldLayout";
export function createWorldDebug(world) {
  const root = new THREE.Group();
  root.name = "development-only-spatial-debug";
  world.scene.add(root);
  root.add(new THREE.AxesHelper(3));
  for (const s of sceneLayout.solids) {
    if (s.min) {
      const b = new THREE.Box3(
        new THREE.Vector3(...s.min),
        new THREE.Vector3(...s.max),
      );
      root.add(new THREE.Box3Helper(b, 0xf2c477));
    } else {
      const [x, z, r, h] = s.cylinder;
      const m = new THREE.Mesh(
        new THREE.CylinderGeometry(r, r, h, 48),
        new THREE.MeshBasicMaterial({
          color: 0x91b69d,
          wireframe: true,
          transparent: true,
          opacity: 0.35,
        }),
      );
      m.position.set(x, h / 2, z);
      root.add(m);
    }
  }
  const artifacts = world.artifacts.map((a) => {
    const h = new THREE.BoxHelper(a.artifact, 0x9bc7d6);
    root.add(h);
    return h;
  });
  const frustum = new THREE.CameraHelper(world.camera);
  frustum.visible = false;
  root.add(frustum);
  const hitboxes = world.hotspots.map((o) => {
    const helper = new THREE.BoxHelper(o, 0xd98470);
    root.add(helper);
    return helper;
  });
  window.__workshopDebug = { frustum, root };
  return {
    update() {
      hitboxes.forEach((h) => h.update());
      artifacts.forEach((h) => h.update());
      frustum.update();
    },
    root,
  };
}
