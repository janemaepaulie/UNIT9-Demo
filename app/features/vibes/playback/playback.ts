import { AudioEngine } from '../audio/engine';
import { FREQUENCY_COMPONENTS } from '../constants';

import { Tick, Updatable } from '../interfaces/updatable';

export class Playback implements Updatable {
  private _audio: AudioEngine;
  private _playbackEl: HTMLDivElement;

  private _context: CanvasRenderingContext2D;

  constructor(audio: AudioEngine) {
    this._audio = audio;
  }

  public init(playbackEl: HTMLDivElement) {
    if (this._playbackEl === playbackEl) {
      return;
    }

    this._playbackEl = playbackEl;

    const { width, height } = this._playbackEl.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    this._context = canvas.getContext('2d');
    this._playbackEl.appendChild(canvas);
  }

  public update = ({ delta, time }: Tick): void => {
    const { width, height } = this._playbackEl.getBoundingClientRect();

    this._context.clearRect(0, 0, width, height);
    this._context.fillStyle = '#fff';

    let lineWidth = Math.floor((width / 9) * 0.5);
    let lineHeight = 8;

    if (this._audio.isPlaying) {
      const fourier = this._audio.mix.fourier;
      
      /* ~43Hz step assuming 44100 file */
      [
        fourier[1],
        fourier[4],
        fourier[6],
        fourier[8],
        fourier[10],
        fourier[16],
        fourier[18],
        fourier[30],
        fourier[38],
      ].forEach((amplitude, i) => {
        lineHeight = 8 + height * (amplitude / 255.0 / 1.6);
        this._context.fillRect(i * (lineWidth / 0.5), height, lineWidth, -lineHeight)
      });
    } else {
      for (let i = 0; i < 9; i++) {
        this._context.fillRect(i * (lineWidth / 0.5), height, lineWidth, -lineHeight)
      }
    }
  }
}