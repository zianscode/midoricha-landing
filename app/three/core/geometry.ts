import * as THREE from 'three'

export function finishGeometry(geometry: THREE.BufferGeometry) {
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
  return geometry
}

export function orientAlong(
  object: THREE.Object3D,
  direction: THREE.Vector3,
  normalHint: THREE.Vector3
) {
  const y = direction.clone().normalize()
  const z = normalHint.clone().sub(y.clone().multiplyScalar(normalHint.dot(y)))
  if (z.lengthSq() < 1e-6) z.set(0, 0, 1)
  z.normalize()
  const x = new THREE.Vector3().crossVectors(y, z).normalize()
  const m = new THREE.Matrix4().makeBasis(x, y, z)
  object.quaternion.setFromRotationMatrix(m)
}
