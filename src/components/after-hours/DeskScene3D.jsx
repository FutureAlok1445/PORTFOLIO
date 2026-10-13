import { useEffect, useRef } from "react";
import * as THREE from "three";
import { scrollToTarget } from "../scroll";
// One original procedural scene. The fallback is a separate, immediate vector poster.
export default function DeskScene3D() {
  const host = useRef(null);
  useEffect(() => {
    const el = host.current;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.dataset.animationActive = "false";
    const context = canvas.getContext("webgl2", {
      antialias: true,
      alpha: false,
    });
    if (!context) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, context, antialias: true });
    } catch {
      return;
    }
    el.append(canvas);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor("#19212b");
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -4.4,
      4.4,
      3.08,
      -3.08,
      0.1,
      50,
    );
    const base = new THREE.Vector3(7.5, 6.2, 9.8);
    camera.position.copy(base);
    camera.lookAt(0, 1.65, 0);
    const world = new THREE.Group();
    scene.add(world);
    const materials = new Map();
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
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }
    function cylinder(rt, rb, h, x, y, z, color) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(rt, rb, h, 24),
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
      new THREE.PlaneGeometry(30, 30),
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
    for (let i = 0; i < 3; i++)
      box(
        0.73 - i * 0.08,
        0.022,
        0.01,
        -2.55,
        3.3 - i * 0.18,
        -2.26,
        "#8c8b7e",
      );
    const pin = box(0.9, 0.96, 0.03, 2.58, 3.15, -2.28, "#87a9c4");
    pin.rotation.z = -0.09;
    for (let i = 0; i < 3; i++)
      box(0.5, 0.018, 0.015, 2.58, 3.4 - i * 0.2, -2.25, "#3d596b");
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
    for (let i = 0; i < 6; i++) {
      box(0.1, 0.027, 0.016, -1.12, 0.5 - i * 0.18, 0.133, "#657c8c", monitor);
      box(
        1.2 - (i % 3) * 0.24,
        0.037,
        0.016,
        -0.32 + (i % 2) * 0.11,
        0.5 - i * 0.18,
        0.133,
        i === 3 ? "#d7a35d" : "#87a9c4",
        monitor,
      );
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
    notebook.position.set(2.05, 1.09, 0.85);
    notebook.rotation.y = -0.21;
    world.add(notebook);
    const cover = box(1.42, 0.08, 1.38, 0, 0, 0, "#8fae9c", notebook);
    cover.userData.target = "about";
    hotspots.push(cover);
    box(1.34, 0.05, 1.28, 0.02, 0.064, 0, "#f5efe5", notebook);
    box(0.035, 0.012, 1.27, -0.42, 0.097, 0, "#d98e7d", notebook);
    for (let i = 0; i < 5; i++)
      box(0.8, 0.005, 0.014, 0.15, 0.1, -0.43 + i * 0.16, "#87a9c4", notebook);
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
    const pointer = new THREE.Vector2();
    const target = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let visible = false,
      lost = false,
      last = 0;
    function resize() {
      const w = el.clientWidth,
        h = el.clientHeight;
      renderer.setSize(w, h, false);
      const aspect = w / h;
      camera.left = -3.45 * aspect;
      camera.right = 3.45 * aspect;
      camera.top = 3.45;
      camera.bottom = -3.45;
      camera.updateProjectionMatrix();
    }
    function draw(time) {
      if (time - last < 1000 / 30) return;
      last = time;
      pointer.lerp(target, 0.075);
      camera.position.set(
        base.x + pointer.x * 0.28,
        base.y + pointer.y * 0.18,
        base.z,
      );
      camera.lookAt(0, 1.65, 0);
      renderer.render(scene, camera);
    }
    function sync() {
      const active = visible && !document.hidden && !lost;
      canvas.dataset.animationActive = String(active);
      renderer.setAnimationLoop(active ? draw : null);
    }
    function move(e) {
      const r = el.getBoundingClientRect();
      target.set(
        ((e.clientX - r.left) / r.width - 0.5) * 2,
        ((e.clientY - r.top) / r.height - 0.5) * 2,
      );
    }
    function leave() {
      target.set(0, 0);
    }
    function click(e) {
      const r = el.getBoundingClientRect();
      raycaster.setFromCamera(
        new THREE.Vector2(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          -((e.clientY - r.top) / r.height) * 2 + 1,
        ),
        camera,
      );
      const hit = raycaster.intersectObjects(hotspots, false)[0];
      if (hit) scrollToTarget(hit.object.userData.target);
    }
    function loss(e) {
      e.preventDefault();
      lost = true;
      canvas.style.opacity = "0";
      sync();
    }
    function restore() {
      lost = false;
      canvas.style.opacity = "1";
      sync();
    }
    resize();
    renderer.render(scene, camera);
    canvas.dataset.sceneReady = "true";
    const sizing = new ResizeObserver(resize);
    sizing.observe(el);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("click", click);
    document.addEventListener("visibilitychange", sync);
    canvas.addEventListener("webglcontextlost", loss);
    canvas.addEventListener("webglcontextrestored", restore);
    return () => {
      renderer.setAnimationLoop(null);
      sizing.disconnect();
      observer.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("click", click);
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("webglcontextlost", loss);
      canvas.removeEventListener("webglcontextrestored", restore);
      const geometries = new Set(),
        mats = new Set();
      scene.traverse((o) => {
        if (o.geometry) geometries.add(o.geometry);
        if (o.material) mats.add(o.material);
      });
      geometries.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, []);
  return <div className="desk-webgl" ref={host} />;
}
