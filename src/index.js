import * as THREE from "three";

class App {
  /**
   * レンダー
   */
  static get RENDERER_SETTING() {
    return {
      clearColor: 0x000000,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  /**
   * マテリアル
   */
  static get MATERIAL_SETTING() {
    return {
      color: 0xffffff,
    };
  }
  /**
   * カメラ
   */
  static get CAMERA_PARAM() {
    return {
      fovy: 60,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 20000.0,
      x: 0.0,
      y: 2.0,
      z: 30.0,
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    };
  }

  /**
   * @constructor
   */
  constructor() {
    this.renderer;
    this.scene;
    this.camera;
    this.geometory;
    this.material;
    this.mesh;
    this.array = [];
    this.group;

    this.ambientLight;
    this.directionalLight;

    this.loader;
    this.texture;

    this.raycaster;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.render = this.render.bind(this);
  }

  _setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(new THREE.Color(App.RENDERER_SETTING.clearColor));
    this.renderer.setSize(App.RENDERER_SETTING.width, App.RENDERER_SETTING.height);
    const canvas = document.querySelector("#webgl");
    canvas.appendChild(this.renderer.domElement);
  }

  _setScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 20, 40);
  }

  _setCamera() {
    this.camera = new THREE.PerspectiveCamera(App.CAMERA_PARAM.fovy, App.CAMERA_PARAM.aspect, App.CAMERA_PARAM.near, App.CAMERA_PARAM.far);
    this.camera.position.set(App.CAMERA_PARAM.x, App.CAMERA_PARAM.y, App.CAMERA_PARAM.z);
    this.camera.lookAt(App.CAMERA_PARAM.lookAt);
    this.camera.updateProjectionMatrix();
  }

  _setLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    this.directionalLight.position.y = 100;
    this.directionalLight.position.z = 80;
    this.scene.add(this.ambientLight);
    this.scene.add(this.directionalLight);
  }

  _setMesh() {
    const boxNumber = 12;
    const center = 2;
    this.group = new THREE.Group();

    this.geometory = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    this.material = new THREE.MeshToonMaterial({ color: 0xffffff });
    for (let i = 0; i < boxNumber; i++) {
      for (let j = 0; j < boxNumber; j++) {
        for (let k = 0; k < boxNumber; k++) {
          this.mesh = new THREE.Mesh(this.geometory, this.material);
          this.mesh.position.x = Math.cos(i) * 2;
          this.mesh.position.y = Math.sin(j) * 2;
          this.mesh.position.z = Math.sin(k) * 2;

          this.array.push(this.mesh);
          this.group.add(this.mesh);
        }
      }
    }

    this.scene.add(this.group);
  }

  init() {
    this._setRenderer();
    this._setScene();
    this._setCamera();
    this._setMesh();
    this._setLight();
  }
  render() {
    requestAnimationFrame(this.render);
    this.group.rotation.x += 0.01;
    this.group.rotation.y += 0.01;

    const time = new Date().getTime() / 1000;

    this.array.forEach((box, index) => {
      if (index % 3) {
        box.position.x += Math.sin(time - index) / 10;
        box.position.y += Math.cos(time - index) / 10;
        box.position.z += Math.cos(time - index) / 10;

        box.scale.x += -Math.sin(time - index) / 100;
        box.scale.y += -Math.cos(time - index) / 100;
      }
    });
    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
  app.render();
});

export {};
