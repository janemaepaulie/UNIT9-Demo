import * as THREE from 'three';
import { Worklet } from './worklet';

import { MixAnalyzer } from './analyzer';
import { playingEvent } from './events/PlayingEvent';

// const ESSENTIA_DEPENDENCIES = {
//   wasm: 'https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.web.js',
//   core: 'https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.js',
// };

export class AudioEngine extends THREE.EventDispatcher {
  private _audioContext: AudioContext;
  private _audioListener: THREE.AudioListener;

  private _track: THREE.Audio; 
  get isPlaying(): boolean {
    if (!this._track) {
      return false;
    }

    return this._track.isPlaying;
  }

  private _mixAnalyzer: MixAnalyzer;
  get mix(): MixAnalyzer {
    return this._mixAnalyzer;
  }

  constructor() {
    super();
  }

  public async init(camera: THREE.Camera): Promise<void> {
    this._audioListener = new THREE.AudioListener();
    this._audioContext = THREE.AudioContext.getContext();

    /* this may be necessary for older browsers to avoid `import`s and webpack related errors */
    // /* load essentia.js based on their examples */
    // const essentiaUrl = await Promise.all([
    //   fetch(ESSENTIA_DEPENDENCIES.wasm),
    //   fetch(ESSENTIA_DEPENDENCIES.core)
    // ]).then(async responses => {
    //   const wasm = await responses[0].text();
    //   const core = await responses[1].text();

    //   /* hack to make injected umd modules work */
    //   const text = [wasm, core].join('');
    //   const blob = new Blob([text], { type: 'application/javascript' });

    //   return URL.createObjectURL(blob);
    // });
    // await this._audioContext.audioWorklet.addModule(essentiaUrl);

    const workerUrl = new (Worklet as any)(new URL('./detector/processor.ts', import.meta.url));
    await this._audioContext.audioWorklet.addModule(workerUrl);

    this._mixAnalyzer = new MixAnalyzer(this._audioContext);
    camera.add(this._audioListener);
  }

  public queueFromBuffer(buffer: AudioBuffer) {
    const source = this._audioContext.createBufferSource();
    source.buffer = buffer;

    this._track = new THREE.Audio(this._audioListener);
    this._track.setBuffer(buffer);

    this._mixAnalyzer.attachAnalyzer(this._track);
  }

  public play() {
    this._track.play();
    this.dispatchEvent(playingEvent(true));
  }

  public pause() {
    this._track.pause();
    this.dispatchEvent(playingEvent(false));
  }

  public destroy(): void {

  }
}
