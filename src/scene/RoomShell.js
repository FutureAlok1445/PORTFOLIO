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
  box(width, 0.24, depth, cx, -0.14, cz, "#334550", group);
  // Individually spaced wide floorboards, authored warm seams, evenly distributed to room edge
  const boardCount = Math.round(depth / 0.78);
  const boardPitch = depth / boardCount;
  for (let i = 0; i < boardCount; i++) {
    const z = r.minZ + (i + 0.5) * boardPitch;
    box(
      width,
      0.035,
      boardPitch - 0.025,
      cx,
      0.024,
      z,
      i % 2 === 0 ? "#554c45" : "#5f5147",
      group,
    );
  }

  // Woven studio area rug under the main desk and ergonomic chair
  const rugGroup = new THREE.Group();
  rugGroup.name = "studio-area-rug";
  group.add(rugGroup);
  box(9.2, 0.022, 5.8, -0.2, 0.044, 1.15, "#2b3945", rugGroup);
  box(8.7, 0.026, 5.3, -0.2, 0.048, 1.15, "#364654", rugGroup);
  // Warm amber & cream woven geometric border strips on the rug
  box(8.8, 0.028, 0.12, -0.2, 0.05, -1.45, "#d7a35d", rugGroup);
  box(8.8, 0.028, 0.12, -0.2, 0.05, 3.75, "#d7a35d", rugGroup);
  box(0.12, 0.028, 5.3, -4.55, 0.05, 1.15, "#d7a35d", rugGroup);
  box(0.12, 0.028, 5.3, 4.15, 0.05, 1.15, "#d7a35d", rugGroup);

  const wallMat = new THREE.MeshStandardMaterial({
    color: "#293b49",
    roughness: 0.9,
    metalness: 0.05,
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
  // Deliberate open room with rich architectural wainscoting & trim
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

  // Architectural baseboards, crown molding, and lower walnut wainscot rail
  for (const y of [0.16, 2.1, r.height])
    box(width, 0.11, 0.14, cx, y, r.minZ + 0.07, y === 2.1 ? "#4b3f36" : "#77919b", group);
  for (const x of [r.minX, r.maxX])
    box(0.14, 0.13, depth, x === r.maxX ? r.maxX - 0.07 : r.minX + 0.07, 0.16, cz, "#77919b", group);

  // A true window aperture, solid frame, slatted upper blinds, and deep sill
  for (const x of [left, right])
    box(0.17, w.height + 0.3, 0.28, x, wy, -6.84, "#8da29f", group);
  for (const y of [bottom, top])
    box(w.width + 0.35, 0.17, 0.28, wx, y, -6.84, "#8da29f", group);
  box(w.width + 0.7, 0.18, 0.8, wx, bottom - 0.09, -6.64, "#bba184", group);
  box(0.09, w.height, 0.2, wx, wy, -6.76, "#8da29f", group);
  box(w.width, 0.09, 0.2, wx, wy - 0.2, -6.76, "#8da29f", group);
  // Subtle Venetian blind slats at top of window
  for (let s = 0; s < 5; s++) {
    box(w.width - 0.2, 0.035, 0.12, wx, top - 0.18 - s * 0.11, -6.72, "#d8cebe", group);
  }

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
  circle(0.48, "#f5e9c7", night, 2.75, 0.95, 0);
  const moonHalo = circle(0.85, "#87a9c4", night, 2.75, 0.95, -0.005);
  moonHalo.material.transparent = true;
  moonHalo.material.opacity = 0.18;

  for (let i = 0; i < 34; i++)
    circle(
      0.012 + (i % 3) * 0.006,
      "#dbe6ec",
      night,
      ((i * 37) % 91) / 10 - 4.5,
      ((i * 19) % 33) / 10 - 1.45,
      -0.01,
    );

  // Subtle nocturnal monsoon rain streaks outside the window
  const rainDrops = [];
  for (let i = 0; i < 18; i++) {
    const dropGeom = new THREE.PlaneGeometry(0.014, 0.34);
    const dropMat = new THREE.MeshBasicMaterial({
      color: "#9bc7d6",
      transparent: true,
      opacity: 0.26,
    });
    const drop = new THREE.Mesh(dropGeom, dropMat);
    drop.position.set(
      -4.1 + i * 0.48,
      ((i * 1.3) % 3.6) - 1.8,
      0.04,
    );
    drop.rotation.z = -0.14;
    night.add(drop);
    rainDrops.push(drop);
  }

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
      const h = 0.28 + ((i * 13 + layer * 7) % 10) * 0.075;
      box(
        0.46,
        h,
        0.035,
        wx - 4.35 + i * 0.54,
        wy - 1.92 + h / 2,
        -7.13 + layer * 0.05,
        layer ? "#263e50" : "#3d5261",
        group,
      );
      if (i % 2 === 0)
        box(
          0.05,
          0.075,
          0.02,
          wx - 4.35 + i * 0.54,
          wy - 1.78,
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
  const moonlight = new THREE.DirectionalLight("#b1cee1", 0.72);
  moonlight.position.set(5, 9, -6);
  moonlight.target.position.set(0, 0, 2);
  world.add(moonlight, moonlight.target);

  // Cool frost-blue architectural rim light & warm shelf accent light
  const rimLight = new THREE.PointLight("#87a9c4", 1.8, 18);
  rimLight.position.set(-6, 5.5, -4.5);
  world.add(rimLight);

  const trophyLight = new THREE.PointLight("#f2c477", 2.4, 9);
  trophyLight.position.set(-10.8, 5.2, 2.6);
  world.add(trophyLight);

  // Volumetric warm amber light cone under the desk lamp
  const coneGeom = new THREE.ConeGeometry(1.55, 2.35, 32, 1, true);
  const coneMat = new THREE.MeshBasicMaterial({
    color: "#ffd9a0",
    transparent: true,
    opacity: 0.075,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const lampCone = new THREE.Mesh(coneGeom, coneMat);
  lampCone.position.set(1.72, 1.95, -0.15);
  lampCone.rotation.z = -0.36;
  lampCone.rotation.x = 0.28;
  group.add(lampCone);

  // Cozy Built-In Walnut Window Bench + Cushions + Books under the Window (z = -5.9)
  const benchGroup = new THREE.Group();
  benchGroup.name = "window-bench";
  group.add(benchGroup);
  box(7.4, 0.14, 1.15, wx, 0.58, -5.95, "#675347", benchGroup);
  for (const bx of [wx - 3.3, wx, wx + 3.3]) {
    box(0.18, 0.52, 0.95, bx, 0.26, -5.95, "#493e35", benchGroup);
  }
  // Soft linen seat cushions on window bench
  box(3.3, 0.12, 0.98, wx - 1.75, 0.71, -5.95, "#d8cebe", benchGroup);
  box(3.3, 0.12, 0.98, wx + 1.75, 0.71, -5.95, "#d8cebe", benchGroup);
  // Throw pillows & stacked journals on window bench
  const pillowL = box(0.65, 0.45, 0.22, wx - 3.05, 0.96, -6.15, "#8fae9c", benchGroup);
  pillowL.rotation.z = -0.18;
  const pillowR = box(0.65, 0.45, 0.22, wx + 3.05, 0.96, -6.15, "#d98e7d", benchGroup);
  pillowR.rotation.z = 0.18;
  box(0.62, 0.09, 0.46, wx + 0.3, 0.81, -5.88, "#334550", benchGroup);
  box(0.56, 0.08, 0.42, wx + 0.32, 0.89, -5.88, "#d7a35d", benchGroup);

  // Standing Warm Studio Floor Lamp beside the Window Bench (x = 10.1, z = -5.7)
  const floorLamp = new THREE.Group();
  floorLamp.position.set(10.1, 0, -5.7);
  group.add(floorLamp);
  box(0.75, 0.08, 0.75, 0, 0.04, 0, "#334550", floorLamp);
  box(0.08, 3.5, 0.08, 0, 1.8, 0, "#d7a35d", floorLamp);
  const fShade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.52, 0.62, 20),
    mat("#f5efe5"),
  );
  fShade.position.set(0, 3.55, 0);
  floorLamp.add(fShade);

  // Analog Studio Wall Clock on Back Wall (x = -0.35, y = 5.55, z = -6.82)
  const clockGroup = new THREE.Group();
  clockGroup.position.set(-0.35, 5.55, -6.84);
  group.add(clockGroup);
  const clockRim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.58, 0.08, 28),
    mat("#675347"),
  );
  clockRim.rotation.x = Math.PI / 2;
  clockGroup.add(clockRim);
  const clockFace = new THREE.Mesh(
    new THREE.CircleGeometry(0.49, 28),
    new THREE.MeshBasicMaterial({ color: "#f5efe5" }),
  );
  clockFace.position.z = 0.045;
  clockGroup.add(clockFace);
  // Hour & Minute hands
  const hourHand = box(0.035, 0.24, 0.02, -0.06, 0.06, 0.055, "#19212b", clockGroup);
  hourHand.rotation.z = 0.75;
  const minHand = box(0.025, 0.36, 0.02, 0.08, 0.1, 0.058, "#d98470", clockGroup);
  minHand.rotation.z = -0.45;

  // Lush studio planters (left by desk & right by window bench)
  for (const [px, pz] of [[-3.2, -5.8], [8.9, -5.75]]) {
    const pot = box(0.7, 0.6, 0.7, px, 0.34, pz, "#bd855c", group);
    for (let i = 0; i < 7; i++) {
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 6, 5),
        mat("#91b69d"),
      );
      leaf.scale.set(0.7, 2.6, 0.35);
      leaf.position.set(
        pot.position.x + Math.sin(i * 2.4) * 0.3,
        0.98 + Math.cos(i) * 0.12,
        pz + Math.cos(i * 2.4) * 0.2,
      );
      leaf.rotation.z = Math.sin(i) * 0.55;
      group.add(leaf);
    }
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
    lampCone,
    update(dt, state, time) {
      const goal = state.timeOfDay === "day" ? 1 : 0;
      blend = THREE.MathUtils.damp(blend, goal, 5, dt);
      skyMat.color
        .copy(new THREE.Color("#233855"))
        .lerp(new THREE.Color("#c5d6d4"), blend);
      night.visible = blend < 0.999;
      lampCone.visible = Boolean(state.lampOn);
      coneMat.opacity = state.lampOn ? 0.065 + (1 - blend) * 0.035 : 0;

      night.traverse((o) => {
        if (o.material && !rainDrops.includes(o) && o !== moonHalo) {
          o.material.transparent = true;
          o.material.opacity =
            (1 - blend) *
            (o.geometry?.parameters?.radius < 0.1 && state.ambient
              ? 0.8 + 0.2 * Math.sin(time * 0.0007 + o.id)
              : 1);
        }
      });
      rainDrops.forEach((drop, idx) => {
        drop.material.opacity = (1 - blend) * (state.ambient ? 0.26 : 0.1);
        if (state.ambient) {
          drop.position.y = 1.8 - ((time * 0.0022 + idx * 0.37) % 3.6);
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
