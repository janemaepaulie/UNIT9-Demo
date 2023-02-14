import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { v4 as uuid } from 'uuid';
import GUI from 'lil-gui';

import { Updatable } from '../interfaces/updatable';
import { Object } from '../graphics/objects/Object';
import { ObjectGroup } from '../graphics/objects/ObjectGroup';

export interface Dependencies {
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  gui: GUI;
}

export abstract class Scene extends THREE.Scene implements Updatable {
  protected _camera: THREE.PerspectiveCamera;
  protected _controls: OrbitControls;
  protected _gui: GUI;

  protected _objects: Object[];

  private _guid: string;
  public get guid(): string {
    return this._guid;
  }

  constructor({ camera, controls, gui  }: Dependencies) {
    super();

    this._camera = camera;
    this._controls = controls;
    this._gui = gui;

    this._guid = uuid();
  }

  public update({ delta, time }): void {
    for (const object of this.children) {
      if (object instanceof Object || object instanceof ObjectGroup) {
        object.update({ delta, time });
      }
    }
  }

  public destroy(): void {
    for (const object of this.children) {
      if (object instanceof Object || object instanceof ObjectGroup) {
        object.destroy();
      }
    }
  }

  public abstract init(): Scene;
}