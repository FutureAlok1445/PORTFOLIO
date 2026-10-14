import * as THREE from "three";
import { sceneLayout } from "./worldLayout";
import { labelTexture } from "./ObjectWorld";
export function createRoomShell({ world, box, mat, hotspots, textures }) {
  const { room: r, window: w } = sceneLayout,
    cx = (r.minX + r.maxX) / 2,
    cz = (r.minZ + r.maxZ) / 2,
    width = r.maxX - r.minX,
    depth = r.maxZ - r.minZ;
  const group = new THREE.Group();
  group.name = "complete-room";
  world.add(group);
  box(width + 0.5, 0.24, depth + 0.5, cx, -0.14, cz, "#334550", group);
  // Individually spaced wide floorboards, authored warm seams, no screen-space grid.
  for (let z = r.minZ + 0.38; z < r.maxZ; z += 0.78)
    box(
      width,
      0.035,
      0.755,
      cx,
      0.024,
      z,
      z % 1.56 < 0.78 ? "#554c45" : "#5f5147",
      group,
    );
  const wallMat = new THREE.MeshStandardMaterial({
    color: "#293b49",
    roughness: 0.94,
    side: THREE.FrontSide,
  });
  const wall = (width, height, x, y, z, ry = 0) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(width, height), wallMat);
    m.position.set(x, y, z);
    m.rotation.y = ry;
    m.receiveShadow = true;
    group.add(m);
    return m;
  };
  // Deliberate open diorama: inward faces reveal the room from exterior orbit views.
  const wx = w.position[0],
    wy = w.position[1],
    left = wx - w.width / 2,
    right = wx + w.width / 2,
    bottom = wy - w.height / 2,
    top = wy + w.height / 2;
  wall(left - r.minX, r.height, (left + r.minX) / 2, r.height / 2, r.minZ);
  wall(r.maxX - right, r.height, (r.maxX + right) / 2, r.height / 2, r.minZ);
  wall(w.width, bottom, wx, bottom / 2, r.minZ);
  wall(w.width, r.height - top, wx, (r.height + top) / 2, r.minZ);
  wall(depth, r.height, r.minX, r.height / 2, cz, Math.PI / 2);
  wall(depth, r.height, r.maxX, r.height / 2, cz, -Math.PI / 2);
  for (const y of [0.16, r.height])
    box(width, 0.13, 0.18, cx, y, r.minZ + 0.07, "#77919b", group);
  for (const x of [r.minX, r.maxX])
    box(0.15, 0.13, depth, x, 0.16, cz, "#77919b", group);
  // A true window aperture, solid frame and deep sill. The exterior is deliberately layered.
  for (const x of [left, right])
    box(0.17, w.height + 0.3, 0.28, x, wy, -6.84, "#8da29f", group);
  for (const y of [bottom, top])
    box(w.width + 0.35, 0.17, 0.28, wx, y, -6.84, "#8da29f", group);
  box(w.width + 0.7, 0.18, 0.8, wx, bottom - 0.09, -6.64, "#bba184", group);
  box(0.09, w.height, 0.2, wx, wy, -6.76, "#8da29f", group);
  box(w.width, 0.09, 0.2, wx, wy - 0.2, -6.76, "#8da29f", group);
  const skyMat = new THREE.MeshBasicMaterial({ color: "#233855" }),
    sky = new THREE.Mesh(new THREE.PlaneGeometry(w.width, w.height), skyMat);
  sky.position.set(wx, wy, -7.38);
  sky.name = "window-sky";
  sky.userData = { action: "window" };
  group.add(sky);
  hotspots.push(sky);
  const outside = new THREE.Group();
  outside.position.set(wx, wy, -7.2);
  group.add(outside);
  const night = new THREE.Group(),
    day = new THREE.Group();
  outside.add(night, day);
  const circle = (radius, color, parent, x, y, z) => {
    const m = new THREE.Mesh(
      new THREE.CircleGeometry(radius, 40),
      new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }),
    );
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  circle(0.48, "#f5e9c7", night, 2.75, 0.95, 0); // One full moon. No overlapped masking discs.
  for (let i = 0; i < 26; i++)
    circle(
      0.012 + (i % 3) * 0.006,
      "#dbe6ec",
      night,
      ((i * 37) % 91) / 10 - 4.5,
      ((i * 19) % 33) / 10 - 1.45,
      -0.01,
    );
  circle(0.53, "#f2c477", day, -2.8, 0.86, 0);
  const clouds = [];
  for (let i = 0; i < 4; i++) {
    const c = new THREE.Group();
    c.position.set(-3.3 + i * 2.1, 0.48 + (i % 2) * 0.62, 0.035);
    for (let k = 0; k < 3; k++) {
      const m = circle(
        0.24 + k * 0.035,
        "#d2dce1",
        c,
        k * 0.25,
        Math.sin(k) * 0.09,
        0,
      );
      m.scale.y = 0.4;
    }
    outside.add(c);
    clouds.push(c);
  }
  for (let layer = 0; layer < 2; layer++)
    for (let i = 0; i < 17; i++) {
      const h = 0.25 + ((i * 13 + layer * 7) % 10) * 0.065;
      box(
        0.45,
        h,
        0.035,
        wx - 4.35 + i * 0.54,
        wy - 1.92 + h / 2,
        -7.13 + layer * 0.05,
        layer ? "#263e50" : "#3d5261",
        group,
      );
      if (i % 3 === 0)
        box(
          0.045,
          0.07,
          0.02,
          wx - 4.35 + i * 0.54,
          wy - 1.81,
          -7.1 + layer * 0.05,
          "#d7a35d",
          group,
        );
    }
  const birdGroup = new THREE.Group();
  birdGroup.position.set(wx - 1.5, wy + 0.1, -7.05);
  group.add(birdGroup);
  const birds = [];
  for (let i = 0; i < 3; i++) {
    const geom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.1, 0, 0),
      new THREE.Vector3(0, -0.04, 0),
      new THREE.Vector3(0.1, 0, 0),
    ]);
    const m = new THREE.Line(
      geom,
      new THREE.LineBasicMaterial({ color: "#334550" }),
    );
    m.position.set(i * 0.4, i * 0.13, 0);
    birdGroup.add(m);
    birds.push(m);
  }
  const moonlight = new THREE.DirectionalLight("#b1cee1", 0.65);
  moonlight.position.set(5, 9, -6);
  moonlight.target.position.set(0, 0, 2);
  world.add(moonlight, moonlight.target);
  // Objects here tell a small, honest studio story; no invented credentials.
  const pot = box(0.7, 0.6, 0.7, -3.2, 0.34, -5.8, "#bd855c", group);
  for (let i = 0; i < 7; i++) {
    const leaf = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 5, 4),
      mat("#91b69d"),
    );
    leaf.scale.set(0.7, 2.6, 0.35);
    leaf.position.set(
      pot.position.x + Math.sin(i * 2.4) * 0.3,
      0.98 + Math.cos(i) * 0.12,
      -5.8 + Math.cos(i * 2.4) * 0.2,
    );
    leaf.rotation.z = Math.sin(i) * 0.55;
    group.add(leaf);
  }
  box(2.6, 0.08, 1.15, -1.5, 0.08, 4.1, "#8fae9c", group); // Patch's quiet floor mat.
  box(0.42, 0.6, 0.42, -2.95, 1.34, 0.22, "#334550", group);
  for (let i = 0; i < 4; i++) {
    const pen = box(
      0.035,
      0.65,
      0.035,
      -3.08 + i * 0.075,
      1.8,
      0.22,
      "#d7a35d",
      group,
    );
    pen.rotation.z = (i - 1) * 0.06;
  }
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 0.7),
    new THREE.MeshBasicMaterial({
      map: labelTexture("AFTER HOURS · ALOK SAHOO", textures, {
        paper: "#334550",
        ink: "#f2c477",
        height: 256,
        size: 45,
      }),
    }),
  );
  sign.position.set(-6.5, 5.85, -6.92);
  group.add(sign);
  let blend = 0;
  return {
    group,
    sky,
    night,
    day,
    update(dt, state, time) {
      const goal = state.timeOfDay === "day" ? 1 : 0;
      blend = THREE.MathUtils.damp(blend, goal, 5, dt);
      skyMat.color
        .copy(new THREE.Color("#233855"))
        .lerp(new THREE.Color("#c5d6d4"), blend);
      night.visible = blend < 0.999;
      night.traverse((o) => {
        if (o.material) {
          o.material.transparent = true;
          o.material.opacity =
            (1 - blend) *
            (o.geometry?.parameters?.radius < 0.1 && state.ambient
              ? 0.8 + 0.2 * Math.sin(time * 0.0007 + o.id)
              : 1);
        }
      });
      day.visible = blend > 0.001;
      day.traverse((o) => {
        if (o.material) {
          o.material.transparent = true;
          o.material.opacity = blend;
        }
      });
      birdGroup.visible = blend > 0.5;
      moonlight.color.set(blend > 0.5 ? "#ffdca9" : "#b1cee1");
      moonlight.intensity = 0.65 + blend * 0.5;
      clouds.forEach((c, i) => {
        c.position.x =
          -3.3 +
          i * 2.1 +
          (state.ambient ? Math.sin(time * 0.000035 + i) * 0.12 : 0);
      });
      birds.forEach((m, i) => {
        m.rotation.z = state.ambient ? Math.sin(time * 0.0015 + i) * 0.09 : 0;
      });
      return Math.abs(blend - goal) > 0.002;
    },
  };
}
