export interface Tick {
  delta: number;
  time: number;
}

export interface Updatable {
  update({ delta, time }: Tick): void;
}