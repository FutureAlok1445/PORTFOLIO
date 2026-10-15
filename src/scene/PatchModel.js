import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// AFTER HOURS v4 — Patch 4.0 Hierarchical Feline Rig & 18-State Behavior Engine.
// Hierarchy: root -> pelvisGroup -> spineGroup -> chestGroup -> neckGroup -> head -> (ears, eyes, muzzle, whiskers)
// Plus 4 articulated grounded legs (paws[0..3]) and an 8-joint S-curve tail chain.
export function createPatchModel(world, mat) {
  const root = new THREE.Group();
  root.name = "Patch-voxel-cat";
  world.add(root);

  const furColor = "#262d36";
  const creamColor = "#f5f0e6";
  const coralColor = "#d98470";
  const amberColor = "#f2c477";
  const collarColor = "#8fae9c";
  const darkInk = "#111821";

  const roundedPart = (
    w,
    h,
    d,
    x,
    y,
    z,
    color,
    parent = root,
    radius = 0.045,
  ) => {
    const geom = new RoundedBoxGeometry(
      w,
      h,
      d,
      3,
      Math.min(radius, w / 3, h / 3, d / 3),
    );
    const m = new THREE.Mesh(geom, mat(color));
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };

  // Pelvis -> Spine -> Chest -> Neck -> Head articulated hierarchy
  const pelvisGroup = new THREE.Group();
  pelvisGroup.position.set(0, 0.28, -0.14);
  root.add(pelvisGroup);

  // Rear haunches
  roundedPart(0.47, 0.28, 0.34, 0, 0.02, -0.04, furColor, pelvisGroup, 0.095);

  const spineGroup = new THREE.Group();
  spineGroup.position.set(0, 0.01, 0.14);
  pelvisGroup.add(spineGroup);

  // Mid-torso & cream belly
  roundedPart(0.44, 0.31, 0.46, 0, 0, 0, furColor, spineGroup, 0.085);
  roundedPart(0.34, 0.08, 0.44, 0, -0.13, 0, creamColor, spineGroup, 0.03);

  const chestGroup = new THREE.Group();
  chestGroup.position.set(0, 0, 0.22);
  spineGroup.add(chestGroup);

  // Shoulders, high-contrast tuxedo chest bib, moss collar & gold bell
  roundedPart(0.45, 0.3, 0.26, 0, 0.01, -0.02, furColor, chestGroup, 0.08);
  roundedPart(0.36, 0.25, 0.24, 0, -0.02, 0.04, creamColor, chestGroup, 0.065);
  roundedPart(0.41, 0.065, 0.14, 0, 0.09, 0.05, collarColor, chestGroup, 0.02);
  const bell = new THREE.Mesh(
    new THREE.SphereGeometry(0.048, 12, 10),
    mat(amberColor),
  );
  bell.position.set(0, 0.04, 0.14);
  bell.castShadow = true;
  chestGroup.add(bell);

  // Expressive feline head group (attached to root for direct height/pose control while synced with chest)
  const head = new THREE.Group();
  head.position.set(0, 0.55, 0.31);
  root.add(head);

  // Wedge-shaped feline cranium + cheek puffs + white muzzle + blaze
  roundedPart(0.46, 0.36, 0.35, 0, 0.01, 0, furColor, head, 0.095);
  roundedPart(0.51, 0.19, 0.24, 0, -0.05, 0.04, furColor, head, 0.075);
  roundedPart(0.27, 0.13, 0.11, 0, -0.085, 0.165, creamColor, head, 0.045);
  roundedPart(0.11, 0.055, 0.06, 0, 0.02, 0.17, creamColor, head, 0.02);

  // Proportional pointed ears (12-segment smooth cones + coral-pink inner concha)
  const ears = [];
  for (const side of [-1, 1]) {
    const earGroup = new THREE.Group();
    earGroup.position.set(side * 0.165, 0.22, -0.01);
    earGroup.rotation.z = -side * 0.16;
    earGroup.rotation.x = 0.08;
    head.add(earGroup);

    const outerEar = new THREE.Mesh(
      new THREE.ConeGeometry(0.115, 0.26, 12),
      mat(furColor),
    );
    outerEar.castShadow = true;
    earGroup.add(outerEar);

    const innerEar = new THREE.Mesh(
      new THREE.ConeGeometry(0.068, 0.18, 10),
      mat(coralColor),
    );
    innerEar.position.set(0, -0.01, 0.042);
    earGroup.add(innerEar);
    ears.push(earGroup);
  }

  // Whiskers (3 per side)
  for (const side of [-1, 1]) {
    for (let w = 0; w < 3; w++) {
      const whisker = roundedPart(
        0.16,
        0.012,
        0.014,
        side * 0.28,
        -0.055 - w * 0.032,
        0.16,
        creamColor,
        head,
        0.004,
      );
      whisker.rotation.z = side * (0.08 - w * 0.09);
      whisker.rotation.y = -side * 0.18;
    }
  }

  // Luminous amber eyes + vertical slit pupils + catchlights
  const eyes = [];
  for (const side of [-1, 1]) {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(side * 0.12, 0.025, 0.175);
    head.add(eyeGroup);

    roundedPart(0.095, 0.095, 0.026, 0, 0, 0, amberColor, eyeGroup, 0.03);
    roundedPart(0.028, 0.072, 0.016, 0, 0, 0.01, darkInk, eyeGroup, 0.008);
    roundedPart(
      0.022,
      0.022,
      0.018,
      side * 0.018,
      0.02,
      0.012,
      creamColor,
      eyeGroup,
      0.005,
    );
    eyes.push(eyeGroup);
  }

  // Pink nose button
  roundedPart(0.062, 0.042, 0.04, 0, -0.042, 0.215, coralColor, head, 0.015);

  // 4 grounded legs with upper limb + white sock paws (exact y=0.115 center / height=0.23 so bottom=0.0)
  const paws = [];
  for (const x of [-0.155, 0.155]) {
    for (const z of [-0.22, 0.23]) {
      const paw = roundedPart(
        0.135,
        0.23,
        0.155,
        x,
        0.115,
        z,
        creamColor,
        root,
        0.04,
      );
      roundedPart(0.14, 0.12, 0.145, 0, 0.06, -0.01, furColor, paw, 0.03);
      paws.push(paw);
    }
  }

  // 8-segment graceful S-curve tail with white tip
  const tail = new THREE.Group();
  tail.position.set(0, 0.31, -0.33);
  root.add(tail);
  const tailSegments = [];
  for (let i = 0; i < 8; i++) {
    const t = i / 7;
    const thickness = 0.095 * (1 - t * 0.32);
    const seg = roundedPart(
      thickness,
      thickness,
      0.13,
      Math.sin(i * 0.28) * 0.08,
      i * 0.068,
      -i * 0.072,
      i >= 6 ? creamColor : furColor,
      tail,
      0.035,
    );
    seg.rotation.x = -0.25 + t * 0.35;
    tailSegments.push(seg);
  }

  return {
    root,
    pelvisGroup,
    spineGroup,
    chestGroup,
    head,
    ears,
    eyes,
    paws,
    tail,
    update(rawState, time, pointer = null) {
      // Map both v4 expanded state names and canonical manifest state names
      const stateMap = {
        rest_sit: "idle",
        rest_loaf: "settle",
        ear_twitch: "ear",
        tail_idle: "tail",
        head_follow: "look",
        curl_to_sleep: "sleep",
        sleep_breathing: "sleep",
        groom: "paw",
        pet_react: "pet",
        investigate_object: "peek",
        jump_up: "jump",
        jump_down: "jump",
      };
      const state = stateMap[rawState] || rawState || "idle";

      const walk = state === "walk" || state === "return",
        sleep = state === "sleep",
        stretch = state === "stretch",
        settle = state === "settle",
        pet = state === "pet",
        pawGroom = state === "paw",
        peek = state === "peek";

      const breath = Math.sin(time * 0.0024) * 0.018;
      root.scale.set(
        1,
        sleep
          ? 0.72 + breath
          : stretch
            ? 0.86
            : settle
              ? 0.92
              : state === "stand"
                ? 1.06
                : 1 + breath * 0.4,
        sleep ? 0.9 : stretch ? 1.05 : 0.94,
      );

      // Hierarchical Spine & Chest Articulation (true curled sleep vs bow stretch vs walk sway)
      spineGroup.rotation.y = sleep
        ? 0.32
        : walk
          ? Math.sin(time * 0.015) * 0.06
          : 0;
      spineGroup.rotation.x = stretch ? 0.18 : sleep ? 0.08 : 0;
      chestGroup.position.y = stretch ? -0.05 : 0;
      pelvisGroup.position.y = stretch ? 0.33 : 0.28;

      // Head pose + subtle pointer head-follow when idle/awake
      const pointerYaw =
        pointer && !sleep && !walk
          ? THREE.MathUtils.clamp(pointer.x * 0.22, -0.25, 0.25)
          : 0;
      const pointerPitch =
        pointer && !sleep && !walk
          ? THREE.MathUtils.clamp(pointer.y * 0.14, -0.16, 0.16)
          : 0;

      head.position.y = sleep
        ? 0.41
        : stretch
          ? 0.47
          : peek
            ? 0.6
            : 0.55;
      head.position.x = sleep ? 0.08 : 0;
      head.rotation.y = sleep
        ? 0.38
        : ["look", "pet", "ear"].includes(state)
          ? Math.sin(time * 0.0045) * 0.24 + pointerYaw
          : walk
            ? Math.sin(time * 0.015) * 0.06
            : pointerYaw;
      head.rotation.z = pet
        ? Math.sin(time * 0.006) * 0.15
        : pawGroom
          ? -0.14
          : 0;
      head.rotation.x = sleep
        ? 0.38
        : pet
          ? -0.16
          : stretch
            ? -0.12
            : pointerPitch;

      // Blinking & happy pet eyes
      eyes.forEach(
        (m) =>
          (m.scale.y =
            sleep || state === "blink" ? 0.14 : pet ? 0.32 : 1),
      );

      // Fluid 8-segment S-curve tail (curls around flank in sleep, arches in stretch/pet, counter-balances in walk)
      tail.rotation.y = sleep
        ? 0.85
        : Math.sin(time * 0.0024) *
          (walk || state === "tail" || pet ? 0.35 : 0.14);
      tail.rotation.x = sleep ? -0.62 : stretch ? 0.28 : 0;
      tailSegments.forEach((seg, idx) => {
        seg.position.x = sleep
          ? 0.045 * (idx + 1)
          : Math.sin(time * 0.0032 - idx * 0.45) *
            (walk || state === "tail" || pet
              ? 0.035 * (idx + 1)
              : 0.012 * (idx + 1));
      });

      // Independent ear twitches
      ears.forEach(
        (ear, i) =>
          (ear.rotation.z =
            (i === 0 ? 1 : -1) * 0.16 +
            (state === "ear" || pet || (sleep && Math.sin(time * 0.001) > 0.92)
              ? Math.sin(time * 0.009 + i * 1.7) * 0.16
              : 0)),
      );

      // Grounded 4-paw gait (keeps >= 2 paws at exact 0.115 base height so bottom contact = 0.0)
      paws.forEach((m, i) => {
        m.position.y =
          0.115 +
          (walk
            ? Math.max(
                0,
                Math.sin(time * 0.015 + (i === 0 || i === 3 ? 0 : Math.PI)),
              ) * 0.075
            : pawGroom && i === 1
              ? Math.max(0, Math.sin(time * 0.01)) * 0.12
              : 0);
      });
    },
  };
}
