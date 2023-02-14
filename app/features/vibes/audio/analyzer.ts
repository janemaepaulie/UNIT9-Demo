import * as THREE from 'three';

import { FREQUENCY_COMPONENTS } from '../constants';
import { makeBeatDetectorNode } from './detector/make-node';

export class MixAnalyzer extends THREE.EventDispatcher {
  private _audioContext: AudioContext;

  private _analyzerNode: AnalyserNode;
  // private _beatDetector: BeatDetector;
  private _beatDetectorNode: AudioWorkletNode;

  get fourier(): Uint8Array {
    const frequencies = new Uint8Array(FREQUENCY_COMPONENTS);
    this._analyzerNode.getByteFrequencyData(frequencies);

    return frequencies;
  }

  get bpm(): number {
    /* not implemented */
    return 119;
  }

  constructor(context: AudioContext) {
    super();

    this._audioContext = context;
    this._analyzerNode = null;
  }

  public attachAnalyzer(node: THREE.Audio): void {
    const analyzer = this._audioContext.createAnalyser();
    const beatDetector = makeBeatDetectorNode({}, this._audioContext);

    analyzer.fftSize = FREQUENCY_COMPONENTS * 2
    analyzer.smoothingTimeConstant = 0.6;

    node.getOutput().connect(analyzer);
    node.getOutput().connect(beatDetector);

    this._analyzerNode = analyzer;
    this._beatDetectorNode = beatDetector;
    // this._beatDetectorNode.parameters.sensitivity = 1.8;
    this._beatDetectorNode.port.onmessage = ({ data: event }) => {
      this.dispatchEvent(event);
    }
  }
}
