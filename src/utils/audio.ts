'use client';

class AlbumAudioManager {
  private bgAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private audioUrl: string = '';

  /**
   * Page flip sound effects disabled per user requirements
   */
  public playPageFlipSound(_type: 'turn' | 'cover' = 'turn') {
    // Disabled - completely silent page transitions
  }

  /**
   * Initializes background music with looping enabled
   */
  public initBackgroundMusic(url: string) {
    if (typeof window === 'undefined') return;
    if (!url) return;

    if (this.bgAudio && this.audioUrl === url) return;

    if (this.bgAudio) {
      try {
        this.bgAudio.pause();
      } catch {}
      this.bgAudio = null;
    }

    this.audioUrl = url;
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = 'auto';

    // Seamless loop guarantee on older browsers or mobile
    audio.addEventListener('ended', () => {
      if (this.bgAudio && this.isMusicPlaying) {
        this.bgAudio.currentTime = 0;
        this.bgAudio.play().catch(() => {});
      }
    });

    this.bgAudio = audio;
  }

  /**
   * Plays the background music (handles browser autoplay policies safely)
   */
  public async playMusic(): Promise<boolean> {
    if (!this.bgAudio) return false;
    try {
      this.bgAudio.muted = this.isMuted;
      await this.bgAudio.play();
      this.isMusicPlaying = true;
      return true;
    } catch {
      this.isMusicPlaying = false;
      return false;
    }
  }

  /**
   * Pauses the background music
   */
  public pauseMusic() {
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
    this.isMusicPlaying = false;
  }

  /**
   * Toggles music on / off
   */
  public toggleMusic(): boolean {
    if (!this.bgAudio) return false;
    if (this.isMusicPlaying) {
      this.pauseMusic();
      return false;
    } else {
      this.playMusic();
      return true;
    }
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
