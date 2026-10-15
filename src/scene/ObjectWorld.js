import * as THREE from "three";
import { content } from "../data/content";
import { archiveLayout } from "./worldLayout";

// Short ambient summaries only. Every substantive paragraph is semantic HTML.
export function labelTexture(
  text,
  textures,
  {
    paper = "#f5efe4",
    ink = "#1b2933",
    width = 1024,
    height = 512,
    size = 54,
    top = 76,
  } = {},
) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d");
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = ink;
  ctx.font = `500 ${size}px sans-serif`;
  let y = top;
  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const word of paragraph.split(" ")) {
      const next = line ? line + " " + word : word;
      if (ctx.measureText(next).width > width - 100 && line) {
        ctx.fillText(line, 50, y);
        y += size * 1.4;
        line = word;
      } else line = next;
    }
    ctx.fillText(line, 50, y);
    y += size * 1.55;
  }
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  textures.add(texture);
  return texture;
}
export function upgradeObjectWorld({
  world,
  box,
  hotspots,
  textures,
  monitor,
  screen,
  notebook,
  recordPins,
  artifacts,
}) {
  const preview = labelTexture(
    "Alok Sahoo\nWork     About\nBuild notes     Contact",
    textures,
    { paper: "#213b49", ink: "#f4f0e8", height: 600, size: 58, top: 125 },
  );
  screen.material = new THREE.MeshBasicMaterial({
    map: preview,
    toneMapped: false,
  });
  screen.userData = { action: "object", objectId: "monitor" };
  monitor.children[0].userData = screen.userData;
  const face = (
    text,
    w,
    h,
    x,
    y,
    z,
    background = "#f5efe4",
    parent = world,
  ) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        map: labelTexture(text, textures, { paper: background }),
        toneMapped: false,
      }),
    );
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };
  const notebookFace = face(
    "Field notes\nAlok Sahoo",
    1.24,
    1.16,
    0,
    0.104,
    0,
    "#f5efe4",
    notebook,
  );
  notebookFace.rotation.x = -Math.PI / 2;
  // A few deliberately placed work traces, outside Patch's front-edge walk lane.
  for (let i = 0; i < 3; i++) {
    const card = box(
      0.84,
      0.018,
      0.56,
      -1.85 + i * 0.035,
      1.035 + i * 0.021,
      -0.36 + i * 0.025,
      "#f5efe4",
    );
    card.rotation.y = 0.09 + i * 0.035;
  }
  const traceCard = face(
    "AURA\nRequest → response",
    0.75,
    0.49,
    -1.78,
    1.104,
    -0.31,
  );
  traceCard.rotation.x = -Math.PI / 2;
  traceCard.rotation.z = -0.13;
  const pen = box(0.045, 0.045, 0.85, -1.15, 1.06, -0.1, "#dd907a");
  pen.rotation.y = 0.42;
  const clip = new THREE.Mesh(
    new THREE.TorusGeometry(0.075, 0.012, 6, 20),
    new THREE.MeshStandardMaterial({
      color: "#9bc7d6",
      metalness: 0.55,
      roughness: 0.4,
    }),
  );
  clip.rotation.x = -Math.PI / 2;
  clip.scale.x = 0.5;
  clip.position.set(1.58, 1.22, 1.32);
  world.add(clip);
  for (let i = 0; i < 7; i++) {
    const height = 0.25 + (i % 3) * 0.12;
    box(
      0.22,
      height,
      0.025,
      0.34 + i * 0.27,
      2.2 + height / 2,
      -2.12,
      "#253440",
    );
  }
  face(
    "Leave a note\n" + content.profile.firstName,
    1.02,
    1.2,
    -2.55,
    2.95,
    -2.24,
  );
  face(
    "Understand the system.\nMake it useful.",
    0.85,
    0.9,
    2.58,
    3.15,
    -2.23,
    "#9bc7d6",
  );
  artifacts.forEach(({ slot, index }) => {
    const label = face(
      content.projects[index].title,
      1.9,
      0.38,
      0,
      -0.68,
      0.65,
      "#334550",
      slot,
    );
    label.material.map.dispose();
    textures.delete(label.material.map);
    label.material.map = labelTexture(content.projects[index].title, textures, {
      paper: "#334550",
      ink: "#f4f0e8",
      width: 1024,
      height: 256,
      size: 66,
    });
  });
  recordPins.forEach((pin, i) => {
    const en = content.experience[i];
    const label = face(
      en.date + "\n" + en.role + "\n" + en.company,
      pin.userData.paperSize[0] - 0.1,
      pin.userData.paperSize[1] - 0.1,
      0,
      0,
      0.026,
    );
    pin.add(label);
    label.position.set(0, 0, 0.026);
    label.material.map.dispose();
    textures.delete(label.material.map);
    label.material.map = labelTexture(
      en.date + "\n" + en.role + "\n" + en.company,
      textures,
      { width: 700, height: 1024, size: 48 },
    );
  });
  // Local shelf and desktop backboards remain; RoomShell owns outer architecture.
  box(3.3, 0.14, 0.75, -5, 4.45, -2, "#675347");
  const books = ["APIs", "DATA", "SYSTEMS"];
  books.forEach((text, i) => {
    box(0.6, 1.05, 0.45, -6 + i * 0.8, 5, -2, "#91b69d");
    face(text, 0.52, 0.9, -6 + i * 0.8, 5, -1.76, "#91b69d");
  });
  box(3.1, 0.13, 0.65, 7, 3.8, -2, "#675347");
  face("AURA\nRequest → response", 2.1, 0.8, 7, 4.3, -2.18, "#9bc7d6");
  // Window-side message station and a working file cabinet.
  box(2.2, 0.2, 2.2, 5.2, 1.2, 1.2, "#675347");
  for (const x of [4.3, 6.1]) box(0.16, 1.1, 0.16, x, 0.6, 1.4, "#51616b");
  const note = box(1.5, 0.06, 1.25, 5.2, 1.35, 1.2, "#f5efe4");
  note.userData = { action: "object", objectId: "contact" };
  hotspots.push(note);
  const noteFace = face(
    "Leave a note\n" + content.profile.email,
    1.4,
    1.1,
    5.2,
    1.386,
    1.2,
  );
  noteFace.rotation.x = -Math.PI / 2;
  box(2.3, 1.8, 1.8, -5, 0.9, 4.8, "#51616b");
  const drawer = box(2.18, 0.64, 0.12, -5, 1.3, 5.74, "#334550");
  drawer.userData = { action: "object", objectId: "credentials" };
  hotspots.push(drawer);
  box(0.66, 0.07, 0.12, -5, 1.45, 5.84, "#f2c47b");
  face("Credentials", 1.7, 0.35, -5, 1.15, 5.82, "#334550").material.map =
    labelTexture("Credentials", textures, {
      paper: "#334550",
      ink: "#f4f0e8",
      size: 65,
    });
  // =========================================================================
  // COMPLETE PERSONAL STUDIO PROPS: Chair, Laptop, Side Display, Headphones,
  // Mouse + Desk Mat, and Trophy / Certificate Gallery Shelf
  // =========================================================================

  // 1. Extended Matte Desk Pad & Sculpted Wireless Mouse
  box(4.1, 0.016, 1.32, -0.25, 1.028, 0.98, "#1e2a34");
  const mouseGroup = new THREE.Group();
  mouseGroup.position.set(1.02, 1.065, 1.02);
  mouseGroup.rotation.y = -0.08;
  world.add(mouseGroup);
  box(0.24, 0.075, 0.38, 0, 0, 0, "#202d39", mouseGroup);
  box(0.035, 0.085, 0.09, 0, 0.015, -0.09, "#d7a35d", mouseGroup); // Scroll wheel

  // 2. Angled Laptop on Brushed Aluminum Stand (Right of main monitor)
  const laptopGroup = new THREE.Group();
  laptopGroup.position.set(1.75, 1.04, -0.82);
  laptopGroup.rotation.y = -0.32;
  world.add(laptopGroup);
  box(0.85, 0.22, 0.65, 0, 0.11, 0, "#53626a", laptopGroup); // Stand riser
  const laptopBase = box(1.32, 0.05, 0.92, 0, 0.25, 0.08, "#283642", laptopGroup);
  laptopBase.rotation.x = 0.18;
  const laptopLid = new THREE.Group();
  laptopLid.position.set(0, 0.34, -0.34);
  laptopLid.rotation.x = -0.26;
  laptopGroup.add(laptopLid);
  const lidShell = box(1.32, 0.88, 0.045, 0, 0.42, 0, "#19212b", laptopLid);
  lidShell.userData = { action: "object", objectId: "monitor" };
  hotspots.push(lidShell);
  const laptopScreen = face(
    "COSMEON · 4+2 SHARDS\nFastAPI · Docker · Ready",
    1.22,
    0.78,
    0,
    0.42,
    0.026,
    "#18303d",
    laptopLid,
  );
  laptopScreen.material.map.dispose();
  textures.delete(laptopScreen.material.map);
  laptopScreen.material.map = labelTexture(
    "COSMEON · 4+2 SHARDS\nFastAPI · Docker · Ready",
    textures,
    { paper: "#18303d", ink: "#9bc7d6", size: 46, top: 135 },
  );

  // 3. Vertical Secondary Code & Telemetry Display (Left of main monitor)
  const sideDisplay = new THREE.Group();
  sideDisplay.position.set(-2.32, 2.08, -0.92);
  sideDisplay.rotation.y = 0.28;
  world.add(sideDisplay);
  box(0.14, 0.95, 0.14, 0, -0.58, -0.08, "#53626a", sideDisplay); // Stand pole
  box(0.62, 0.05, 0.48, 0, -1.03, -0.04, "#53626a", sideDisplay); // Stand base
  const vShell = box(1.08, 1.76, 0.12, 0, 0, 0, "#111820", sideDisplay);
  vShell.userData = { action: "object", objectId: "monitor" };
  hotspots.push(vShell);
  const vScreen = face(
    "AURA · SecBERT XAI\nStatus: 200 OK\nTrustNet · ViT",
    0.96,
    1.62,
    0,
    0,
    0.066,
    "#1b3340",
    sideDisplay,
  );
  vScreen.material.map.dispose();
  textures.delete(vScreen.material.map);
  vScreen.material.map = labelTexture(
    "AURA · SecBERT XAI\nStatus: 200 OK\nTrustNet · ViT",
    textures,
    { paper: "#1b3340", ink: "#f2c477", width: 512, height: 860, size: 44, top: 140 },
  );

  // 4. Studio Headphones on a Walnut & Brass Stand (Far left of desk)
  const hpGroup = new THREE.Group();
  hpGroup.position.set(-3.42, 1.04, -0.82);
  hpGroup.rotation.y = 0.35;
  world.add(hpGroup);
  box(0.38, 0.05, 0.38, 0, 0.025, 0, "#675347", hpGroup);
  box(0.05, 0.68, 0.05, 0, 0.36, 0, "#d7a35d", hpGroup);
  box(0.24, 0.04, 0.12, 0, 0.7, 0, "#675347", hpGroup);
  const headband = new THREE.Mesh(
    new THREE.TorusGeometry(0.21, 0.032, 10, 24, Math.PI),
    new THREE.MeshStandardMaterial({ color: "#202d39", roughness: 0.5 }),
  );
  headband.position.set(0, 0.52, 0);
  hpGroup.add(headband);
  for (const side of [-0.2, 0.2]) {
    const cup = box(0.09, 0.22, 0.17, side, 0.44, 0, "#334550", hpGroup);
    cup.rotation.z = side > 0 ? -0.12 : 0.12;
    cup.userData = { action: "headphones" };
    hotspots.push(cup);
  }

  // 5. Ergonomic Studio Task Chair (In front of desk, angled naturally)
  const chairGroup = new THREE.Group();
  chairGroup.name = "studio-task-chair";
  chairGroup.position.set(-0.48, 0, 2.55);
  chairGroup.rotation.y = 2.82; // Facing the desk at a lived-in angle
  world.add(chairGroup);
  // 5-star base & casters
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.09, 0.52, 14),
    new THREE.MeshStandardMaterial({ color: "#2a353d", metalness: 0.4, roughness: 0.5 }),
  );
  pedestal.position.y = 0.28;
  chairGroup.add(pedestal);
  for (let arm = 0; arm < 5; arm++) {
    const a = (arm * Math.PI * 2) / 5;
    const leg = box(0.11, 0.055, 0.62, Math.sin(a) * 0.28, 0.08, Math.cos(a) * 0.28, "#334550", chairGroup);
    leg.rotation.y = a;
  }
  // Contoured seat cushion + walnut shell
  const chairHit = box(1.18, 0.11, 1.12, 0, 0.56, 0, "#675347", chairGroup);
  chairHit.userData = { action: "chair" };
  hotspots.push(chairHit);
  box(1.12, 0.09, 1.06, 0, 0.63, 0, "#263542", chairGroup);
  // Backrest spine + lumbar support + walnut back shell
  box(0.14, 0.78, 0.08, 0, 0.98, -0.54, "#334550", chairGroup);
  box(1.08, 0.92, 0.09, 0, 1.24, -0.49, "#675347", chairGroup);
  box(1.02, 0.86, 0.08, 0, 1.24, -0.44, "#263542", chairGroup);
  // Padded armrests
  for (const side of [-0.62, 0.62]) {
    box(0.07, 0.34, 0.07, side, 0.74, -0.1, "#334550", chairGroup);
    box(0.14, 0.06, 0.54, side, 0.92, -0.05, "#675347", chairGroup);
  }

  // 6. Dedicated Trophy Shelf & Certificate Gallery Wall (Left side of room, x = -11.5, z = 3.1)
  const trophyUnit = new THREE.Group();
  trophyUnit.name = "trophy-and-certificate-gallery";
  trophyUnit.position.set(-11.45, 0, 3.15);
  world.add(trophyUnit);
  // Vertical steel uprights & 3 walnut shelves
  for (const sz of [-1.35, 1.35]) {
    box(0.12, 3.85, 0.82, 0, 1.925, sz, "#334550", trophyUnit);
  }
  for (const sy of [0.85, 2.15, 3.45]) {
    const shelf = box(0.88, 0.11, 2.95, 0, sy, 0, "#675347", trophyUnit);
    shelf.userData = { action: "object", objectId: "credentials" };
    hotspots.push(shelf);
  }
  // 3 Sculpted Hackathon Trophies on Top Shelf (SIH 2025, OpsStorm 1st, IEEE Techithon 1st)
  const trophyColors = ["#f2c477", "#d98e7d", "#9bc7d6"];
  for (let t = 0; t < 3; t++) {
    const tz = -0.85 + t * 0.85;
    const tBase = box(0.28, 0.14, 0.28, 0.05, 3.58, tz, "#202d39", trophyUnit);
    const tCup = box(0.22, 0.38, 0.22, 0.05, 3.84, tz, trophyColors[t], trophyUnit);
    tBase.userData = { action: "object", objectId: "credentials" };
    tCup.userData = { action: "object", objectId: "credentials" };
    hotspots.push(tBase, tCup);
  }
  // Stacked books & archive binders on middle/lower shelves
  for (let b = 0; b < 5; b++) {
    box(
      0.52,
      0.58 + (b % 2) * 0.12,
      0.16,
      0.04,
      2.5 + (b % 2) * 0.06,
      -0.9 + b * 0.22,
      ["#8fae9c", "#d7a35d", "#87a9c4", "#d98e7d", "#334550"][b],
      trophyUnit,
    );
  }
  // Framed Achievement & Certificate Plaques mounted above the shelf on the left wall
  const certTitles = [
    "SIH 2025\nGrand Finale",
    "OpsStorm ’26\n1st Prize",
    "IEEE Techithon\n1st Rank",
  ];
  for (let c = 0; c < 3; c++) {
    const cz = 1.95 + c * 1.15;
    const frame = box(0.08, 0.92, 0.96, -12.22, 4.75, cz, "#675347");
    frame.userData = { action: "object", objectId: "credentials" };
    hotspots.push(frame);
    const plaque = face(
      certTitles[c],
      0.82,
      0.78,
      -12.16,
      4.75,
      cz,
      "#f5efe4",
    );
    plaque.rotation.y = Math.PI / 2;
    plaque.userData = { action: "object", objectId: "credentials" };
    hotspots.push(plaque);
  }

  const surfaces = {
    monitor: {
      mesh: screen,
      width: 2.89,
      height: 1.64,
      position: [-0.35, 2.33, -0.784],
      camera: [-0.35, 2.33, 8],
      halfHeight: 1.03,
      group: monitor,
    },
  };
  const configs = {
    notebook: {
      position: [2.05, 3.1, 4.5],
      width: 6.7,
      height: 4.5,
      color: "#91b69d",
    },
    project: {
      position: [
        archiveLayout.centerX,
        3.3,
        archiveLayout.centerZ + archiveLayout.radius + 1.65,
      ],
      width: 6.8,
      height: 4.6,
      color: "#675347",
    },
    toolkit: {
      position: [-8, 4.4, 4.2],
      width: 6.8,
      height: 4.5,
      color: "#334550",
    },
    journey: {
      position: [-8.5, 4.8, 3.9],
      width: 6.8,
      height: 4.6,
      color: "#675347",
    },
    credentials: {
      position: [-5, 2.6, 6.3],
      width: 6.7,
      height: 4.6,
      color: "#51616b",
    },
    contact: {
      position: [5.2, 2.7, 3.4],
      width: 6.7,
      height: 4.6,
      color: "#675347",
    },
  };
  for (const [id, c] of Object.entries(configs)) {
    const group = new THREE.Group();
    group.position.set(...c.position);
    world.add(group);
    box(c.width + 0.3, c.height + 0.3, 0.18, 0, 0, 0, c.color, group);
    if (id === "project" || id === "toolkit") {
      const legHeight = Math.max(0.2, c.position[1] - c.height / 2 - 0.12);
      box(
        0.25,
        legHeight,
        0.3,
        0,
        -c.position[1] + 0.12 + legHeight / 2,
        -0.1,
        "#51616b",
        group,
      );
      box(2.8, 0.18, 1.8, 0, 0.09 - c.position[1], 0, "#334550", group);
    }
    if (id === "notebook")
      box(0.07, c.height + 0.16, 0.25, 0, 0, 0.12, "#d8cebe", group);
    if (id === "journey")
      for (const x of [-c.width * 0.42, c.width * 0.42])
        box(0.12, 0.12, 0.1, x, c.height * 0.42, 0.16, "#dd907a", group);
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(c.width, c.height),
      new THREE.MeshBasicMaterial({
        color: id === "monitor" || id === "toolkit" ? "#1d2935" : "#f5efe4",
      }),
    );
    mesh.position.z = 0.105;
    group.add(mesh);
    group.visible = false;
    surfaces[id] = {
      mesh,
      group,
      width: c.width,
      height: c.height,
      position: [c.position[0], c.position[1], c.position[2] + 0.105],
      camera: [c.position[0], c.position[1], c.position[2] + 12],
      halfHeight: 2.65,
    };
  }
  // An attached summary terminal stays with the physical keyboard in room view.
  const terminal = box(4.1, 1.45, 0.2, -8, 2.6, -1.3, "#334550");
  terminal.userData = { action: "object", objectId: "toolkit" };
  hotspots.push(terminal);
  const terminalPreview = face(
    "TOOLS WITHIN REACH\nPress a category key",
    3.8,
    1.16,
    -8,
    2.6,
    -1.18,
    "#213b49",
  );
  terminalPreview.material.map.dispose();
  textures.delete(terminalPreview.material.map);
  terminalPreview.material.map = labelTexture(
    "Tools within reach\nPress a category key",
    textures,
    { paper: "#213b49", ink: "#f4f0e8" },
  );
  const pageWidth = 3.35,
    pageHeight = 4.45;
  const pageGeometry = new THREE.PlaneGeometry(pageWidth, pageHeight, 24, 6);
  pageGeometry.translate(pageWidth / 2, 0, 0.16);
  const pageBase = pageGeometry.attributes.position.array.slice();
  const turningPaper = new THREE.Mesh(
    pageGeometry,
    new THREE.MeshStandardMaterial({
      color: "#f5efe4",
      roughness: 0.96,
      side: THREE.DoubleSide,
    }),
  );
  turningPaper.castShadow = true;
  turningPaper.visible = false;
  surfaces.notebook.group.add(turningPaper);
  function turnPage(t, direction) {
    turningPaper.visible = t >= 0 && t < 1;
    if (!turningPaper.visible) return;
    const theta = -Math.PI * (direction < 0 ? 1 - t : t),
      curl = Math.sin(t * Math.PI) * 0.85,
      position = pageGeometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const u = pageBase[i * 3] / pageWidth;
      const bx =
        curl > 0.001 ? (Math.sin(curl * u) / curl) * pageWidth : u * pageWidth;
      const bz =
        curl > 0.001 ? ((1 - Math.cos(curl * u)) / curl) * pageWidth : 0;
      position.setXYZ(
        i,
        bx * Math.cos(theta) + bz * Math.sin(theta),
        pageBase[i * 3 + 1],
        0.16 - bx * Math.sin(theta) + bz * Math.cos(theta),
      );
    }
    position.needsUpdate = true;
    pageGeometry.computeVertexNormals();
  }
  return { surfaces, drawer, terminalPreview, turningPaper, turnPage, chairGroup, laptopLid, hpGroup };
}
