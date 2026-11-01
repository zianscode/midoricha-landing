import * as THREE from 'three'

const noise = `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
`

export function createSteam({
  width = 1.2,
  height = 2.4,
  opacity = 0.28,
  color = '#f6f3ea',
  seed = 0
} = {}) {
  const geometry = new THREE.PlaneGeometry(width, height)
  geometry.translate(0, height / 2, 0)
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uSeed: { value: seed },
      uColor: { value: new THREE.Color(color) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uOpacity;
      uniform float uSeed;
      uniform vec3 uColor;
      varying vec2 vUv;
      ${noise}
      void main() {
        vec2 uv = vUv;
        float t = uTime * 0.07 + uSeed;
        float sway = (fbm(vec2(uv.y * 1.6 - t * 1.4, t + uSeed)) - 0.5) * 0.55 * uv.y;
        float cx = 0.5 + sway;
        vec2 q = vec2((uv.x - cx) * 3.0, uv.y * 2.2 - t * 2.6);
        q.x += fbm(q * 1.3 + t) * 0.8;
        float n = fbm(q * 1.4);
        float wisps = smoothstep(0.42, 0.82, n);
        float spread = 0.08 + 0.22 * uv.y;
        float horiz = exp(-pow((uv.x - cx) / spread, 2.0));
        float vert = smoothstep(0.0, 0.18, uv.y) * (1.0 - smoothstep(0.45, 1.0, uv.y));
        gl_FragColor = vec4(uColor, wisps * horiz * vert * uOpacity);
        #include <colorspace_fragment>
      }
    `
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.renderOrder = 10
  return {
    mesh,
    material,
    update(time: number, camera: THREE.Camera) {
      material.uniforms.uTime!.value = time
      const target = new THREE.Vector3()
      camera.getWorldPosition(target)
      mesh.parent?.worldToLocal(target)
      mesh.rotation.y = Math.atan2(target.x - mesh.position.x, target.z - mesh.position.z)
    }
  }
}
