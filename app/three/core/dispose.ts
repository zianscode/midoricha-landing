import * as THREE from 'three'

export function disposeObject(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (mesh.geometry) mesh.geometry.dispose()
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined
    if (!material) return
    const list = Array.isArray(material) ? material : [material]
    for (const mat of list) {
      for (const value of Object.values(mat)) {
        if (value instanceof THREE.Texture) value.dispose()
      }
      const uniforms = (mat as THREE.ShaderMaterial).uniforms
      if (uniforms) {
        for (const u of Object.values(uniforms)) {
          if (u.value instanceof THREE.Texture) u.value.dispose()
        }
      }
      mat.dispose()
    }
  })
}
