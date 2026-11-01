import * as THREE from 'three'
import { makeRng } from '~/three/core/random'

export function createParticles({
  count = 200,
  box = new THREE.Vector3(3, 2, 2),
  color = '#6f8f58',
  size = 26,
  opacity = 0.55,
  speed = 1,
  seed = 31
} = {}) {
  const rand = makeRng(seed)
  const positions = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (rand() - 0.5) * box.x
    positions[i * 3 + 1] = (rand() - 0.5) * box.y
    positions[i * 3 + 2] = (rand() - 0.5) * box.z
    seeds[i] = rand()
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: size * Math.min(window.devicePixelRatio, 1.75) },
      uHeight: { value: box.y },
      uSpeed: { value: speed },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uSize;
      uniform float uHeight;
      uniform float uSpeed;
      attribute float aSeed;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        float t = uTime * uSpeed;
        p.y = mod(p.y + uHeight * 0.5 + t * (0.025 + aSeed * 0.04), uHeight) - uHeight * 0.5;
        p.x += sin(t * 0.21 + aSeed * 40.0) * 0.08;
        p.z += cos(t * 0.17 + aSeed * 23.0) * 0.06;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * (0.35 + aSeed * 0.9) / -mv.z;
        float edge = 1.0 - smoothstep(0.32, 0.5, abs(p.y / uHeight));
        vAlpha = edge * (0.3 + 0.7 * fract(aSeed * 17.31));
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.1, d);
        gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
        #include <colorspace_fragment>
      }
    `
  })

  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  return {
    points,
    material,
    update(time: number) {
      material.uniforms.uTime!.value = time
    }
  }
}
