export const BEAT_EVENT = 'audio.beat';

export function beatEvent(intensity: number) {
  return {
    type: BEAT_EVENT,
    intensity
  };
}