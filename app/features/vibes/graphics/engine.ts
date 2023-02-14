import * as THREE from "three";
import GUI from 'lil-gui';
import debounce from 'lodash.debounce';

import { OrbitControls } from 'three-stdlib';
import { EffectComposer, RenderPass, UnrealBloomPass, Pass } from 'three-stdlib';

import { Scene } from '../scenes/Scene';

const CAMERA_FOV = 60;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;

const EFFECT_PARAMS = {
  exposure: 0.8,
  bloom: {
    strength: 0.34,
    radius: 0.68,
    threshold: 0.361
  }
};

export class GraphicsEngine {
  private _rendererEl: HTMLDivElement;
  private _canvas: HTMLCanvasElement;

  private _renderer: THREE.WebGLRenderer;
  private _scene: Scene;

  private _post: EffectComposer;
  private _effects: Pass[]; 

  private _camera: THREE.PerspectiveCamera;
  private _controls: OrbitControls;
  private _gui: GUI;

  get camera(): THREE.PerspectiveCamera {
    return this._camera;
  }

  get controls(): OrbitControls {
    return this._controls;
  }

  get gui(): GUI {
    return this._gui;
  }

  constructor() {
    this._effects = [];
  }

  public async init(rendererEl: HTMLDivElement): Promise<void> {
    this._canvas = document.createElement("canvas");
    this._rendererEl = rendererEl;
    this._rendererEl.appendChild(this._canvas);

    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
      alpha: true,
    });

    this._renderer.localClippingEnabled = true;

    this._camera = new THREE.PerspectiveCamera();
    this._camera.fov = CAMERA_FOV;
    this._camera.near = CAMERA_NEAR;
    this._camera.far = CAMERA_FAR;

    // this._controls = new OrbitControls(this._camera, this._rendererEl);
    // this._controls.enableDamping = true;
    // this._controls.update();

    this._gui = new GUI();
    this._gui.title('Controls');

    this._initPostProcessing();
    this._addListeners();
    this._handleResize();
  }

  public render(scene: Scene): void {
    if (this._scene !== scene) {
      this._scene = scene;

      this._post.passes = [];
      this._post.addPass(new RenderPass(scene, this._camera));
      this._effects.forEach((pass) => this._post.addPass(pass));
    }

    // this._renderer.render(scene, this._camera);
    this._post.render();
  }

  public destroy(): void {
    if (this._canvas.parentNode) {
      this._canvas.parentNode.removeChild(this._canvas);
    }

    this._removeListeners();
  }
  
  private _initPostProcessing(): void {
    this._renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this._renderer.toneMappingExposure = EFFECT_PARAMS.exposure;
    this._gui.add(this._renderer, "toneMappingExposure", 0, 1.0, 0.01).name('exposure');

    this._post = new EffectComposer(this._renderer);

    const { width, height } = this._rendererEl.getBoundingClientRect();
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      EFFECT_PARAMS.bloom.strength,
      EFFECT_PARAMS.bloom.radius,
      EFFECT_PARAMS.bloom.threshold
    );

    this._gui.add(bloom, "strength", 0, 1.0, 0.01).name('bloom strength');
    this._gui.add(bloom, "radius", 0, 1.0, 0.01).name('bloom radius');
    this._gui.add(bloom, "threshold", 0, 1.0, 0.001).name('bloom threshold');

    this._effects.push(bloom);
  }

  private _addListeners(): void {
    window.addEventListener('resize', this._handleResizeDebounced);
  }

  private _removeListeners(): void {
    window.removeEventListener('resize', this._handleResizeDebounced);
  }

  private _handleResize(): void {
    const { width, height } = this._rendererEl.getBoundingClientRect();
    const aspectRatio = width / height;

    this._camera.aspect = aspectRatio;

    this._renderer.setSize(width, height);
    this._post.setSize(width, height);

    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._post.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this._camera.updateProjectionMatrix();
  }

  private _handleResizeDebounced = debounce(() => this._handleResize(), 300)
}
