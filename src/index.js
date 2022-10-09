import * as THREE from "three";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import { gsap, Power4 } from "gsap";

class App {
  /**
   * レンダー
   */
  static get RENDERER_SETTING() {
    return {
      clearColor: 0x111111,
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
      y: 0.0,
      z: 40.0,
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
  }

  _setCamera() {
    this.camera = new THREE.PerspectiveCamera(App.CAMERA_PARAM.fovy, App.CAMERA_PARAM.aspect, App.CAMERA_PARAM.near, App.CAMERA_PARAM.far);
    this.camera.position.set(App.CAMERA_PARAM.x, App.CAMERA_PARAM.y, App.CAMERA_PARAM.z);
    this.camera.lookAt(App.CAMERA_PARAM.lookAt);
    this.camera.updateProjectionMatrix();
  }

  _setGeometory(geo) {
    const particleNumber = 50000; //パーティクルの数
    const material = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geo, material);
    const sampler = new MeshSurfaceSampler(mesh).build(); //メッシュ表面上にランダムに頂点を付与する
    const particles = new Float32Array(particleNumber * 3);

    for (let i = 0; i < particleNumber; i++) {
      const vertex = new THREE.Vector3();
      sampler.sample(vertex, new THREE.Vector3());
      const x = vertex.x;
      const y = vertex.y;
      const z = vertex.z;
      particles.set([x, y, z], i * 3);
    }
    return particles;
  }

  _setMesh() {
    const allPointsBox = this._setGeometory(new THREE.BoxGeometry(10, 10, 10)); //Boxジオメトリの頂点座標が入った変数
    const allPointsCube = this._setGeometory(new THREE.SphereGeometry(10, 32, 32)); //Sphereジオメトリの頂点座標が入った変数

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.BufferAttribute(allPointsBox, 3));
    this.geometry.setAttribute("two", new THREE.BufferAttribute(allPointsCube, 3));

    this.material = new THREE.RawShaderMaterial({
      vertexShader: document.querySelector("#vertex").textContent,
      fragmentShader: document.querySelector("#fragment").textContent,
      uniforms: {
        uPoint01: { value: 0.0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  _gsapAnimations() {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    tl.to(this.mesh.material.uniforms.uPoint01, {
      value: 4.0,
      ease: "Power4.easeOut",
      duration: 5,
    })
      .to(this.mesh.material.uniforms.uPoint01, {
        value: 1.0,
        ease: "Power4.easeOut",
        duration: 1,
      })
      .to(this.mesh.material.uniforms.uPoint01, {
        value: 0.0,
        ease: "Power4.easeOut",
        duration: 1,
      });
  }

  init() {
    this._setRenderer();
    this._setScene();
    this._setCamera();
    this._setMesh();
    this._gsapAnimations();
  }

  render() {
    requestAnimationFrame(this.render);
    this.mesh.rotation.x += 0.001;
    this.mesh.rotation.y += 0.001;

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
  app.render();
  window.addEventListener("resize", () => {
    app.onResize();
  });
});

export {};
