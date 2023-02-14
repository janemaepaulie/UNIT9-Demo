import * as THREE from 'three';

import { AudioEngine } from './audio/engine';
import { GraphicsEngine } from './graphics/engine';

import { Scene } from './scenes/Scene';
import { MainScene } from './scenes/Main';
import { Playback } from './playback/playback';

export class Loop {
  private _rafId: number;
  private _clock: THREE.Clock;
  private _isRunning: boolean;

  private _scene: Scene;
  private _playback: Playback;

  private _graphics: GraphicsEngine;
  private _audio: AudioEngine;

  constructor(graphics: GraphicsEngine, audio: AudioEngine) {
    this._graphics = graphics;
    this._audio = audio;

    this._playback = new Playback(audio);
    this._clock = new THREE.Clock();
  }

  public async begin(rendererEl: HTMLDivElement, playbackEl: HTMLDivElement): Promise<void> {
    if (this._isRunning) {
      return;
    }

    await this._graphics.init(rendererEl);
    await this._audio.init(this._graphics.camera);

    this._playback.init(playbackEl);
    this._scene = new MainScene({
      camera: this._graphics.camera,
      controls: this._graphics.controls,
      gui: this._graphics.gui,
    }, this._audio).init();

    this._rafId = window.requestAnimationFrame((time) => this.tick(time));
    this._isRunning = true;
  }

  public end(): void {
    this._graphics.destroy();
    this._audio.destroy();

    if (this._scene) {
      this._scene.destroy();
    }

    if (this._rafId) {
      window.cancelAnimationFrame(this._rafId);
      this._isRunning = false;
    }
  }

  public tick(time: number): void {
    this._rafId = window.requestAnimationFrame((time) => this.tick(time));
    const delta = this._clock.getDelta();
 
    this._playback.update({ delta, time });
    this._scene.update({ delta, time });
    this._graphics.render(this._scene);
  }
}