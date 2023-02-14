import * as THREE from 'three';
import gsap from 'gsap';

import { Scene, Dependencies } from './Scene';
import { AudioEngine } from '../audio/engine';
import { Scroll, MOVE_EVENT } from '../../../utils/Scroll';
import { Assets, AssetTypes } from '../../../utils/Assets';

import { Joi } from '../graphics/objects/Joi/Joi';
import { Fireflies } from '../graphics/objects/Fireflies/Fireflies';

import joiModel from '../graphics/objects/Joi/models/joi.fbx';
import particleImage from '../graphics/objects/Fireflies/images/particle.png';
import track from '../audio/tracks/track.mp3';

const JOI_POSITION = new THREE.Vector3(-40, 10, 0);
const CAMERA_POSITION = new THREE.Vector3(0, 160, 90);
const CAMERA_LIMIT = new THREE.Vector3(0, 46, 90);
const CAMERA_TARGET = new THREE.Vector3(0, 160, 0);

const CAMERA_WEIGHT = 1.4;
const WHEEL_EASE = 60;
const TOUCH_EASE = 10;

export class MainScene extends Scene {
  private _audio: AudioEngine;
  private _joi: Joi;

  private _previousFollowPosition: THREE.Vector3;

  constructor({ camera, controls, gui }: Dependencies, audio: AudioEngine) {
    super({ camera, controls, gui });
    this._audio = audio;

    Assets.instance.register(this, { type: AssetTypes.FBX, path: joiModel });
    Assets.instance.register(this, { type: AssetTypes.AUDIO, path: track });
    Assets.instance.register(this, { type: AssetTypes.TEXTURE, path: particleImage.src });
  }

  public init(): this {
    this.background = new THREE.Color('#200721');

    this._camera.position.copy(CAMERA_POSITION);
    this._camera.lookAt(CAMERA_TARGET);

    const light = new THREE.PointLight(new THREE.Color('#d4629d'))
    light.position.set(10, 100, 10);
    this.add(light)

    Assets.instance.preload(this).then((assets) => {
      this._audio.queueFromBuffer(assets[1].item);

      const joi = new Joi(assets[0].item, JOI_POSITION, this._audio);
      const fireflies = new Fireflies(assets[2].item, this._audio);

      this.add(joi);
      this.add(fireflies);

      this._previousFollowPosition = joi.followPosition;
      this._joi = joi;
    });

    Scroll.instance.addEventListener(MOVE_EVENT, ({ deltaY, origin }) => {
      if (!this._joi) {
        return;
      }

      const ease = origin === 'touch' ? TOUCH_EASE : WHEEL_EASE;
      this._camera.position.y += deltaY / (CAMERA_WEIGHT * ease);
      this._camera.position.y = gsap.utils.clamp(CAMERA_LIMIT.y, CAMERA_POSITION.y, this._camera.position.y);

      const traveled = CAMERA_POSITION.y - this._camera.position.y;
      this._joi.rotation.y = traveled / 100.0;
    })

    return this;
  }

  public update({ delta, time }: { delta: any; time: any; }): void {
    super.update({ delta, time });

    if (this._joi) {
      const newFollowPosition = this._joi.followPosition;
      const followVelocity = newFollowPosition.clone().sub(this._previousFollowPosition);

      this._camera.position.add(followVelocity.divideScalar(CAMERA_WEIGHT));
      this._previousFollowPosition.copy(newFollowPosition);
    }
  }
}
