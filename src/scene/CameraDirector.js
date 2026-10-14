import * as THREE from "three";
import { sceneLayout } from "./worldLayout.js";
const v = (a) => new THREE.Vector3(...a),
  typing = (e) =>
    e.target.closest?.(
      "input,textarea,select,[contenteditable],dialog,.ring-console",
    );
export class CameraDirector {
  constructor(camera, position, target, halfHeight, invalidate) {
    this.camera = camera;
    this.position = position;
    this.target = target;
    this.height = halfHeight;
    this.goalPosition = position.clone();
    this.goalTarget = target.clone();
    this.goalHeight = halfHeight;
    this.invalidate = invalidate;
    this.mode = "guided";
    this.requested = "guided";
    this.focused = null;
    this.saved = null;
    this.pointer = null;
    this.keys = new Set();
    this.speed = 4;
    this.pitch = 0;
    this.yaw = 0;
    this.radius = 10;
    this.solids = sceneLayout.solids;
    this.route = [];
    this.routeKey = "";
  }
  capture() {
    return {
      position: this.position.clone(),
      target: this.target.clone(),
      height: this.height,
    };
  }
  syncOrbit() {
    const d = this.position.clone().sub(this.target);
    this.radius = d.length();
    this.yaw = Math.atan2(d.x, d.z);
    this.pitch = Math.asin(d.y / this.radius);
  }
  setMode(mode, aspect) {
    this.route = [];
    this.routeKey = "";
    this.mode = mode;
    this.requested = mode;
    this.keys.clear();
    this.pointer = null;
    this.goalPosition.copy(this.position);
    this.goalTarget.copy(this.target);
    this.goalHeight = this.height;
    this.syncOrbit();
    if (mode === "top") {
      const r = sceneLayout.room;
      this.goalTarget.set((r.minX + r.maxX) / 2, 0, (r.minZ + r.maxZ) / 2);
      this.goalPosition
        .copy(this.goalTarget)
        .add(new THREE.Vector3(0, 30, 0.01));
      this.goalHeight =
        Math.max((r.maxX - r.minX) / (2 * aspect), (r.maxZ - r.minZ) / 2) + 1.2;
    }
    if (mode === "fly") {
      const d = this.target.clone().sub(this.position).normalize();
      this.yaw = Math.atan2(d.x, d.z);
      this.pitch = Math.asin(d.y);
      this.goalPosition.copy(this.constrain(this.position, this.position));
      this.goalHeight = 3.4;
      this.flyTarget();
    }
  }
  focusPoint(point) {
    this.pointBookmark = { ...this.capture(), mode: this.mode };
    this.pendingPoint = new THREE.Vector3(...point);
  }
  returnPoint() {
    if (!this.pointBookmark) return this.mode;
    this.pendingReturn = this.pointBookmark;
    this.pointBookmark = null;
    return this.pendingReturn.mode;
  }
  flyTarget() {
    const d = new THREE.Vector3(
      Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      Math.cos(this.yaw) * Math.cos(this.pitch),
    );
    this.goalTarget.copy(this.goalPosition).addScaledVector(d, 10);
  }
  inside(point, padding = 0.32) {
    for (const s of this.solids) {
      if (s.cylinder) {
        const [x, z, r, h] = s.cylinder;
        if (
          point.y < h + padding &&
          Math.hypot(point.x - x, point.z - z) < r + padding
        )
          return true;
      } else if (
        point.x > s.min[0] - padding &&
        point.x < s.max[0] + padding &&
        point.y > s.min[1] - padding &&
        point.y < s.max[1] + padding &&
        point.z > s.min[2] - padding &&
        point.z < s.max[2] + padding
      )
        return true;
    }
    return false;
  }
  segmentBlocked(from, to) {
    const steps = Math.ceil(from.distanceTo(to) / 0.18);
    for (let i = 1; i < steps; i++)
      if (this.inside(from.clone().lerp(to, i / steps))) return true;
    return false;
  }
  constrain(from, to) {
    const r = sceneLayout.room,
      p = to.clone();
    p.x = THREE.MathUtils.clamp(p.x, r.minX + 0.4, r.maxX - 0.4);
    p.z = THREE.MathUtils.clamp(p.z, r.minZ + 0.4, r.maxZ - 0.4);
    p.y = THREE.MathUtils.clamp(p.y, 0.45, 12);
    const steps = Math.max(1, Math.ceil(from.distanceTo(p) / 0.12)),
      out = from.clone();
    if (this.inside(out)) {
      out.y = 4.2;
      out.x = THREE.MathUtils.clamp(out.x, r.minX + 0.4, r.maxX - 0.4);
      out.z = THREE.MathUtils.clamp(out.z, r.minZ + 0.4, r.maxZ - 0.4);
    }
    for (let n = 1; n <= steps; n++) {
      const next = from.clone().lerp(p, n / steps);
      if (!this.inside(next)) out.copy(next);
      else break;
    }
    return out;
  }
  down(e) {
    if (this.mode === "guided" || this.focused) return false;
    if (this.mode !== "fly") {
      this.goalPosition.copy(this.position);
      this.goalTarget.copy(this.target);
      this.syncOrbit();
    }
    this.pointer = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      button: e.button,
      moved: false,
    };
    return true;
  }
  move(e) {
    if (!this.pointer) return false;
    const dx = e.clientX - this.pointer.x,
      dy = e.clientY - this.pointer.y;
    this.pointer.x = e.clientX;
    this.pointer.y = e.clientY;
    this.pointer.moved ||= Math.abs(dx) + Math.abs(dy) > 2;
    if (this.mode === "fly") {
      this.yaw -= dx * 0.005;
      this.pitch = THREE.MathUtils.clamp(this.pitch - dy * 0.004, -1.3, 1.3);
      this.flyTarget();
    } else if (this.mode === "top" || this.pointer.button === 2 || e.shiftKey) {
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(
          this.camera.quaternion,
        ),
        up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion),
        delta = right
          .multiplyScalar(-dx * 0.018)
          .add(up.multiplyScalar(dy * 0.018));
      const previousTarget = this.goalTarget.clone();
      this.goalTarget.add(delta);
      const r = sceneLayout.room;
      this.goalTarget.x = THREE.MathUtils.clamp(
        this.goalTarget.x,
        r.minX,
        r.maxX,
      );
      this.goalTarget.z = THREE.MathUtils.clamp(
        this.goalTarget.z,
        r.minZ,
        r.maxZ,
      );
      this.goalPosition.add(this.goalTarget.clone().sub(previousTarget));
    } else {
      this.yaw -= dx * 0.006;
      this.pitch = THREE.MathUtils.clamp(this.pitch + dy * 0.005, 0.1, 1.48);
      const offset = new THREE.Vector3(
        Math.sin(this.yaw) * Math.cos(this.pitch),
        Math.sin(this.pitch),
        Math.cos(this.yaw) * Math.cos(this.pitch),
      ).multiplyScalar(this.radius);
      this.goalPosition.copy(this.goalTarget).add(offset);
    }
    this.invalidate();
    return true;
  }
  up() {
    const moved = this.pointer?.moved;
    this.pointer = null;
    return moved;
  }
  wheel(e) {
    if (this.mode === "guided" || this.focused) return false;
    e.preventDefault();
    this.goalHeight = THREE.MathUtils.clamp(
      this.goalHeight * Math.exp(e.deltaY * 0.001),
      1.8,
      22,
    );
    this.invalidate();
    return true;
  }
  key(e, down) {
    if (typing(e) || this.focused) return false;
    const k = e.key.toLowerCase();
    if (
      this.mode !== "fly" ||
      ![
        "w",
        "a",
        "s",
        "d",
        "q",
        "e",
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        "shift",
      ].includes(k)
    )
      return false;
    e.preventDefault();
    if (down) this.keys.add(k);
    else this.keys.delete(k);
    this.invalidate();
    return true;
  }
  update(dt, pose, state, aspect) {
    this.speed = state.cameraSpeed || 4;
    if (!state.focusedObject && this.focused) {
      if (this.saved) {
        this.goalPosition.copy(this.saved.position);
        this.goalTarget.copy(this.saved.target);
        this.goalHeight = this.saved.height;
        this.mode = this.saved.mode;
        this.requested = this.saved.mode;
      }
      this.focused = null;
      this.saved = null;
      this.syncOrbit();
    }
    const nextMode = state.cameraMode || "guided";
    if (!state.focusedObject && nextMode !== this.requested)
      this.setMode(nextMode, aspect);
    if (this.pendingPoint && !state.focusedObject) {
      this.goalTarget.copy(this.pendingPoint).add(new THREE.Vector3(0, 0.4, 0));
      this.goalPosition
        .copy(this.pendingPoint)
        .add(new THREE.Vector3(3, 2.4, 4));
      this.goalHeight = 1.65;
      this.pendingPoint = null;
      this.syncOrbit();
    }
    if (this.pendingReturn && !state.focusedObject) {
      this.goalPosition.copy(this.pendingReturn.position);
      this.goalTarget.copy(this.pendingReturn.target);
      this.goalHeight = this.pendingReturn.height;
      this.pendingReturn = null;
    }
    if (state.focusedObject) {
      if (!this.focused) {
        this.saved = { ...this.capture(), mode: this.mode };
        this.keys.clear();
        this.pointer = null;
      }
      this.focused = state.focusedObject;
      this.goalPosition.copy(v(pose.position));
      this.goalTarget.copy(v(pose.target));
      this.goalHeight = pose.halfHeight;
    } else if (this.mode === "guided") {
      this.goalPosition.copy(v(pose.position));
      this.goalTarget.copy(v(pose.target));
      this.goalHeight = pose.halfHeight;
    } else if (this.mode === "fly" && this.keys.size) {
      const sign = (a, b) =>
          Number(a.some((k) => this.keys.has(k))) -
          Number(b.some((k) => this.keys.has(k))),
        forward = sign(["w", "arrowup"], ["s", "arrowdown"]),
        right = sign(["d", "arrowright"], ["a", "arrowleft"]),
        up = sign(["e"], ["q"]);
      const move = new THREE.Vector3(
        Math.sin(this.yaw) * forward - Math.cos(this.yaw) * right,
        up,
        Math.cos(this.yaw) * forward + Math.sin(this.yaw) * right,
      );
      if (move.length() > 0)
        move
          .normalize()
          .multiplyScalar(this.speed * (this.keys.has("shift") ? 2 : 1) * dt);
      const old = this.goalPosition.clone();
      this.goalPosition.copy(this.constrain(old, old.clone().add(move)));
      this.flyTarget();
    }
    const scripted = this.focused || this.mode === "guided";
    const routeKey = scripted ? this.goalPosition.toArray().join("/") : "free";
    if (routeKey !== this.routeKey) {
      this.routeKey = routeKey;
      this.route = [];
      if (scripted && this.segmentBlocked(this.position, this.goalPosition)) {
        const lift = Math.max(8.1, this.position.y, this.goalPosition.y);
        this.route = [
          new THREE.Vector3(this.position.x, lift, this.position.z),
          new THREE.Vector3(this.goalPosition.x, lift, this.goalPosition.z),
        ];
      }
    }
    if (this.route.length && this.position.distanceTo(this.route[0]) < 0.12)
      this.route.shift();
    const activePosition = this.route[0] || this.goalPosition;
    const ease = 1 - Math.exp(-dt * (this.pointer || this.keys.size ? 14 : 6));
    this.position.lerp(activePosition, ease);
    this.target.lerp(this.goalTarget, ease);
    this.height = THREE.MathUtils.lerp(
      this.height,
      this.route.length ? Math.max(this.goalHeight, 5) : this.goalHeight,
      ease,
    );
    this.camera.position.copy(this.position);
    this.camera.lookAt(this.target);
    const hw = this.height * aspect;
    Object.assign(this.camera, {
      left: -hw,
      right: hw,
      top: this.height,
      bottom: -this.height,
    });
    this.camera.updateProjectionMatrix();
    this.moving =
      this.position.distanceTo(this.goalPosition) > 0.002 ||
      this.target.distanceTo(this.goalTarget) > 0.002 ||
      Math.abs(this.height - this.goalHeight) > 0.002 ||
      this.keys.size > 0 ||
      this.route.length > 0;
    return {
      position: this.goalPosition,
      target: this.goalTarget,
      height: this.goalHeight,
      moving: this.moving,
    };
  }
}
