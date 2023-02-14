import { Settings } from "./interfaces/settings";

export function makeBeatDetectorNode(settings: Settings, context: AudioContext) {
  return new AudioWorkletNode(context, 'beat-detector-processor', {
    processorOptions: {
      ...settings
    }
  });
}