// ================================================================================================
// Zero-Dependency Synthesized Web Audio Soundscape for Mission SAHOO-1
// Synthesizes rocket launch rumble, MECO silence cut, and ambient orbital pads procedurally
// Lazy-loaded, strictly user-activated (muted by default), zero audio file dependencies
// ================================================================================================

class MissionAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;

  // Ascent Rumble Nodes
  private rumbleGain: GainNode | null = null;
  private rumbleFilter: BiquadFilterNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private subGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;

  // Orbital Ambient Pad Nodes
  private padGain: GainNode | null = null;
  private padOscs: OscillatorNode[] = [];
  private padFilter: BiquadFilterNode | null = null;

  private isInitialized = false;

  public init() {
    if (this.isInitialized) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupRumbleNodes();
      this.setupOrbitalPadNodes();

      this.isInitialized = true;
    } catch {
      console.warn('Web Audio not supported in this environment');
    }
  }

  // Setup low-frequency rumble synthesis for launch and atmospheric ascent
  private setupRumbleNodes() {
    if (!this.ctx || !this.masterGain) return;

    // 1. Procedural Brown Noise Buffer (3 seconds looped)
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // boost gain
    }

    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    // Resonant lowpass filter for deep muffled roar
    this.rumbleFilter = this.ctx.createBiquadFilter();
    this.rumbleFilter.type = 'lowpass';
    this.rumbleFilter.frequency.setValueAtTime(65, this.ctx.currentTime);
    this.rumbleFilter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    this.rumbleGain = this.ctx.createGain();
    this.rumbleGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    this.noiseSource.connect(this.rumbleFilter);
    this.rumbleFilter.connect(this.rumbleGain);
    this.rumbleGain.connect(this.masterGain);

    // 2. Sub-bass tone oscillator (42 Hz)
    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.setValueAtTime(42, this.ctx.currentTime);

    this.subGain = this.ctx.createGain();
    this.subGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    this.subOsc.connect(this.subGain);
    this.subGain.connect(this.masterGain);

    this.noiseSource.start();
    this.subOsc.start();
  }

  // Setup ethereal chord pad for orbit, transfer, and deep space
  private setupOrbitalPadNodes() {
    if (!this.ctx || !this.masterGain) return;

    this.padFilter = this.ctx.createBiquadFilter();
    this.padFilter.type = 'lowpass';
    this.padFilter.frequency.setValueAtTime(380, this.ctx.currentTime);
    this.padFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    this.padGain = this.ctx.createGain();
    this.padGain.gain.setValueAtTime(0, this.ctx.currentTime);

    this.padFilter.connect(this.padGain);
    this.padGain.connect(this.masterGain);

    // Frequencies for a gentle atmospheric D-minor 9th chord (D2, A2, E3, F3)
    const chordFrequencies = [73.42, 110.0, 164.81, 174.61];

    chordFrequencies.forEach((freq, idx) => {
      if (!this.ctx || !this.padFilter) return;
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Subtle detune for shimmer
      osc.detune.setValueAtTime((idx - 1.5) * 4, this.ctx.currentTime);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(this.padFilter);
      osc.start();

      this.padOscs.push(osc);
    });
  }

  // Update telemetry & modulate audio crossfade based on mission progress
  public updateTelemetry(progress: number) {
    if (!this.ctx || !this.isInitialized) return;

    const t = this.ctx.currentTime;

    // MECO & Staging occurs at progress ~ 0.20
    if (progress < 0.20) {
      // ASCENT & BOOST: Powerful rumble + sub bass
      const intensity = Math.min(1, progress / 0.12);
      this.rumbleGain?.gain.setTargetAtTime(0.7 * intensity, t, 0.1);
      this.subGain?.gain.setTargetAtTime(0.5 * intensity, t, 0.1);
      this.rumbleFilter?.frequency.setTargetAtTime(55 + progress * 240, t, 0.1);

      // Silence orbital pad
      this.padGain?.gain.setTargetAtTime(0, t, 0.2);
    } else if (progress >= 0.20 && progress < 0.35) {
      // MECO & STAGING: Instant plume cut, brief near-silence beat!
      this.rumbleGain?.gain.setTargetAtTime(0.02, t, 0.05);
      this.subGain?.gain.setTargetAtTime(0, t, 0.05);

      // Pad begins emerging softly
      const padFade = (progress - 0.20) / 0.15;
      this.padGain?.gain.setTargetAtTime(0.25 * padFade, t, 0.3);
    } else {
      // ORBIT & DEEP SPACE: Zero engine noise, lush ethereal ambient space drone
      this.rumbleGain?.gain.setTargetAtTime(0, t, 0.1);
      this.subGain?.gain.setTargetAtTime(0, t, 0.1);

      // Lush ambient space pad
      this.padGain?.gain.setTargetAtTime(0.55, t, 0.2);
      this.padFilter?.frequency.setTargetAtTime(450 + Math.sin(progress * 8) * 80, t, 0.4);
    }
  }

  // Toggle user audio mute state
  public toggleMute(): boolean {
    if (!this.isInitialized) {
      this.init();
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.65;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.12);
    }

    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const audioEngine = new MissionAudioEngine();
