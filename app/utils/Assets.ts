import * as THREE from 'three';
import { FBXLoader } from 'three-stdlib';
import { Scene } from '../features/vibes/scenes/Scene';

export enum AssetTypes {
  FBX = 'fbx',
  AUDIO = 'audio',
  TEXTURE = 'texture',
}

export interface Asset {
  type: AssetTypes;
  path: string;
  item?: THREE.Group | AudioBuffer | any;
}

export const SCENE_LOADED_EVENT = 'assets.sceneLoaded';

export function sceneLoadedEvent(sceneGuid: string) {
  return {
    type: SCENE_LOADED_EVENT,
    guid: sceneGuid
  }
}

export class Assets extends THREE.EventDispatcher {
  private static _instance: Assets;
  public static get instance(): Assets {
    if (!this._instance) {
      this._instance = new Assets();
    }

    return this._instance;
  }

  private _fbxLoader: FBXLoader;
  private _audioLoader: THREE.AudioLoader;
  private _textureLoader: THREE.TextureLoader;

  private _assetMap: Record<string, Asset[]>;

  constructor() {
    super();

    this._fbxLoader = new FBXLoader();
    this._audioLoader = new THREE.AudioLoader();
    this._textureLoader = new THREE.TextureLoader();

    this._assetMap = {};
  }

  public register(scene: Scene, asset: Asset) {
    if (!this._assetMap[scene.guid]) {
      this._assetMap[scene.guid] = [];
    }

    this._assetMap[scene.guid].push(asset);
  }

  public async preload(scene: Scene): Promise<Asset[]> {
    const assets = this._assetMap[scene.guid];
    const promises = assets.map(async (asset) => {

      switch(asset.type) {
        case AssetTypes.FBX: {
          const group = await this._fbxLoader.loadAsync(asset.path);
          return asset.item = group;
        }
        
        case AssetTypes.AUDIO: {
          const audio = await this._audioLoader.loadAsync(asset.path);
          return asset.item = audio;
        }

        case AssetTypes.TEXTURE: {
          const texture = await this._textureLoader.loadAsync(asset.path);
          return asset.item = texture;
        }

        default: break;
      }
    });

    await Promise.all(promises);

    this.dispatchEvent(sceneLoadedEvent(scene.guid));
    return assets;
  }
}