// Physics-Driven Continuous Liquid Sloshing Engine for Red Bull Can
// File: /freesound_community-waterbottle_sloshing-76280.mp3

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = false;
  private ambientGain: GainNode | null = null;
  private ambientSource: AudioNode | null = null;
  private sloshBuffer: AudioBuffer | null = null;
  private isBufferLoading: boolean = false;

  // Continuous fluid sloshing nodes
  private sloshSource: AudioBufferSourceNode | null = null;
  private sloshGain: GainNode | null = null;
  private sloshFilter: BiquadFilterNode | null = null;
  private canResonanceFilter: BiquadFilterNode | null = null;
  
  // Fluid momentum physics
  private momentum: number = 0;
  private animFrameId: number | null = null;
  private lastTime: number = 0;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.loadSloshSample();
    this.startPhysicsLoop();
  }

  // Preload and decode the authentic waterbottle sloshing MP3 sample
  private async loadSloshSample() {
    if (this.sloshBuffer || this.isBufferLoading) return;
    this.isBufferLoading = true;
    try {
      const response = await fetch('/freesound_community-waterbottle_sloshing-76280.mp3');
      const arrayBuffer = await response.arrayBuffer();
      if (this.ctx) {
        this.ctx.decodeAudioData(
          arrayBuffer,
          (decoded) => {
            this.sloshBuffer = decoded;
            this.isBufferLoading = false;
            if (this.enabled) {
              this.ensureContinuousSloshLoop();
            }
          },
          (err) => {
            console.warn('Could not decode slosh audio, using synthetic fallback:', err);
            this.isBufferLoading = false;
          }
        );
      }
    } catch (e) {
      console.warn('Error loading slosh sample:', e);
      this.isBufferLoading = false;
    }
  }

  public toggle(): boolean {
    this.init();
    this.enabled = !this.enabled;

    if (this.enabled) {
      this.startAmbient();
      this.ensureContinuousSloshLoop();
      this.feedScrollVelocity(25); // Initial splash on activate
    } else {
      this.stopAmbient();
      this.stopContinuousSloshLoop();
    }
    return this.enabled;
  }

  // Warm desert atmospheric drone
  private startAmbient() {
    if (!this.ctx || !this.enabled) return;
    try {
      if (this.ambientSource) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const masterGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(110, now);
      const osc2Gain = this.ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.2, now);
      osc2.connect(osc2Gain);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);

      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.04, now + 3);

      osc1.connect(filter);
      osc2Gain.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);

      this.ambientSource = filter;
      this.ambientGain = masterGain;
    } catch {
      // Audio policy
    }
  }

  private stopAmbient() {
    if (!this.ctx || !this.ambientGain) return;
    try {
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6);
      setTimeout(() => {
        if (this.ambientGain) {
          this.ambientGain.disconnect();
          this.ambientGain = null;
          this.ambientSource = null;
        }
      }, 600);
    } catch {
      // ignore
    }
  }

  // Setup persistent fluid audio node graph
  private ensureContinuousSloshLoop() {
    if (!this.ctx || !this.sloshBuffer || this.sloshSource) return;

    try {
      const source = this.ctx.createBufferSource();
      source.buffer = this.sloshBuffer;
      source.loop = true;

      // Bandpass shaping liquid wave
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 650;
      filter.Q.value = 2.2;

      // Aluminium can internal acoustic peaking resonance
      const canResonance = this.ctx.createBiquadFilter();
      canResonance.type = 'peaking';
      canResonance.frequency.value = 1600;
      canResonance.Q.value = 3.5;
      canResonance.gain.value = 5.0;

      const gain = this.ctx.createGain();
      gain.gain.value = 0.0001;

      source.connect(filter);
      filter.connect(canResonance);
      canResonance.connect(gain);
      gain.connect(this.ctx.destination);

      source.start(0);

      this.sloshSource = source;
      this.sloshFilter = filter;
      this.canResonanceFilter = canResonance;
      this.sloshGain = gain;
    } catch (err) {
      console.warn('Failed to start slosh audio graph:', err);
    }
  }

  private stopContinuousSloshLoop() {
    if (this.sloshGain && this.ctx) {
      this.sloshGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.2);
    }
    setTimeout(() => {
      if (this.sloshSource) {
        try {
          this.sloshSource.stop();
          this.sloshSource.disconnect();
        } catch {
          // ignore
        }
        this.sloshSource = null;
        this.sloshGain = null;
        this.sloshFilter = null;
        this.canResonanceFilter = null;
      }
    }, 400);
  }

  // Feed velocity from scroll or drag into fluid momentum physics
  public feedScrollVelocity(velocity: number) {
    if (!this.enabled) return;
    this.init();
    if (!this.sloshSource) {
      this.ensureContinuousSloshLoop();
    }

    // Accumulate momentum naturally based on speed
    const added = Math.min(Math.abs(velocity) / 14, 0.85);
    this.momentum = Math.min(this.momentum + added, 1.4);
  }

  // Physics animation loop: updates audio gain, filter sweep, and gradual fluid momentum decay
  private startPhysicsLoop() {
    if (this.animFrameId !== null) return;

    const tick = (nowMs: number) => {
      if (this.lastTime === 0) this.lastTime = nowMs;
      const dt = Math.min((nowMs - this.lastTime) / 1000, 0.1);
      this.lastTime = nowMs;

      if (this.ctx && this.enabled && this.sloshGain && this.sloshFilter) {
        const audioNow = this.ctx.currentTime;

        if (this.momentum > 0.005) {
          // Calculate realistic slosh volume and filter resonance
          const targetVol = Math.min(this.momentum * 0.42, 0.55);
          const targetFreq = 450 + this.momentum * 750; // Filter opens up when liquid splashes vigorously
          const targetPlaybackRate = 0.9 + Math.min(this.momentum * 0.22, 0.4);

          this.sloshGain.gain.setTargetAtTime(targetVol, audioNow, 0.08);
          this.sloshFilter.frequency.setTargetAtTime(targetFreq, audioNow, 0.1);
          if (this.sloshSource) {
            this.sloshSource.playbackRate.setTargetAtTime(targetPlaybackRate, audioNow, 0.12);
          }

          // Natural liquid inertia decay: takes 1.5 - 2.5 seconds to settle to rest
          const decayRate = 0.82; // Liquid keeps sloshing and rippling
          this.momentum *= Math.pow(decayRate, dt * 8);
        } else {
          this.sloshGain.gain.setTargetAtTime(0.0001, audioNow, 0.3);
          this.momentum = 0;
        }
      }

      this.animFrameId = requestAnimationFrame(tick);
    };

    this.animFrameId = requestAnimationFrame(tick);
  }

  // Direct trigger for one-off can clicks or drag releases
  public playLiquidSplash(intensity: number = 0.8) {
    this.feedScrollVelocity(intensity * 35);
  }

  // Soft subtle organic UI tap
  public playClick() {
    if (!this.ctx || !this.enabled) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.035);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // ignore
    }
  }

  // Soft hover touch
  public playHover() {
    if (!this.ctx || !this.enabled) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.02);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // ignore
    }
  }

  // Cinematic supersonic whoosh & sub-bass launch impact for preloader transition
  public playLaunchTransition() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // Sub-bass thump
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(150, now);
      subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.85);
      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.95);

      // Supersonic riser / atmospheric whoosh
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.9);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(220, now);
      filter.frequency.exponentialRampToValueAtTime(4200, now + 0.75);
      filter.Q.setValueAtTime(2.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.linearRampToValueAtTime(0.25, now + 0.5);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.88);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.9);
    } catch {
      // ignore
    }
  }
}

export const audio = new SoundEngine();
