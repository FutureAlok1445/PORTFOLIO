import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createWorkshopWorld } from "./createWorkshopWorld";
import { chapterById, patchZones } from "./SceneTimeline";
import { useExperience } from "../components/after-hours/ExperienceContext";
import { scrollToTarget } from "../components/scroll";
import { content } from "../data/content";
import patchManifest from "../../public/images/after-hours/patch/patch-manifest.json";
import { CameraDirector } from "./CameraDirector";
import { createWorldDebug } from "./WorldDebug";
import { spatialAudit } from "./SpatialAudit";
import { sceneLayout } from "./worldLayout";
export default function WorkshopCanvas({ patchAnchor, onReady }) {
  const host = useRef(null);
  const {
    snapshot,
    command,
    sceneAPI: sceneAPIRef,
    select,
    inspect,
    toggleLamp,
    chooseTool,
    sceneFailed,
    openObject,
    surfaceAnchor,
    actionsAnchor,
  } = useExperience();
  const objectOpen = useRef(openObject);
  useEffect(() => {
    objectOpen.current = openObject;
  }, [openObject]);
  useEffect(() => {
    const el = host.current,
      canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.dataset.animationActive = "false";
    const context = canvas.getContext("webgl2", {
      alpha: false,
      antialias: true,
    });
    if (!context) {
      sceneFailed();
      return;
    }
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context,
        antialias: true,
        preserveDrawingBuffer: location.search.includes("capture=1"),
      });
    } catch {
      sceneFailed();
      return;
    }
    el.append(canvas);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.24;
    let raf = 0,
      visible = true,
      lost = false,
      disposed = false,
      last = 0,
      lastCommand = -1,
      pulseStart = -5000,
      hover = -1,
      drag = null,
      walkStart = -5000,
      halfHeight = chapterById.desk.halfHeight,
      angle = 0,
      inspectAmount = 0,
      ready = false;
    let patchState = "idle",
      patchStarted = 0,
      spriteTimer = 0;
    const focusBlends = {};
    let settledChapter = null,
      spatialSamples = 0;
    const collisionFrames = [];
    const frames = [],
      world = createWorkshopWorld(invalidate),
      { scene, camera } = world;
    const position = new THREE.Vector3(...chapterById.desk.position),
      target = new THREE.Vector3(...chapterById.desk.target),
      pointerTarget = new THREE.Vector2(),
      raycaster = new THREE.Raycaster();
    const debug =
      import.meta.env.DEV &&
      new URLSearchParams(location.search).has("worldDebug")
        ? createWorldDebug(world)
        : null;
    const director = new CameraDirector(
      camera,
      position,
      target,
      halfHeight,
      invalidate,
    );
    function invalidate() {
      if (!raf && visible && !lost && !disposed && !document.hidden) {
        canvas.dataset.animationActive = "true";
        raf = requestAnimationFrame(draw);
      }
    }
    function resize() {
      renderer.setSize(el.clientWidth, el.clientHeight, false);
      invalidate();
    }
    function draw(time) {
      clearTimeout(spriteTimer);
      raf = 0;
      if (disposed || lost || !visible || document.hidden) {
        canvas.dataset.animationActive = "false";
        return;
      }
      const dt = Math.min((time - (last || time - 16)) / 1000, 0.06),
        ease = 1 - Math.exp(-dt * 6);
      if (last) frames.push(time - last);
      if (frames.length > 240) frames.shift();
      last = time;
      const state = snapshot.current || {
          chapter: "desk",
          lampOn: true,
          selected: 0,
          ambient: true,
          toolCategory: "All tools",
        },
        chapterPose = chapterById[state.chapter] || chapterById.desk,
        surface = world.surfaces[state.focusedObject],
        pose = surface
          ? {
              ...chapterPose,
              position: surface.camera,
              target: surface.position,
              halfHeight: Math.max(
                surface.halfHeight,
                surface.width / (2 * (el.clientWidth / el.clientHeight)) + 0.18,
              ),
            }
          : chapterPose;
      world.toolkitObjects.forEach((o) => (o.visible = true));
      world.journeyObjects.forEach((o) => (o.visible = true));
      world.archive.visible = true;
      let focusMoving = false;
      Object.entries(world.surfaces).forEach(([id, item]) => {
        if (id === "monitor" || id === "window") return;
        const goal = state.focusedObject === id ? 1 : 0;
        focusBlends[id] = THREE.MathUtils.lerp(
          focusBlends[id] || 0,
          goal,
          ease,
        );
        const blend = focusBlends[id];
        item.group.visible = blend > 0.008;
        item.group.scale.setScalar(0.24 + 0.76 * blend);
        item.group.rotation.x = (1 - blend) * -0.5;
        if (
          id === "notebook" &&
          command.current.type === "page" &&
          time - pulseStart < 450
        )
          item.group.rotation.y =
            Math.sin(((time - pulseStart) / 450) * Math.PI) * 0.035;
        else item.group.rotation.y = 0;
        focusMoving ||= Math.abs(blend - goal) > 0.008;
      });
      world.drawer.position.z = THREE.MathUtils.lerp(
        world.drawer.position.z,
        state.focusedObject === "credentials" ? 6.4 : 5.74,
        ease,
      );
      if (command.current.serial !== lastCommand) {
        lastCommand = command.current.serial;
        pulseStart = time;
      }
      const pageTurning =
        state.focusedObject === "notebook" &&
        command.current.type === "page" &&
        time - pulseStart < 650;
      world.turnPage(
        pageTurning ? (time - pulseStart) / 650 : 1,
        command.current.detail?.direction || 1,
      );
      world.surfaces.monitor.group.rotation.y = THREE.MathUtils.lerp(
        world.surfaces.monitor.group.rotation.y,
        state.focusedObject === "monitor" ? 0 : -0.06,
        ease,
      );
      const cameraState = director.update(
        dt,
        pose,
        state,
        el.clientWidth / el.clientHeight,
      );
      const desiredPosition = cameraState.position,
        desiredTarget = cameraState.target;
      halfHeight = director.height;
      const desiredAngle = drag
        ? drag.angle
        : (-state.selected * Math.PI * 2) / content.projects.length;
      const diff = Math.atan2(
        Math.sin(desiredAngle - angle),
        Math.cos(desiredAngle - angle),
      );
      angle += diff * (drag ? 1 - Math.exp(-dt * 22) : ease);
      world.archive.rotation.y = angle;
      inspectAmount = THREE.MathUtils.lerp(
        inspectAmount,
        state.focusedObject === "project" || state.inspecting ? 1 : 0,
        ease,
      );
      let pressMoving = false;
      for (const file of world.artifacts) {
        const isSelected = file.index === state.selected;
        const lift =
          (file.index === hover ? 0.08 : 0) +
          (isSelected ? 0.08 + inspectAmount * 0.65 : 0);
        file.artifact.position.y = THREE.MathUtils.lerp(
          file.artifact.position.y,
          file.home.y + lift,
          ease,
        );
        file.artifact.position.z = THREE.MathUtils.lerp(
          file.artifact.position.z,
          file.home.z + (isSelected ? inspectAmount * 1.2 : 0),
          ease,
        );
        file.artifact.scale.setScalar(
          isSelected ? 1.04 + inspectAmount * 0.1 : 1,
        );
      }
      for (const key of world.toolKeys) {
        const goal =
          key.baseY - (state.toolCategory === key.category ? 0.16 : 0);
        key.mesh.position.y = THREE.MathUtils.lerp(
          key.mesh.position.y,
          goal,
          ease,
        );
        key.label.position.y = key.mesh.position.y + 0.17;
        key.mesh.material.color.set(
          state.toolCategory === key.category ? "#f2c477" : "#d7cec0",
        );
        pressMoving ||= Math.abs(key.mesh.position.y - goal) > 0.002;
      }
      const lampGoal = state.lampOn ? 35 : 0;
      world.lamp.intensity = THREE.MathUtils.lerp(
        world.lamp.intensity,
        lampGoal,
        ease,
      );
      world.bulb.material.color.set(state.lampOn ? "#ffe1a6" : "#4e5961");
      world.switchMesh.rotation.z = state.lampOn ? 0 : 0.45;
      world.dawn.intensity = THREE.MathUtils.lerp(
        world.dawn.intensity,
        state.timeOfDay === "day" ? 2.4 : 0,
        ease,
      );
      world.skyMaterial.color.lerp(
        new THREE.Color(state.timeOfDay === "day" ? "#acbcbd" : "#334959"),
        ease,
      );
      const moodMoving = world.roomShell.update(dt, state, time);
      world.dust.visible =
        state.ambient && state.lampOn && state.chapter === "desk";
      world.dust.rotation.y = Math.sin(time * 0.00025) * 0.035;
      const pulseProgress = (time - pulseStart) / 1350;
      world.pulse.visible =
        state.ambient &&
        !state.focusedObject &&
        !state.inspecting &&
        !drag &&
        pulseProgress >= 0 &&
        pulseProgress < 1;
      world.signal.visible = world.pulse.visible;
      if (world.pulse.visible)
        world.pulse.position.copy(world.signalCurve.getPointAt(pulseProgress));
      let patchNeedsTick = false,
        patchFps = 2;
      if (patchAnchor.current) {
        const walkProgress = Math.max(
          0,
          Math.min(1, (time - walkStart) / 2600),
        );
        const travel =
          walkProgress < 0.6 ? walkProgress / 0.6 : (1 - walkProgress) / 0.4;
        const anchor = new THREE.Vector3(...patchZones.home);
        if (walkProgress < 1)
          anchor.x = THREE.MathUtils.lerp(
            patchZones.home[0],
            patchZones.walkEnd[0],
            travel,
          );
        if (patchState === "jump")
          anchor.y +=
            Math.sin(Math.min(1, (time - patchStarted) / 670) * Math.PI) * 0.18;
        world.patchModel.root.position.copy(anchor);
        world.patchModel.update(patchState, state.ambient ? time : 0);
        world.patchModel.root.rotation.y =
          patchState === "walk"
            ? Math.PI / 2
            : patchState === "return"
              ? -Math.PI / 2
              : 0;
        world.patchShadow.position.set(
          anchor.x,
          patchZones.home[1] + 0.003,
          anchor.z,
        );
        anchor.project(camera);
        const x = (anchor.x * 0.5 + 0.5) * el.clientWidth,
          y = (-anchor.y * 0.5 + 0.5) * el.clientHeight;
        const displayed =
          !state.focusedObject &&
          (["desk", "about", "contact"].includes(state.chapter) ||
            state.cameraMode !== "guided") &&
          x > 60 &&
          x < el.clientWidth - 60 &&
          y > 20 &&
          y < el.clientHeight - 10;
        world.patchModel.root.visible = false;
        world.patchModel.root.visible = !state.focusedObject;
        world.patchShadow.visible = displayed;
        const animation =
          patchManifest.animations[patchState] || patchManifest.animations.idle;
        const age = Math.max(0, time - patchStarted),
          duration = (animation.frames / animation.fps) * 1000;
        const active =
          state.ambient ||
          ["walk", "return", "pet", "wake", "stretch", "jump"].includes(
            patchState,
          );
        patchNeedsTick =
          displayed && active && (animation.loop || age < duration);
        patchFps = animation.fps;
        patchAnchor.current.style.visibility = displayed ? "visible" : "hidden";
        patchAnchor.current.style.left = x + "px";
        patchAnchor.current.style.top = y + "px";
        patchAnchor.current.style.transform = `translate(-50%, -${(patchManifest.anchor[1] / patchManifest.frameHeight) * 100}%)`;
        const perceived = Math.min(
          180,
          Math.max(85, (el.clientHeight / (halfHeight * 2)) * 1.8),
        );
        patchAnchor.current.style.width = perceived + "px";
        patchAnchor.current.style.height = perceived + "px";
      }
      renderer.setClearColor(state.timeOfDay === "day" ? "#81949c" : "#111821");
      debug?.update();
      renderer.render(scene, camera);
      if (surface && surfaceAnchor.current) {
        const corners = [
          [-surface.width / 2, surface.height / 2],
          [surface.width / 2, -surface.height / 2],
        ].map(([x, y]) =>
          surface.mesh.localToWorld(new THREE.Vector3(x, y, 0)).project(camera),
        );
        const bounds = el.getBoundingClientRect(),
          node = surfaceAnchor.current;
        const x = (corners[0].x * 0.5 + 0.5) * el.clientWidth + bounds.left,
          y = (-corners[0].y * 0.5 + 0.5) * el.clientHeight + bounds.top;
        node.style.left = x + "px";
        node.style.top = y + "px";
        node.style.width =
          (corners[1].x - corners[0].x) * 0.5 * el.clientWidth + "px";
        node.style.height =
          (corners[0].y - corners[1].y) * 0.5 * el.clientHeight + "px";
        const aligned =
          position.distanceTo(desiredPosition) < 0.04 &&
          target.distanceTo(desiredTarget) < 0.04 &&
          Math.abs(halfHeight - pose.halfHeight) < 0.02 &&
          !focusMoving;
        node.style.opacity = aligned ? "1" : "0";
        node.dataset.aligned = String(aligned);
      }
      if (actionsAnchor.current) {
        const locations = sceneLayout.anchors;
        for (const button of actionsAnchor.current.children) {
          const point = new THREE.Vector3(
            ...locations[button.dataset.worldObject],
          ).project(camera);
          button.style.visibility =
            point.z < -1 ||
            point.z > 1 ||
            Math.abs(point.x) > 1 ||
            Math.abs(point.y) > 1
              ? "hidden"
              : "visible";
          button.style.left = (point.x * 0.5 + 0.5) * el.clientWidth + "px";
          button.style.top = (-point.y * 0.5 + 0.5) * el.clientHeight + "px";
        }
      }
      if (!ready) {
        ready = true;
        onReady();
      }
      const moving =
        cameraState.moving ||
        moodMoving ||
        Math.abs(diff) > 0.002 ||
        Math.abs(
          inspectAmount -
            (state.focusedObject === "project" || state.inspecting ? 1 : 0),
        ) > 0.002 ||
        Math.abs(world.lamp.intensity - lampGoal) > 0.02 ||
        pressMoving ||
        focusMoving ||
        pageTurning ||
        world.pulse.visible ||
        time - walkStart < 2600;
      if (
        !cameraState.moving &&
        !state.focusedObject &&
        director.mode === "guided" &&
        settledChapter !== state.chapter
      ) {
        settledChapter = state.chapter;
        window.dispatchEvent(
          new CustomEvent("workshop:camera-settled", { detail: state.chapter }),
        );
      }
      if (cameraState.moving) settledChapter = null;
      const audit = location.search.includes("qa=1")
        ? spatialAudit(world)
        : undefined;
      if (audit) {
        spatialSamples++;
        if (audit.collisions.length && collisionFrames.length < 100)
          collisionFrames.push({ angle, collisions: audit.collisions });
      }
      canvas.dataset.cameraMode = state.focusedObject ? "focus" : director.mode;
      canvas.dataset.cameraSettled = String(!cameraState.moving);
      canvas.dataset.sceneChapter = state.chapter;
      canvas.dataset.sceneSettled = String(!moving);
      canvas.dataset.lampOn = String(state.lampOn);
      canvas.dataset.sceneReady = "true";
      canvas.dataset.selectedProject = String(state.selected);
      canvas.dataset.focusedObject = state.focusedObject || "";
      canvas.dataset.ringCount = String(world.artifacts.length);
      canvas.dataset.pageTurning = String(pageTurning);
      window.__workshopMetrics = {
        mode: director.mode,
        cameraHeight: halfHeight,
        target: target.toArray(),
        spatial: audit,
        spatialSamples,
        collisionFrames,
        frameIntervals: frames.slice(),
        triangles: renderer.info.render.triangles,
        geometries: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures,
        chapter: state.chapter,
        camera: position.toArray(),
        cameraRendered: camera.position.toArray(),
        archiveAngle: angle,
        ring: world.artifacts.map(({ index, slot }) => ({
          id: content.projects[index].slug,
          position: slot.position.toArray(),
          yaw: slot.rotation.y,
        })),
        patch: {
          state: patchState,
          position: world.patchModel.root.position.toArray(),
          visible: world.patchModel.root.visible,
        },
      };
      if (location.search.includes("qa=1"))
        window.__workshopHotspots = world.hotspots
          .filter((object) => {
            let node = object;
            while (node) {
              if (!node.visible) return false;
              node = node.parent;
            }
            return true;
          })
          .map((object) => {
            const point = object
              .getWorldPosition(new THREE.Vector3())
              .project(camera);
            return {
              ...object.userData,
              x: (point.x * 0.5 + 0.5) * el.clientWidth,
              y:
                (-point.y * 0.5 + 0.5) * el.clientHeight +
                el.getBoundingClientRect().top,
            };
          });
      if (moving) invalidate();
      else {
        canvas.dataset.animationActive = "false";
        last = 0;
        if (patchNeedsTick || state.ambient)
          spriteTimer = setTimeout(
            invalidate,
            1000 / (patchNeedsTick ? patchFps : 2),
          );
      }
    }
    function hit(e) {
      const r = el.getBoundingClientRect();
      raycaster.setFromCamera(
        new THREE.Vector2(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          -((e.clientY - r.top) / r.height) * 2 + 1,
        ),
        camera,
      );
      return raycaster.intersectObjects(
        world.hotspots.filter((object) => {
          let node = object;
          while (node) {
            if (!node.visible) return false;
            node = node.parent;
          }
          return true;
        }),
        false,
      )[0]?.object;
    }
    function move(e) {
      if (director.move(e)) return;
      const r = el.getBoundingClientRect();
      pointerTarget.set(
        ((e.clientX - r.left) / r.width - 0.5) * 2,
        ((e.clientY - r.top) / r.height - 0.5) * 2,
      );
      if (drag) {
        const next =
          drag.startAngle + ((e.clientX - drag.x) / el.clientWidth) * 6;
        drag.velocity = THREE.MathUtils.clamp(
          (next - drag.angle) /
            Math.max(0.008, (e.timeStamp - drag.time) / 1000),
          -4,
          4,
        );
        drag.time = e.timeStamp;
        drag.angle = next;
        drag.moved ||= Math.abs(e.clientX - drag.x) > 7;
      } else {
        const object = hit(e);
        if (object?.userData.target === "about")
          window.dispatchEvent(new Event("workshop:look"));
        hover =
          object?.userData.action === "artifact" ? object.userData.index : -1;
        canvas.style.cursor = object
          ? "pointer"
          : snapshot.current?.chapter === "work"
            ? "grab"
            : "default";
        const data = object?.userData;
        canvas.dataset.hoverAction =
          data?.action === "object"
            ? {
                monitor: "Open desktop",
                notebook: "Read field notes",
                toolkit: "Use the workbench",
                credentials: "Open credential drawer",
                contact: "Leave a note",
              }[data.objectId] || "Open object"
            : data?.action === "artifact"
              ? "Inspect " + content.projects[data.index].title
              : data?.action === "tool"
                ? "Press " + data.category
                : data?.action === "record"
                  ? "Read " + content.experience[data.index].company
                  : data?.action === "lamp"
                    ? "Switch the desk lamp"
                    : "";
      }
      invalidate();
    }
    function down(e) {
      if (director.down(e)) {
        canvas.setPointerCapture(e.pointerId);
        return;
      }
      if (
        snapshot.current?.chapter !== "work" ||
        snapshot.current.inspecting ||
        e.button !== 0
      )
        return;
      drag = {
        x: e.clientX,
        startAngle: angle,
        angle,
        velocity: 0,
        time: e.timeStamp,
        moved: false,
      };
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    }
    function up(e) {
      if (director.up()) return;
      const hadDrag = drag;
      if (hadDrag?.moved) {
        select(
          Math.round(
            -(hadDrag.angle + (hadDrag.velocity || 0) * 0.12) /
              ((Math.PI * 2) / content.projects.length),
          ),
        );
        drag = null;
        invalidate();
        return;
      }
      drag = null;
      const object = hit(e);
      if (!object) return;
      const data = object.userData;
      if (data.action === "window") objectOpen.current("window");
      else if (data.action === "lamp") toggleLamp();
      else if (data.action === "object") objectOpen.current(data.objectId);
      else if (data.action === "artifact") {
        window.dispatchEvent(new Event("workshop:look"));
        select(data.index);
        objectOpen.current("project");
      } else if (data.action === "tool") {
        chooseTool(data.category);
        objectOpen.current("toolkit");
      } else if (data.action === "record")
        objectOpen.current("journey", String(data.index));
      else if (data.target) scrollToTarget(data.target);
      invalidate();
    }
    function leave() {
      if (!drag) {
        pointerTarget.set(0, 0);
        hover = -1;
        invalidate();
      }
    }
    function visibility() {
      if (document.hidden) {
        director.keys.clear();
        director.pointer = null;
        cancelAnimationFrame(raf);
        clearTimeout(spriteTimer);
        raf = 0;
        canvas.dataset.animationActive = "false";
      } else {
        last = 0;
        invalidate();
      }
    }
    function lostContext(e) {
      e.preventDefault();
      lost = true;
      cancelAnimationFrame(raf);
      raf = 0;
      canvas.style.opacity = "0";
      canvas.dataset.animationActive = "false";
      sceneFailed();
    }
    function restoredContext() {
      lost = false;
      canvas.style.opacity = "1";
      invalidate();
    }
    function patchEvent(e) {
      patchState = e.detail.state.toLowerCase();
      patchStarted = performance.now();
      if (e.detail.state === "WALK") {
        walkStart = performance.now();
        invalidate();
      }
      invalidate();
    }
    function cancelPatch() {
      walkStart = -5000;
      patchState =
        snapshot.current?.chapter === "contact" ||
        snapshot.current?.lampOn === false
          ? "sleep"
          : "idle";
      patchStarted = performance.now();
      invalidate();
    }
    function cancel() {
      drag = null;
      director.pointer = null;
      director.keys.clear();
      invalidate();
    }
    if (location.search.includes("capture=1"))
      window.__captureWorkshop = ({
        width = 1600,
        height = 900,
        chapter = "desk",
        view = "guided",
        mood = "night",
      } = {}) => {
        const pose = chapterById[chapter];
        world.toolkitObjects.forEach((o) => (o.visible = true));
        world.journeyObjects.forEach((o) => (o.visible = true));
        world.archive.visible = true;
        world.pulse.visible = false;
        world.signal.visible = false;
        world.dust.visible = false;
        world.patchModel.root.visible = false;
        world.patchShadow.visible = false;
        renderer.setPixelRatio(1);
        renderer.setSize(width, height, false);
        const h = Math.max(
            pose.halfHeight,
            (sceneLayout.room.maxX - sceneLayout.room.minX) /
              (2 * (width / height)) +
              1,
          ),
          w = (h * width) / height;
        camera.position.set(...pose.position);
        camera.lookAt(new THREE.Vector3(...pose.target));
        if (view === "top") {
          const r = sceneLayout.room;
          camera.position.set(
            (r.minX + r.maxX) / 2,
            30,
            (r.minZ + r.maxZ) / 2 + 0.01,
          );
          camera.lookAt((r.minX + r.maxX) / 2, 0, (r.minZ + r.maxZ) / 2);
        }
        camera.left = -w;
        camera.right = w;
        camera.top = h;
        camera.bottom = -h;
        camera.updateProjectionMatrix();
        world.roomShell.update(100, { timeOfDay: mood, ambient: false }, 0);
        world.dawn.intensity = mood === "day" ? 2.4 : 0;
        renderer.setClearColor(mood === "day" ? "#81949c" : "#111821");
        renderer.render(scene, camera);
        const png = canvas.toDataURL("image/png");
        resize();
        invalidate();
        return png;
      };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) invalidate();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
        canvas.dataset.animationActive = "false";
      }
    });
    observer.observe(el);
    const sizing = new ResizeObserver(resize);
    sizing.observe(el);
    resize();
    sceneAPIRef.current = {
      invalidate,
      focusPatch: () => {
        director.focusPoint(patchZones.home);
        invalidate();
      },
      returnPatch: () => {
        const mode = director.returnPoint();
        invalidate();
        return mode;
      },
      setSpeed: (value) => {
        director.speed = value;
      },
    };
    const cameraWheel = (e) => director.wheel(e),
      cameraDown = (e) => director.key(e, true),
      cameraUp = (e) => director.key(e, false),
      contextMenu = (e) => {
        if (director.mode !== "guided") e.preventDefault();
      },
      blur = () => {
        director.keys.clear();
        director.pointer = null;
      };
    canvas.addEventListener("wheel", cameraWheel, { passive: false });
    canvas.addEventListener("contextmenu", contextMenu);
    window.addEventListener("keydown", cameraDown);
    window.addEventListener("keyup", cameraUp);
    window.addEventListener("blur", blur);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", cancel);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("webglcontextlost", lostContext);
    canvas.addEventListener("webglcontextrestored", restoredContext);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("workshop:patch", patchEvent);
    window.addEventListener("workshop:patch-cancel", cancelPatch);
    return () => {
      disposed = true;
      canvas.removeEventListener("wheel", cameraWheel);
      canvas.removeEventListener("contextmenu", contextMenu);
      window.removeEventListener("keydown", cameraDown);
      window.removeEventListener("keyup", cameraUp);
      window.removeEventListener("blur", blur);
      cancelAnimationFrame(raf);
      clearTimeout(spriteTimer);
      observer.disconnect();
      sizing.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", cancel);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("webglcontextlost", lostContext);
      canvas.removeEventListener("webglcontextrestored", restoredContext);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("workshop:patch", patchEvent);
      window.removeEventListener("workshop:patch-cancel", cancelPatch);
      sceneAPIRef.current = null;
      delete window.__workshopMetrics;
      delete window.__workshopDebug;
      delete window.__captureWorkshop;
      delete window.__workshopHotspots;
      world.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [
    snapshot,
    command,
    sceneAPIRef,
    select,
    inspect,
    toggleLamp,
    chooseTool,
    sceneFailed,
    surfaceAnchor,
    actionsAnchor,
    patchAnchor,
    onReady,
  ]);
  return <div className="living-canvas" ref={host} />;
}
