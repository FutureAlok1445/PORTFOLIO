import * as THREE from "three";
// Original geometric silhouettes, kept intentionally simple at archive scale.
export function buildArtifact(project, material, texture, box) {
  const group = new THREE.Group();
  const slab = (w, h, d, x, y, z, color = "#f5f0e6") =>
    box(w, h, d, x, y, z, color, group);
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 0.94),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.86 }),
  );
  plane.position.set(0, 0.32, 0.18);
  group.add(plane);
  const kind = project.visual;
  if (kind === "history") {
    slab(
      1.66,
      1.4,
      0.23,
      0,
      0.24,
      0,
      kind === "history" ? "#92af9a" : "#d7cec0",
    );
    slab(1.54, 1.29, 0.035, 0.04, 0.26, 0.14);
    slab(0.075, 1.42, 0.29, -0.73, 0.24, 0, "#82b4cf");
    slab(0.13, 0.42, 0.035, 0.53, 0.91, 0.18, "#d98470");
  } else if(kind==='finance') {
    slab(1.95,1.3,.12,0,.22,0,'#d7cec0');
    slab(.08,1.38,.17,0,.22,.02,'#675347');
    for(let i=0;i<3;i++)slab(.22,.28,.07,.72,.76-i*.35,.12,['#92af9a','#f2c477','#d98470'][i]);
    plane.scale.set(.94,1,1);
  } else if(kind==='agency') {
    slab(1.8,.12,1.15,0,-.4,0,'#675347');
    slab(1.55,1.05,.15,-.15,.35,-.1,'#202d39');
    slab(.43,.75,.13,.79,-.05,.2,'#82b4cf');
    slab(.32,.59,.04,.79,-.04,.29,'#f5efe5');
    slab(.13,.45,.15,-.15,-.3,-.1,'#53626a');
    plane.position.set(-.15,.35,0);plane.scale.set(.92,.94,1);
  } else if (kind === "workflow") {
    for (let i = 0; i < 3; i++) {
      slab(
        1.65,
        0.07,
        1,
        -0.04 + i * 0.035,
        -0.36 + i * 0.17,
        -0.04 + i * 0.06,
        "#87a9c4",
      );
      slab(1.53, 0.055, 0.88, 0, -0.32 + i * 0.17, 0);
    }
    plane.rotation.x = -0.3;
    plane.position.y = 0.43;
  } else if (kind === "commerce") {
    slab(1.64, 1.1, 0.88, 0, 0.13, -0.25, "#d7cec0");
    slab(1.72, 0.13, 0.97, 0, 0.77, -0.25, "#f5f0e6");
    slab(0.12, 1.25, 1.01, 0, 0.16, -0.25, "#d98470");
    slab(1.7, 0.12, 1.01, 0, 0.35, -0.25, "#d98470");
    plane.position.z = 0.28;
  } else if (kind === "aura" || kind === "forensics") {
    for (let i = 0; i < 3; i++)
      slab(
        1.58,
        1.24,
        0.035,
        (i - 1) * 0.065,
        0.24 + i * 0.045,
        -0.04 + i * 0.05,
        i === 1 ? "#82b4cf" : "#d7cec0",
      );
    slab(1.66, 0.09, 0.23, 0, 0.96, 0.1, "#202d39");
    if(kind==='forensics'){
      slab(1.9,.15,1.2,0,-.4,.1,'#82b4cf');
      const lens=new THREE.Mesh(new THREE.TorusGeometry(.24,.04,8,24),material('#53626a'));
      lens.position.set(.62,.24,.35);group.add(lens);slab(.09,.45,.07,.78,-.04,.35,'#53626a');
    }
  } else if (kind === "typing") {
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
          row === 0 && col === 0 ? "#f2c477" : "#d7cec0",
        );
    plane.position.set(0, 0.72, -0.12);
    plane.scale.set(0.95, 0.5, 1);
  } else if (kind === "orbit") {
    slab(1.75, 0.16, 1.18, 0, -0.3, 0, "#202d39");
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      slab(
        0.23,
        0.32,
        0.23,
        Math.sin(a) * 0.65,
        -0.08,
        Math.cos(a) * 0.43,
        i < 4 ? "#82b4cf" : "#f2c477",
      );
    }
    plane.position.set(0, 0.7, -0.12);
    plane.scale.set(0.95, 0.6, 1);
  } else if (kind === "booking") {
    slab(1.85, 1.06, 0.11, 0, 0.25, 0, "#f5f0e6");
    for (let i = 0; i < 6; i++)
      slab(0.035, 0.07, 0.02, 0.53, -0.18 + i * 0.17, 0.08, "#d7cec0");
    plane.scale.set(1.08, 1, 1);
  } else if (kind === "matching") {
    slab(1.75, 1.45, 0.12, 0, 0.26, 0, "#947863");
    for (let i = 0; i < 3; i++)
      slab(0.43, 0.91, 0.05, -0.53 + i * 0.52, 0.25, 0.09, "#f5f0e6");
  } else if (kind === "fraud") {
    slab(1.68, 1.3, 0.08, 0, 0.26, 0, "#d7cec0");
    slab(1.56, 0.22, 0.06, 0, 0.24, 0.12, "#d98470");
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
