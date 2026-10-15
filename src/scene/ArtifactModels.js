import * as THREE from "three";

// AFTER HOURS v4 — 12 Visually Distinct, Source-Grounded 3D Project Artifacts.
// Each artifact fits strictly within its pedestal clearance envelope while presenting
// an unmistakable silhouette corresponding to its engineering domain.
export function buildArtifact(project, material, texture, box) {
  const group = new THREE.Group();
  const slab = (w, h, d, x, y, z, color = "#f5f0e6") =>
    box(w, h, d, x, y, z, color, group);
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 0.94),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.84 }),
  );
  plane.position.set(0, 0.32, 0.18);
  group.add(plane);

  const kind = project.visual;
  if (kind === "history") {
    // HistoFacts: Bound historical chronicle + spine + bookmark ribbon + golden Histoins token
    slab(1.68, 1.4, 0.24, 0, 0.24, 0, "#92af9a");
    slab(1.54, 1.29, 0.04, 0.04, 0.26, 0.14, "#f5f0e6");
    slab(0.09, 1.42, 0.29, -0.74, 0.24, 0, "#82b4cf"); // Book spine
    slab(0.13, 0.46, 0.04, 0.53, 0.92, 0.18, "#d98470"); // Bookmark tab
    const token = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.05, 20),
      material("#f2c477"),
    );
    token.rotation.x = Math.PI / 2;
    token.position.set(-0.52, -0.22, 0.22);
    group.add(token);
  } else if (kind === "finance") {
    // FinCoach AI: Financial dashboard board + 4 rising 3D telemetry bars + ledger spine
    slab(1.92, 1.32, 0.12, 0, 0.22, 0, "#d7cec0");
    slab(0.08, 1.38, 0.17, -0.1, 0.22, 0.02, "#675347");
    const heights = [0.28, 0.46, 0.36, 0.58];
    const cols = ["#87a9c4", "#92af9a", "#f2c477", "#d98470"];
    for (let i = 0; i < 4; i++) {
      slab(
        0.15,
        heights[i],
        0.09,
        0.32 + i * 0.18,
        -0.18 + heights[i] / 2,
        0.13,
        cols[i],
      );
    }
    plane.scale.set(0.92, 0.96, 1);
  } else if (kind === "agency") {
    // Techriciate: Walnut agency stage + desktop monitor + mobile handset + SSL badge
    slab(1.82, 0.12, 1.15, 0, -0.4, 0, "#675347");
    slab(1.52, 1.05, 0.15, -0.16, 0.35, -0.1, "#202d39");
    slab(0.44, 0.76, 0.13, 0.78, -0.04, 0.2, "#82b4cf");
    slab(0.34, 0.6, 0.04, 0.78, -0.03, 0.29, "#f5efe5");
    slab(0.14, 0.45, 0.15, -0.16, -0.3, -0.1, "#53626a");
    plane.position.set(-0.16, 0.35, 0);
    plane.scale.set(0.9, 0.92, 1);
  } else if (kind === "workflow") {
    // Reimbursement System: 3-stage stepped institutional routing trays + approval stamp
    for (let i = 0; i < 3; i++) {
      slab(
        1.65,
        0.07,
        1.0,
        -0.04 + i * 0.035,
        -0.36 + i * 0.17,
        -0.04 + i * 0.06,
        ["#87a9c4", "#f2c477", "#8fae9c"][i],
      );
      slab(1.53, 0.055, 0.88, 0, -0.32 + i * 0.17, 0, "#f5f0e6");
    }
    // Institutional approval stamp handle on top right
    slab(0.26, 0.08, 0.26, 0.56, 0.12, 0.28, "#675347");
    slab(0.1, 0.22, 0.1, 0.56, 0.24, 0.28, "#d98470");
    plane.rotation.x = -0.3;
    plane.position.y = 0.43;
  } else if (kind === "commerce") {
    // Bloom & Blossom: Sculpted gift box + lid + coral satin ribbons + top bow
    slab(1.64, 1.1, 0.88, 0, 0.13, -0.25, "#d7cec0");
    slab(1.72, 0.14, 0.97, 0, 0.77, -0.25, "#f5f0e6");
    slab(0.12, 1.25, 1.01, 0, 0.16, -0.25, "#d98470");
    slab(1.7, 0.12, 1.01, 0, 0.35, -0.25, "#d98470");
    slab(0.32, 0.12, 0.18, -0.14, 0.88, -0.25, "#d98470");
    slab(0.32, 0.12, 0.18, 0.14, 0.88, -0.25, "#d98470");
    plane.position.z = 0.28;
  } else if (kind === "aura" || kind === "forensics") {
    // AURA & TrustNet-AI: Layered evidence plates + analyzer header + forensic lens
    for (let i = 0; i < 3; i++)
      slab(
        1.58,
        1.24,
        0.038,
        (i - 1) * 0.065,
        0.24 + i * 0.045,
        -0.04 + i * 0.05,
        i === 1 ? "#82b4cf" : "#d7cec0",
      );
    slab(1.66, 0.11, 0.23, 0, 0.96, 0.1, "#202d39");
    if (kind === "aura") {
      // Request -> Detection -> Response status LEDs on analyzer header
      for (let k = 0; k < 3; k++) {
        slab(
          0.11,
          0.06,
          0.05,
          -0.62 + k * 0.18,
          0.96,
          0.22,
          ["#87a9c4", "#f2c477", "#d98470"][k],
        );
      }
    }
    if (kind === "forensics") {
      slab(1.9, 0.15, 1.2, 0, -0.4, 0.1, "#82b4cf");
      const lens = new THREE.Mesh(
        new THREE.TorusGeometry(0.24, 0.045, 10, 28),
        material("#53626a"),
      );
      lens.position.set(0.62, 0.24, 0.35);
      group.add(lens);
      slab(0.09, 0.45, 0.07, 0.78, -0.04, 0.35, "#53626a");
    }
  } else if (kind === "typing") {
    // SpeedoType: Tactile 21-key mechanical keyboard deck + WPM display
    slab(1.8, 0.14, 1.1, 0, -0.1, 0, "#202d39");
    for (let row = 0; row < 3; row++)
      for (let col = 0; col < 7; col++)
        slab(
          0.2,
          0.12,
          0.22,
          -0.73 + col * 0.244,
          0.03,
          -0.34 + row * 0.3,
          row === 0 && col === 0
            ? "#f2c477"
            : row === 2 && col === 3
              ? "#82b4cf"
              : "#d7cec0",
        );
    plane.position.set(0, 0.72, -0.12);
    plane.scale.set(0.95, 0.5, 1);
  } else if (kind === "orbit") {
    // COSMEON FS-LITE: Orbital constellation deck + 4 data & 2 parity satellites + orbital torus ring
    slab(1.78, 0.16, 1.18, 0, -0.3, 0, "#202d39");
    const orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.56, 0.022, 8, 36),
      material("#87a9c4"),
    );
    orbitRing.rotation.x = Math.PI / 2;
    orbitRing.position.set(0, -0.06, 0);
    group.add(orbitRing);
    slab(0.28, 0.28, 0.28, 0, -0.08, 0, "#8fae9c"); // Central Reed-Solomon 4+2 core
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      slab(
        0.22,
        0.32,
        0.22,
        Math.sin(a) * 0.65,
        -0.08,
        Math.cos(a) * 0.43,
        i < 4 ? "#82b4cf" : "#f2c477",
      );
    }
    plane.position.set(0, 0.7, -0.12);
    plane.scale.set(0.95, 0.6, 1);
  } else if (kind === "booking") {
    // BookItNow: Perforated cinema/event ticket stub + admit badge
    slab(1.85, 1.06, 0.11, 0, 0.25, 0, "#f5f0e6");
    slab(0.32, 1.06, 0.13, 0.74, 0.25, 0.02, "#87a9c4");
    for (let i = 0; i < 6; i++)
      slab(0.04, 0.07, 0.03, 0.53, -0.18 + i * 0.17, 0.08, "#d98470");
    plane.scale.set(0.96, 0.94, 1);
    plane.position.x = -0.12;
  } else if (kind === "matching") {
    // Talent-Sync: 3-column SBERT candidate-to-role matching matrix + score bars
    slab(1.78, 1.45, 0.12, 0, 0.26, 0, "#675347");
    for (let i = 0; i < 3; i++) {
      slab(0.43, 0.92, 0.05, -0.53 + i * 0.53, 0.25, 0.09, "#f5f0e6");
      slab(
        0.32,
        0.1,
        0.07,
        -0.53 + i * 0.53,
        0.52 - i * 0.14,
        0.13,
        ["#8fae9c", "#f2c477", "#87a9c4"][i],
      );
    }
  } else if (kind === "fraud") {
    // Credit Card Fraud Detection: Sculpted payment card + gold EMV chip + anomaly scanner bar
    slab(1.72, 1.28, 0.09, 0, 0.26, 0, "#d7cec0");
    slab(1.58, 0.22, 0.07, 0, 0.24, 0.12, "#d98470"); // Anomaly highlight bar
    slab(0.24, 0.18, 0.06, -0.54, 0.52, 0.13, "#f2c477"); // EMV gold chip
  } else {
    slab(1.7, 1.38, 0.12, 0, 0.23, 0, "#82b4cf");
    slab(1.58, 1.24, 0.04, 0.05, 0.25, 0.11);
  }

  group.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  group.userData = { slug: project.slug, kind };
  return group;
}
