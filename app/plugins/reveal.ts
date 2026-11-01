import { createRevealDirective } from '~/directives/reveal'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', createRevealDirective())
  if (import.meta.client) document.documentElement.classList.add('reveal-ready')
})
