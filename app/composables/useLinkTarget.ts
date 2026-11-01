export function useLinkTarget(href: () => string | undefined) {
  const NuxtLink = resolveComponent('NuxtLink')

  const isRoute = computed(() => href()?.startsWith('/') ?? false)

  const tag = computed(() => {
    if (!href()) return 'button'
    return isRoute.value ? NuxtLink : 'a'
  })

  const attributes = computed(() => {
    const target = href()
    if (!target) return { type: 'button' }
    return isRoute.value ? { to: target } : { href: target }
  })

  return { tag, attributes }
}
