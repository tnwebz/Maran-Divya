'use client';

class AlbumAudioManager {
  private audioCtx: AudioContext | null = null;
  private bgAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Generates a realistic physical paper flip sound using Web Audio API synthesis
   * Models the friction, whoosh, and gentle landing flap of a thick luxury photo paper
   */
  public playPageFlipSound(type: 'turn' | 'cover' = 'turn') {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const duration = type === 'cover' ? 0.85 : 0.6;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate brown/pink noise profile for textured paper friction
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Low-pass filtered noise gives organic paper friction texture
        lastOut = (lastOut + 0.04 * white) / 1.04;
        data[i] = lastOut * 3.5;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Filter to shape the frequency (paper swoosh and low-end page weight)
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(type === 'cover' ? 450 : 750, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(
        type === 'cover' ? 180 : 350,
        ctx.currentTime + duration
      );
      filter.Q.setValueAtTime(type === 'cover' ? 1.2 : 0.9, ctx.currentTime);

      // Gain envelope with initial gentle drag, peak whoosh, and soft settling flap
      const gainNode = ctx.createGain();
      const now = ctx.currentTime;
      gainNode.gain.setValueAtTime(0.0001, now);
      // Lift
      gainNode.gain.exponentialRampToValueAtTime(0.35, now + 0.08);
      // Whoosh over spine
      gainNode.gain.exponentialRampToValueAtTime(0.48, now + 0.25);
      // Settling
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + duration);
    } catch {
      // Ignore audio synthesis errors on autoplay restrictions
    }
  }

  public initBackgroundMusic(url: string) {
    if (typeof window === 'undefined') return;
    if (!this.bgAudio && url) {
      this.bgAudio = new Audio(url);
      this.bgAudio.loop = true;
      this.bgAudio.volume = 0.25;
    }
  }

  public toggleMusic(): boolean {
    if (!this.bgAudio) return false;
    if (this.isMusicPlaying) {
      this.bgAudio.pause();
      this.isMusicPlaying = false;
    } else {
      this.bgAudio.play().then(() => {
        this.isMusicPlaying = true;
      }).catch(() => {
        this.isMusicPlaying = false;
      });
    }
    return this.isMusicPlaying;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgAudio) {
      this.bgAudio.muted = this.isMuted;
    }
    return this.isMuted;
  }

  public isMutedState(): boolean {
    return this.isMuted;
  }

  public isPlayingState(): boolean {
    return this.isMusicPlaying;
  }
}

export const albumAudio = new AlbumAudioManager();
