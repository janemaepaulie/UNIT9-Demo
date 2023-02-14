import * as THREE from 'three';
import { Updatable } from "../../interfaces/updatable";

export interface Dependencies {
  mesh: THREE.Mesh,
  geometry: THREE.BufferGeometry,
  material: THREE.ShaderMaterial,
}

export abstract class Object extends THREE.Object3D implements Updatable {
  protected _mesh: THREE.Mesh | null;
  protected _geometry: THREE.BufferGeometry | null;
  protected _material: THREE.ShaderMaterial | null;

  constructor({ mesh, geometry, material }: Dependencies) {
    super();

    this._mesh = mesh;
    this._geometry = geometry;
    this._material = material;

    this.add(this._mesh);
  }

  public abstract update({ delta, time }): void;
  public destroy(): void {
    this._geometry?.dispose();
    this._material.dispose();

    if (this._mesh) {
      this.remove(this._mesh);
    }
  }
}