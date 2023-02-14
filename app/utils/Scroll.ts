import { EventDispatcher } from 'three';
import normalizeWheel from 'normalize-wheel';

export const MOVE_EVENT = 'scroll.move';

export function moveEvent(deltaY: number, origin: 'wheel' | 'touch') {
  return {
    type: MOVE_EVENT,
    deltaY,
    origin
  };
}

export class Scroll extends EventDispatcher {
  private static _instance: Scroll;
  public static get instance(): Scroll {
    if (!Scroll._instance) {
      Scroll._instance = new Scroll();
    }

    return Scroll._instance;
  }

  private _touch: { x: number, y: number };

  constructor() {
    super();

    this._touch = { x: 0, y: 0 };

    window.addEventListener('wheel', (event) => {
      const { pixelY } = normalizeWheel(event);
      this.dispatchEvent(moveEvent(-pixelY, 'wheel'));
    }, { passive: false });

    window.addEventListener('touchstart', ({ touches }) => {
      const x = touches[0].pageX;
      const y = touches[0].pageY;

      this._touch = { x, y };
    });

    window.addEventListener('touchmove', ({ touches }) => {
      const x = touches[0].pageX;
      const y = touches[0].pageY;

      console.log(touches[0]);

      const deltaY = this._touch.y - y;
      this.dispatchEvent(moveEvent(-deltaY, 'touch'));

      this._touch = { x, y };
    });
  }
}
