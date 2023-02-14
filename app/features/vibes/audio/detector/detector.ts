import { Essentia as EssentiaCore, EssentiaWASM } from 'essentia.js';
const Essentia = new EssentiaCore(EssentiaWASM.EssentiaWASM);

import { Settings } from './interfaces/settings';

const THRESHOLD_WINDOW = 10;
export const THRESHOLD_MULTIPLIER = 1.6; /* 1.3-1.6 are bestest */

export class BeatDetector {
  private _sensitivity: number;

  private _frameIndex: number;
  private _frameLength: number;
  private _previousFrame: Float32Array;

  private _fluxHistory: number[];
  private _threshold: number[];

	constructor({ sensitivity }: Settings, frameLength: number) {
    this._sensitivity = sensitivity || THRESHOLD_MULTIPLIER;

    this._frameIndex = 0;
    this._frameLength = frameLength;

    this._fluxHistory = [];
    this._threshold = [];
    this._previousFrame = new Float32Array(frameLength);
	}

  /**
   * Returns intensity of beat detected within frame (0.0 means no beat detected)
   * 
   * @param frame 
   * @returns {number} intensity of the beat
   */
	public frameHasBeat(frame: Float32Array): number {
    const frameVector = Essentia.arrayToVector(frame);
    const { frame: windowed } = Essentia.Windowing(frameVector, true, this._frameLength, 'hamming');
    const { spectrum } = Essentia.Spectrum(windowed, this._frameLength);

    let { flux } = Essentia.Flux(spectrum);
    if (flux < 0) { flux = 0; } /* rectify flux function */

    this._fluxHistory.push(flux);

    let end = Math.max(0, this._frameIndex - THRESHOLD_WINDOW);
    let mean = 0;
    for (let j = this._frameIndex; j >= end; j--) {
      mean += this._fluxHistory[j];
    }

    mean /= THRESHOLD_WINDOW;
    mean *= this._sensitivity;
    this._threshold.push(mean);
  
    this._frameIndex++;
    this._previousFrame.set(frame);

		return flux - mean;
	}

	public getBPMGuess() {
		/* not implemented */
	}
}
