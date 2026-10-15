/**
 * Tactile Studio Sound Synthesis via Web Audio API
 * Generates tactile auditory feedback without relying on external audio files.
 * Respects user preferences and autoplay policies.
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled() {
  if (typeof window === "undefined") return false;
  try {
    return (
      sessionStorage.getItem("sound") === "on" ||
      localStorage.getItem("sound") === "on"
    );
  } catch {
    return false;
  }
}

export function setSoundEnabled(enabled) {
  if (typeof window === "undefined") return enabled;
  try {
    const val = enabled ? "on" : "off";
    sessionStorage.setItem("sound", val);
    localStorage.setItem("sound", val);
  } catch {
    /* Optional persistence */
  }
  return enabled;
}

/**
 * Mechanical keyboard switch click
 * @param {number} pitch - Pitch multiplier (default 1.0)
 */
export function playKeyClick(pitch = 1.0) {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    const freq = 1200 * Math.max(0.4, Math.min(2.5, pitch));
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.045);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    /* Silent failure */
  }
}

/**
 * Articulated studio lamp pull chain
 * @param {boolean} isTurnOn - True for turning on, false for off
 */
export function playLampPull(isTurnOn = true) {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // Metal chain pull rattle
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(isTurnOn ? 540 : 420, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      isTurnOn ? 1800 : 260,
      ctx.currentTime + 0.07
    );

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.085);
  } catch {
    /* Silent failure */
  }
}

/**
 * Tactile paper ledger / field note page turn
 */
export function playPageTurn() {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // Pink noise burst simulation for paper rustle
    const bufferSize = ctx.sampleRate * 0.06;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch {
    /* Silent failure */
  }
}

/**
 * Retro project cartridge slot insertion
 */
export function playCartridgeSlot() {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.setValueAtTime(440, ctx.currentTime + 0.02);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.085);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch {
    /* Silent failure */
  }
}
