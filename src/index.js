//https://nogson2.hatenablog.com/entry/2017/12/24/193017

import * as THREE from "three";
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
      far: 200.0,
      x: 0.0,
      y: 0.0,
      z: 8.0,
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

  _setLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    this.directionalLight.position.y = 100;
    this.directionalLight.position.z = 80;
    this.scene.add(this.ambientLight);
    this.scene.add(this.directionalLight);
  }

  _setMesh() {
    this.geometory = new THREE.PlaneGeometry(0.8, 10, 50, 80);
    // this.geometory = new THREE.BoxGeometry(1, 10, 10, 10, 10, 10);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uVertexTime: { value: 0.1 },
      },
      vertexShader: `
      varying vec2 vUv;
      uniform float uVertexTime;
      vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      
      vec2 mod289(vec2 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      
      vec3 permute(vec3 x) {
        return mod289(((x*34.0)+10.0)*x);
      }
      
      float snoise(vec2 v)
        {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                           -0.577350269189626,  // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0
      // First corner
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
      
      // Other corners
        vec2 i1;
        //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
        //i1.y = 1.0 - i1.x;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        // x0 = x0 - 0.0 + 0.0 * C.xx ;
        // x1 = x0 - i1 + 1.0 * C.xx ;
        // x2 = x0 - 1.0 + 2.0 * C.xx ;
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
      
      // Permutations
        i = mod289(i); // Avoid truncation effects in permutation
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));
      
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
      
      // Gradients: 41 points uniformly over a line, mapped onto a diamond.
      // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
      
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 1.0;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
      
      // Normalise gradients implicitly by scaling m
      // Approximation of: m *= inversesqrt( a0*a0 + h*h );
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      
      // Compute final noise value at P
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 200.0 * dot(m, g);
      }
        void main() {
          vUv = uv;
          vec3 pos = position;

       
          pos.x = snoise(pos.xy) * uVertexTime * 1.0;
          pos.y = snoise(normalize(pos.xy)) * uVertexTime * 1.0;
          


          gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
        }
      `,
      fragmentShader: `
      precision mediump float;
      uniform float uTime;

      vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      
      vec2 mod289(vec2 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      
      vec3 permute(vec3 x) {
        return mod289(((x*34.0)+10.0)*x);
      }
      
      float snoise(vec2 v)
        {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                           -0.577350269189626,  // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0
      // First corner
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
      
      // Other corners
        vec2 i1;
        //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
        //i1.y = 1.0 - i1.x;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        // x0 = x0 - 0.0 + 0.0 * C.xx ;
        // x1 = x0 - i1 + 1.0 * C.xx ;
        // x2 = x0 - 1.0 + 2.0 * C.xx ;
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
      
      // Permutations
        i = mod289(i); // Avoid truncation effects in permutation
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));
      
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
      
      // Gradients: 41 points uniformly over a line, mapped onto a diamond.
      // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
      
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
      
      // Normalise gradients implicitly by scaling m
      // Approximation of: m *= inversesqrt( a0*a0 + h*h );
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      
      // Compute final noise value at P
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 80.0 * dot(m, g);
      }

      
      varying vec2 vUv;
  void main() {
       float offset = snoise(vUv + uTime);
  gl_FragColor = vec4(vec3(offset), 1.0);
    }
      `,
    });
    this.mesh = new THREE.Mesh(this.geometory, this.material);

    this.scene.add(this.mesh);
  }

  init() {
    this._setRenderer();
    this._setScene();
    this._setCamera();
    this._setMesh();
    this._setLight();

    gsap.to(this.mesh.material.uniforms.uVertexTime, {
      value: 1.2,
      ease: "Power4.easeOut",
      repeat: -1,
      yoyo: true,
      duration: 3,
    });
  }
  render() {
    requestAnimationFrame(this.render);
    this.mesh.material.uniforms.uTime.value += 0.004;
    // this.mesh.material.uniforms.uVertexTime.value += 0.02;

    // this.mesh.rotation.x += 0.001;
    // this.mesh.rotation.y += 0.001;

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
  app.render();
});

export {};
