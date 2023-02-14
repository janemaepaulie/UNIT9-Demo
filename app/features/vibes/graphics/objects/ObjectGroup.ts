import * as THREE from 'three';
import { Updatable } from "../../interfaces/updatable";

export interface Dependencies {
  group: THREE.Group,
  material: THREE.ShaderMaterial,
}

export abstract class ObjectGroup extends THREE.Group implements Updatable {
  protected _group: THREE.Object3D | null;
  protected _geometry: THREE.BufferGeometry | null;
  protected _material: THREE.ShaderMaterial | null;

  constructor({ group, material }: Dependencies) {
    super();

    this._group = group;
    this._material = material;

    this.add(this._group);
  }

  public abstract update({ delta, time }): void;
  public destroy(): void {
    this._material.dispose();

    if (this._group) {
      this.remove(this._group);
    }
  }
}