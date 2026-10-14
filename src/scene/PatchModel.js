import * as THREE from "three";
// A small voxel sculpture keeps feline anatomy readable from orbit and overhead.
// Its proportions and colours follow the existing original Patch sheets.
export function createPatchModel(world, mat) {
  const root = new THREE.Group();
  root.name = "Patch-voxel-cat";
  world.add(root);
  const part = (w, h, d, x, y, z, color, parent = root) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };
  part(0.47, 0.32, 0.66, 0, 0.29, 0, "#303740");
  part(0.36, 0.23, 0.25, 0, 0.24, 0.27, "#f5f0e6");
  const head = new THREE.Group();
  head.position.set(0, 0.54, 0.3);
  root.add(head);
  part(0.46, 0.36, 0.32, 0, 0, 0, "#303740", head);
  part(0.25, 0.11, 0.05, 0, -0.09, 0.18, "#f5f0e6", head);
  const ears = [];
  for (const x of [-0.17, 0.17]) {
    const ear = new THREE.Mesh(
      new THREE.ConeGeometry(0.115, 0.24, 4),
      mat("#303740"),
    );
    ear.position.set(x, 0.25, -0.02);
    ear.rotation.y = Math.PI / 4;
    ear.castShadow = true;
    head.add(ear);
    ears.push(ear);
    part(0.055, 0.08, 0.025, x, 0.25, 0.077, "#d98470", head);
  }
  for (const side of [-1, 1])
    for (const y of [-0.06, -0.11])
      part(0.13, 0.012, 0.02, side * 0.29, y, 0.17, "#f5f0e6", head);
  const eyes = [];
  for (const x of [-0.12, 0.12]) {
    eyes.push(part(0.085, 0.085, 0.025, x, 0.015, 0.174, "#f2c477", head));
    part(0.025, 0.06, 0.012, x, 0.015, 0.19, "#111821", head);
  }
  part(0.055, 0.04, 0.035, 0, -0.045, 0.2, "#d98470", head);
  const paws = [];
  for (const x of [-0.16, 0.16])
    for (const z of [-0.22, 0.23]) {
      const paw = part(0.13, 0.23, 0.15, x, 0.115, z, "#f5f0e6");
      paws.push(paw);
    }
  const tail = new THREE.Group();
  tail.position.set(0, 0.28, -0.33);
  root.add(tail);
  for (let i = 0; i < 6; i++) {
    const block = part(
      0.1,
      0.1,
      0.14,
      Math.sin(i * 0.3) * 0.12,
      i * 0.07,
      -i * 0.09,
      i === 5 ? "#f5f0e6" : "#303740",
      tail,
    );
    block.rotation.x = -0.2;
  }
  return {
    root,
    update(state, time) {
      const walk = state === "walk" || state === "return",
        sleep = state === "sleep";
      const stretch = state === "stretch",
        settle = state === "settle";
      root.scale.set(
        1,
        sleep
          ? 0.65
          : stretch
            ? 0.8
            : settle
              ? 0.92
              : state === "stand"
                ? 1.08
                : 1,
        sleep ? 0.86 : stretch ? 0.96 : 0.8,
      );
      head.rotation.y = ["look", "pet", "ear"].includes(state)
        ? Math.sin(time * 0.005) * 0.2
        : 0;
      head.rotation.x = sleep ? 0.35 : state === "pet" ? -0.13 : 0;
      eyes.forEach((m) => (m.scale.y = sleep || state === "blink" ? 0.15 : 1));
      tail.rotation.y =
        Math.sin(time * 0.002) * (walk || state === "tail" ? 0.3 : 0.12);
      ears.forEach(
        (ear, i) =>
          (ear.rotation.z =
            state === "ear" ? Math.sin(time * 0.009 + i) * 0.14 : 0),
      );
      paws.forEach((m, i) => {
        m.position.y =
          0.115 +
          (walk
            ? Math.max(
                0,
                Math.sin(time * 0.015 + (i === 0 || i === 3 ? 0 : Math.PI)),
              ) * 0.07
            : state === "paw" && i === 1
              ? Math.max(0, Math.sin(time * 0.01)) * 0.12
              : 0);
      });
    },
  };
}
