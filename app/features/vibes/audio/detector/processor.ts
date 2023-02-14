import { FREQUENCY_COMPONENTS } from '../../constants';
import { Settings } from './interfaces/settings';
import { BeatDetector, THRESHOLD_MULTIPLIER } from './detector';
import { beatEvent } from '../events/BeatEvent';

/* size of frame fed into the fft to extract spectrum */
const BUFFER_SIZE = FREQUENCY_COMPONENTS * 2;

class Processor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'sensitivity',
        defaultValue: THRESHOLD_MULTIPLIER,
        minValue: 0.0,
        maxValue: 3.0,
      },
    ];
  }

  private _buffer: Float32Array;
  private _bytesWritten: number = 0;
  
  private _detector: BeatDetector;

  constructor({ processorOptions }) {
    super();

    this._buffer = new Float32Array(BUFFER_SIZE);
    this._detector = new BeatDetector(processorOptions as Settings, BUFFER_SIZE);

    this.port.start();
  }

  public process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
    const inputBuffer = inputs[0][0];
    this.append(inputBuffer);

    if (this.isBufferFull()) {
      const intensity = this._detector.frameHasBeat(this._buffer);

      if (intensity > 0.0) {
        this.port.postMessage(beatEvent(intensity));
      }
    }
    
    return true;
  }

  public flush(): void {
    this._bytesWritten = 0;
  }

  private append(channelData: Float32Array) {
    if (this.isBufferFull()) {
      this.flush();
    }

    if (channelData) {
      channelData.forEach((data) => this._buffer[this._bytesWritten++] = data);
    }
  }

  private isBufferFull() {
    return this._bytesWritten === this._buffer.length;
  }

}

registerProcessor('beat-detector-processor', Processor);