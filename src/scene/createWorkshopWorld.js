import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { content } from "../data/content";
import { projectArtFor } from "../data/projectArt";
import { buildArtifact } from "./ArtifactModels";
import { upgradeObjectWorld } from "./ObjectWorld";
import { archiveLayout } from "./worldLayout";
import { createRoomShell } from "./RoomShell";
import { createPatchModel } from "./PatchModel";
export function createWorkshopWorld(invalidate) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-4.4, 4.4, 3.08, -3.08, 0.1, 150);
  const base = new THREE.Vector3(7.5, 6.2, 9.8);
  camera.position.copy(base);
  camera.lookAt(0, 1.65, 0);
  const world = new THREE.Group();
  scene.add(world);
  const materials = new Map();
  const boxGeometries = new Map(),
    cylinderGeometries = new Map();
  const mat = (color) => {
    if (!materials.has(color))
      materials.set(
        color,
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.88,
          metalness: 0.02,
        }),
      );
    return materials.get(color);
  };
  const hotspots = [];
  function box(w, h, d, x, y, z, color, parent = world) {
    const geometryKey = [w, h, d].join("/");
    if (!boxGeometries.has(geometryKey))
      boxGeometries.set(
        geometryKey,
        new RoundedBoxGeometry(
          w,
          h,
          d,
          2,
          Math.min(0.055, w / 6, h / 6, d / 6),
        ),
      );
    const mesh = new THREE.Mesh(boxGeometries.get(geometryKey), mat(color));
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function cylinder(rt, rb, h, x, y, z, color) {
    const geometryKey = [rt, rb, h].join("/");
    if (!cylinderGeometries.has(geometryKey))
      cylinderGeometries.set(
        geometryKey,
        new THREE.CylinderGeometry(rt, rb, h, 24),
      );
    const mesh = new THREE.Mesh(
      cylinderGeometries.get(geometryKey),
      mat(color),
    );
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    world.add(mesh);
    return mesh;
  }
  function bar(a, b, r, color) {
    const start = new THREE.Vector3(...a),
      end = new THREE.Vector3(...b);
    const mesh = cylinder(r, r, start.distanceTo(end), 0, 0, 0, color);
    mesh.position.copy(start.add(end).multiplyScalar(0.5));
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      end.sub(new THREE.Vector3(...a)).normalize(),
    );
    return mesh;
  }
  // Wall, desk and soft floor shadows.
  box(8, 0.14, 4.6, 0, 0.95, 0, "#775846");
  box(8, 0.1, 4.6, 0, 0.83, 0, "#493e35");
  for (const x of [-3.4, 3.4])
    for (const z of [-1.7, 1.7]) box(0.18, 0.82, 0.18, x, 0.4, z, "#3e4950");
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(Math.max(40, archiveLayout.centerX * 3), 30),
    mat("#19212b"),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  box(8, 4.5, 0.08, 0, 2.1, -2.36, "#202a34");
  // Warm wall memo and small cyan pinned artifact.
  const memo = box(1.1, 1.3, 0.03, -2.55, 2.95, -2.29, "#e8ddc9");
  memo.rotation.z = 0.06;
  memo.userData.target = "contact";
  hotspots.push(memo);
  box(0.36, 0.09, 0.03, -2.55, 3.64, -2.26, "#d7a35d");
  const pin = box(0.9, 0.96, 0.03, 2.58, 3.15, -2.28, "#87a9c4");
  pin.rotation.z = -0.09;
  // Tilted monitor and genuinely emissive screen.
  const monitor = new THREE.Group();
  monitor.position.set(-0.35, 2.3, -0.9);
  monitor.rotation.y = -0.06;
  world.add(monitor);
  const shell = box(3.15, 1.92, 0.22, 0, 0, 0, "#111820", monitor);
  shell.userData.target = "work";
  hotspots.push(shell);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.89, 1.64),
    new THREE.MeshStandardMaterial({
      color: "#213b49",
      emissive: "#366780",
      emissiveIntensity: 0.35,
      roughness: 1,
    }),
  );
  screen.position.set(0, 0.03, 0.116);
  screen.userData.target = "work";
  monitor.add(screen);
  hotspots.push(screen);
  box(2.86, 0.17, 0.014, 0, 0.77, 0.124, "#354c59", monitor);
  for (let i = 0; i < 3; i++) {
    const dot = new THREE.Mesh(
      new THREE.CircleGeometry(0.024, 12),
      new THREE.MeshBasicMaterial({
        color: ["#d98e7d", "#d7a35d", "#8fae9c"][i],
      }),
    );
    dot.position.set(-1.26 + i * 0.1, 0.77, 0.137);
    monitor.add(dot);
  }
  box(0.18, 0.43, 0.16, -0.35, 1.28, -0.9, "#53626a");
  box(1.05, 0.06, 0.61, -0.35, 1.05, -0.9, "#53626a");
  const monitorLight = new THREE.PointLight("#87a9c4", 2, 4);
  monitorLight.position.set(-0.2, 2.15, -0.3);
  scene.add(monitorLight);
  // Slightly imperfect tactile keyboard, one amber escape key.
  const keyboard = new THREE.Group();
  keyboard.position.set(-0.6, 1.06, 1);
  keyboard.rotation.y = 0.055;
  world.add(keyboard);
  box(2.8, 0.1, 0.94, 0, 0, 0, "#111820", keyboard);
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 13; col++)
      box(
        0.17,
        0.09,
        0.16,
        -1.25 + col * 0.202,
        0.087,
        -0.32 + row * 0.211,
        row === 0 && col === 0 ? "#d7a35d" : "#c7c5b9",
        keyboard,
      );
  box(0.92, 0.09, 0.16, 0, 0.091, 0.32, "#e8ddc9", keyboard);
  // Notebook, pencil and ruled paper.
  const notebook = new THREE.Group();
  notebook.position.set(2.05, 1.09, 0.65);
  notebook.rotation.y = -0.21;
  world.add(notebook);
  const cover = box(1.42, 0.08, 1.38, 0, 0, 0, "#8fae9c", notebook);
  cover.userData.target = "about";
  hotspots.push(cover);
  box(1.34, 0.05, 1.28, 0.02, 0.064, 0, "#f5efe5", notebook);
  box(0.035, 0.012, 1.27, -0.42, 0.097, 0, "#d98e7d", notebook);
  const pencil = box(0.07, 0.07, 1.08, 2.81, 1.12, 1.09, "#d7a35d");
  pencil.rotation.y = -0.33;
  // Ceramic mug with hollow-looking coffee surface and dimensional handle.
  cylinder(0.32, 0.26, 0.54, -2.67, 1.28, 0.82, "#bd855c");
  cylinder(0.285, 0.285, 0.012, -2.67, 1.556, 0.82, "#49342b");
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.23, 0.06, 8, 20),
    mat("#bd855c"),
  );
  handle.position.set(-3.01, 1.31, 0.82);
  handle.rotation.y = 0.1;
  handle.castShadow = true;
  world.add(handle);
  // Articulated desk lamp, shade and a single warm shadow light.
  cylinder(0.42, 0.42, 0.07, 2.82, 1.055, -1.15, "#8fae9c");
  bar([2.82, 1.1, -1.15], [3.01, 2.45, -1.27], 0.052, "#8fae9c");
  bar([3.01, 2.45, -1.27], [2.25, 3.18, -0.82], 0.052, "#8fae9c");
  const shade = cylinder(0.19, 0.44, 0.45, 2.18, 3.05, -0.8, "#8fae9c");
  shade.rotation.z = -0.4;
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 12, 8),
    new THREE.MeshBasicMaterial({ color: "#ffe1a6" }),
  );
  bulb.position.set(2.1, 2.84, -0.8);
  world.add(bulb);
  const lamp = new THREE.SpotLight("#ffd9a0", 35, 12, 0.85, 0.6, 1.5);
  lamp.position.copy(bulb.position);
  lamp.target.position.set(1.1, 1, 0.75);
  lamp.castShadow = true;
  lamp.shadow.mapSize.set(512, 512);
  lamp.shadow.bias = -0.003;
  scene.add(lamp, lamp.target);
  scene.add(new THREE.HemisphereLight("#b7c9db", "#4b3827", 2.3));
  const key = new THREE.DirectionalLight("#c7d9e6", 2);
  key.position.set(-3, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -7;
  key.shadow.camera.right = 7;
  key.shadow.camera.top = 7;
  key.shadow.camera.bottom = -7;
  key.shadow.bias = -0.001;
  scene.add(key);

  let disposed = false;
  const textures = new Set();
  const loader = new THREE.TextureLoader();
  function loadTexture(path) {
    const texture = loader.load(
      path,
      () => {
        if (disposed) texture.dispose();
        else invalidate();
      },
      undefined,
      () => invalidate(),
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.add(texture);
    return texture;
  }
  const wood = loadTexture("/images/after-hours/textures/wood-grain.webp");
  wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
  wood.repeat.set(2, 1);
  mat("#775846").map = wood;
  mat("#bd855c").roughness = 0.3;
  mat("#8fae9c").roughness = 0.42;
  mat("#8fae9c").metalness = 0.12;
  mat("#53626a").roughness = 0.48;
  mat("#53626a").metalness = 0.3;
  mat("#111820").roughness = 0.55;
  // Genuine photograph in a dimensional frame. It remains a separate legible DOM photo too.
  box(1.22, 1.68, 0.085, -3.26, 3.2, -2.22, "#d7cec0");
  const photograph = new THREE.Mesh(
    new THREE.PlaneGeometry(1.04, 1.49),
    new THREE.MeshBasicMaterial({
      map: loadTexture(content.profile.portraitSmall),
      toneMapped: false,
    }),
  );
  photograph.position.set(-3.26, 3.2, -2.17);
  world.add(photograph);
  // The complete room shell owns architectural walls and the real window.
  const skyMaterial = new THREE.MeshBasicMaterial({ color: "#334959" });
  const dawn = new THREE.DirectionalLight("#f2c477", 0);
  dawn.position.set(-4, 5, -1);
  scene.add(dawn);
  // An original archive turntable: twelve individually modeled files on a physical ring.
  const archive = new THREE.Group();
  archive.position.set(archiveLayout.centerX, 0, archiveLayout.centerZ);
  world.add(archive);
  // Solid stepped plinth: all structure stays BELOW the individual display trays.
  const baseRing = new THREE.Mesh(
    new THREE.CylinderGeometry(
      archiveLayout.baseRadius,
      archiveLayout.baseRadius + 0.1,
      0.24,
      96,
    ),
    mat("#334550"),
  );
  baseRing.position.y = 0.16;
  baseRing.receiveShadow = true;
  archive.add(baseRing);
  const platter = new THREE.Mesh(
    new THREE.CylinderGeometry(
      archiveLayout.baseRadius - 0.16,
      archiveLayout.baseRadius - 0.16,
      0.13,
      96,
    ),
    mat("#675347"),
  );
  platter.position.y = 0.345;
  platter.receiveShadow = true;
  archive.add(platter);
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(archiveLayout.baseRadius - 0.13, 0.035, 8, 96),
    mat("#d7a35d"),
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.42;
  archive.add(rim);
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 1, 0.32, 32),
    mat("#51616b"),
  );
  hub.position.y = 0.6;
  archive.add(hub);
  const artifacts = [];
  for (let i = 0; i < content.projects.length; i++) {
    const project = content.projects[i],
      angle = (i * Math.PI * 2) / content.projects.length;
    const slot = new THREE.Group();
    slot.position.set(
      Math.sin(angle) * archiveLayout.radius,
      1.63,
      Math.cos(angle) * archiveLayout.radius,
    );
    slot.rotation.y = angle;
    archive.add(slot);
    const support = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.2, 0.57, 12),
      mat("#51616b"),
    );
    support.position.set(slot.position.x, 0.7, slot.position.z);
    archive.add(support);
    const artifact = buildArtifact(
      project,
      mat,
      loadTexture(projectArtFor(project).cover),
      box,
    );
    const artifactBounds = new THREE.Box3().setFromObject(artifact);
    artifact.position.y = -0.61 - artifactBounds.min.y;
    slot.add(artifact);
    const genuine =
      project.visual === "agency"
        ? project.cover.image
        : project.visual === "commerce"
          ? project.cover.images[0]
          : null;
    if (genuine) {
      const image = new THREE.Mesh(
        new THREE.PlaneGeometry(0.47, 0.47),
        new THREE.MeshBasicMaterial({
          map: loadTexture(genuine.src),
          toneMapped: false,
        }),
      );
      image.position.set(0.43, 0.02, 0.2);
      artifact.add(image);
    }
    const stand = box(1.94, 0.12, 1.26, 0, -0.67, 0, "#526573", slot);
    const proxy = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1.8, 1.4),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    );
    proxy.position.y = 0.15;
    proxy.userData = { action: "artifact", index: i };
    slot.add(proxy);
    hotspots.push(proxy);
    artifacts.push({
      slot,
      artifact,
      stand,
      index: i,
      home: artifact.position.clone(),
    });
  }
  // A mechanical category workbench; ordinary DOM keys carry the full legible names.
  const toolStart = world.children.length;
  const toolKeys = [];
  const categories = ["All tools", ...content.skills.map((s) => s.title)];
  const toolRows = Math.ceil(categories.length / 3),
    toolDepth = toolRows * 1.7 + 0.5,
    toolCenter = -0.65 + (toolRows - 1) * 0.85;
  box(5.4, 0.25, toolDepth, -8, 1.1, toolCenter, "#775846");
  for (const x of [-10.35, -5.65])
    for (const z of [
      toolCenter - toolDepth * 0.36,
      toolCenter + toolDepth * 0.36,
    ])
      box(0.14, 1.02, 0.14, x, 0.51, z, "#53626a");
  for (let i = 0; i < categories.length; i++) {
    const x = -9.6 + (i % 3) * 1.57,
      z = -0.65 + Math.floor(i / 3) * 1.7;
    box(1.3, 0.19, 1.3, x, 1.32, z, "#111820");
    const cap = box(
      1.24,
      0.32,
      1.24,
      x,
      1.58,
      z,
      i === 0 ? "#f2c477" : "#d7cec0",
    );
    cap.userData = { action: "tool", category: categories[i] };
    cap.material = cap.material.clone();
    hotspots.push(cap);
    toolKeys.push({ mesh: cap, baseY: 1.58, category: categories[i] });
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 512;
    labelCanvas.height = 256;
    const ctx = labelCanvas.getContext("2d");
    ctx.fillStyle = "#192630";
    ctx.textAlign = "center";
    ctx.font = "34px sans-serif";
    const words = categories[i].split(" ");
    const midpoint = Math.ceil(words.length / 2);
    ctx.fillText(words.slice(0, midpoint).join(" "), 256, 100);
    ctx.fillText(words.slice(midpoint).join(" "), 256, 147);
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    textures.add(labelTexture);
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 0.72),
      new THREE.MeshBasicMaterial({ map: labelTexture, transparent: true }),
    );
    face.rotation.x = -Math.PI / 2;
    face.position.set(x, 1.75, z);
    world.add(face);
    toolKeys[i].label = face;
  }
  const toolkitObjects = world.children.slice(toolStart);
  const journeyStart = world.children.length;
  // Tactile Journey pinboard. Real dates and prose remain accessible in HTML.
  box(5.1, 3.9, 0.18, -8.5, 3, -2.23, "#6e5849");
  const recordPins = [];
  const pinColumns = Math.min(3, Math.max(1, content.experience.length)),
    pinRows = Math.ceil(content.experience.length / pinColumns),
    paperW = (4.75 / pinColumns) * 0.86,
    paperH = Math.min(2.1, (3.35 / Math.max(1, pinRows)) * 0.84);
  for (let i = 0; i < content.experience.length; i++) {
    const x =
        -8.5 + (((i % pinColumns) - (pinColumns - 1) / 2) * 4.75) / pinColumns,
      y =
        3 +
        (((pinRows - 1) / 2 - Math.floor(i / pinColumns)) * 3.35) /
          Math.max(1, pinRows);
    const entry = box(paperW, paperH, 0.045, x, y, -2.11, "#f5efe5");
    entry.rotation.z = (i - 1) * 0.045;
    const pin = cylinder(
      0.052,
      0.052,
      0.12,
      x,
      y + paperH * 0.4,
      -2.02,
      "#d98470",
    );
    pin.rotation.x = Math.PI / 2;
    pin.userData = { action: "record", index: i };
    hotspots.push(entry);
    entry.userData = { action: "record", index: i };
    recordPins.push(entry);
    entry.userData.paperSize = [paperW, paperH];
  }
  const journeyObjects = world.children.slice(journeyStart);
  journeyObjects.forEach((o) => (o.position.y += 1.2));
  // A constrained physical cable joins the actual scene focus locations.
  const cablePoints = [
    [-0.35, 1.05, -0.78],
    [-0.35, 1.035, -1.8],
    [1.15, 1.035, -1.94],
    [2.85, 1.035, -1.9],
    [4.16, 1.035, -1.9],
    [4.16, 0.35, -1.9],
    [4.16, 0.14, -1.9],
  ];
  const signalCurve = new THREE.CatmullRomCurve3(
    cablePoints.map((p) => new THREE.Vector3(...p)),
    false,
    "centripetal",
  );
  const signal = new THREE.Mesh(
    new THREE.TubeGeometry(signalCurve, 100, 0.022, 6, false),
    new THREE.MeshStandardMaterial({
      color: "#82b4cf",
      emissive: "#254d65",
      emissiveIntensity: 0.28,
      roughness: 0.7,
    }),
  );
  world.add(signal);
  const pulse = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 10, 8),
    new THREE.MeshBasicMaterial({ color: "#c5e8fa", toneMapped: false }),
  );
  pulse.visible = false;
  world.add(pulse);
  const dustGeometry = new THREE.BufferGeometry();
  const dustPositions = new Float32Array(22 * 3);
  for (let i = 0; i < 22; i++) {
    dustPositions[i * 3] = 1.2 + ((i * 17) % 23) / 15;
    dustPositions[i * 3 + 1] = 1.25 + ((i * 7) % 19) / 12;
    dustPositions[i * 3 + 2] = -0.9 + ((i * 11) % 17) / 12;
  }
  dustGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(dustPositions, 3),
  );
  const dust = new THREE.Points(
    dustGeometry,
    new THREE.PointsMaterial({
      color: "#f2c477",
      size: 0.014,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    }),
  );
  world.add(dust);
  const switchMesh = box(0.09, 0.09, 0.13, 2.86, 1.15, -0.91, "#f2c477");
  switchMesh.userData = { action: "lamp" };
  hotspots.push(switchMesh, shade);
  shade.userData = { action: "lamp" };
  const objectWorld = upgradeObjectWorld({
    world,
    box,
    hotspots,
    textures,
    monitor,
    screen,
    notebook,
    recordPins,
    artifacts,
  });
  const roomShell = createRoomShell({ world, box, mat, hotspots, textures });
  const patchModel = createPatchModel(world, mat);
  objectWorld.surfaces.window = {
    mesh: roomShell.sky,
    group: roomShell.group,
    width: 9.4,
    height: 4.2,
    position: [5.2, 4.45, -7.38],
    camera: [5.2, 4.45, -5],
    halfHeight: 2.55,
  };
  const patchShadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.38, 24),
    new THREE.MeshBasicMaterial({
      color: "#111821",
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    }),
  );
  patchShadow.rotation.x = -Math.PI / 2;
  patchShadow.scale.set(1, 0.5, 1);
  world.add(patchShadow);
  cover.userData = { action: "object", objectId: "notebook" };
  return {
    ...objectWorld,
    roomShell,
    patchModel,
    patchShadow,
    scene,
    camera,
    world,
    hotspots,
    lamp,
    bulb,
    key,
    archive,
    artifacts,
    toolKeys,
    toolkitObjects,
    journeyObjects,
    recordPins,
    signalCurve,
    signal,
    pulse,
    dawn,
    skyMaterial,
    dust,
    switchMesh,
    dispose() {
      disposed = true;
      const geometries = new Set(),
        mats = new Set();
      scene.traverse((o) => {
        if (o.geometry) geometries.add(o.geometry);
        if (o.material) mats.add(o.material);
      });
      geometries.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}

