export const PLAYING_EVENT = 'audio.playing';

export function playingEvent(isPlaying: boolean) {
  return {
    type: PLAYING_EVENT,
    playing: isPlaying
  };
}