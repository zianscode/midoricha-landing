<script setup lang="ts">
import { anchor, brewLink, navigationSections } from '~/content/site'
import type { SectionId } from '~/types/content'

const island = ref<HTMLElement | null>(null)
const sectionIds = navigationSections.map((section) => section.id)

const activeIndex = useActiveSection(sectionIds)
const progress = usePageProgress()
const { open, close, toggle, onPointerEnter, onPointerLeave } = useHoverMenu(island)
const { scrollToTarget } = useSmoothScroll()

const currentSection = computed(() => navigationSections[activeIndex.value] ?? navigationSections[0]!)

function goTo(id: SectionId) {
  close()
  scrollToTarget(anchor(id))
}
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center px-5 pt-6 text-white mix-blend-difference md:px-8 md:pt-7">
    <a :href="anchor('top')" class="pointer-events-auto" aria-label="Midoricha home" @click.prevent="goTo('top')">
      <BrandMark collapsible />
    </a>
  </div>

  <div
    ref="island"
    class="fixed left-1/2 top-4 z-50 -translate-x-1/2 md:top-5"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <nav
      aria-label="Primary"
      class="overflow-hidden bg-forest text-white shadow-[0_18px_40px_-18px_rgba(11,26,19,0.6)] ring-1 ring-white/10 transition-[width,border-radius] duration-500 ease-calm"
      :class="open ? 'w-[min(calc(100vw-24px),34rem)] rounded-[28px]' : 'w-50 rounded-[26px] md:w-60'"
    >
      <button
        type="button"
        class="flex h-13 w-full items-center gap-3 pl-2 pr-4 text-left"
        :aria-expanded="open"
        aria-controls="island-panel"
        @click="toggle"
      >
        <NavbarProgressRing :progress="progress" />

        <span class="relative h-5 flex-1 overflow-hidden">
          <Transition
            enter-active-class="transition duration-500 ease-calm"
            leave-active-class="transition duration-300 ease-calm absolute inset-0"
            enter-from-class="translate-y-full opacity-0"
            leave-to-class="-translate-y-full opacity-0"
          >
            <span :key="currentSection.id" class="block truncate text-[14px] font-medium tracking-[-0.01em]">
              {{ currentSection.label }}
            </span>
          </Transition>
        </span>

        <svg
          class="h-3.5 w-3.5 shrink-0 text-white/60 transition-transform duration-500 ease-calm"
          :class="{ 'rotate-180': open }"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
        <span class="sr-only">{{ open ? 'Close navigation' : 'Open navigation' }}</span>
      </button>

      <div
        id="island-panel"
        class="grid transition-[grid-template-rows] duration-500 ease-calm"
        :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
        :inert="!open"
      >
        <div class="overflow-hidden">
          <ul class="grid grid-cols-3 gap-1.5 px-2 pb-2">
            <li v-for="(section, index) in navigationSections" :key="section.id">
              <a
                :href="anchor(section.id)"
                class="flex h-14 items-center rounded-[18px] px-4 transition-colors duration-300"
                :class="activeIndex === index ? 'bg-leaf text-forest' : 'bg-white/6 text-white/80 hover:bg-white/12 hover:text-white'"
                :aria-current="activeIndex === index ? 'location' : undefined"
                @click.prevent="goTo(section.id)"
              >
                <span class="text-[13px] font-medium leading-tight tracking-[-0.01em] md:text-[14px]">{{ section.label }}</span>
              </a>
            </li>
          </ul>
          <NuxtLink
            :to="brewLink.href"
            class="mx-2 mb-2 flex h-14 items-center justify-between rounded-[18px] bg-shu px-4 text-[14px] font-medium text-white transition-colors duration-300 hover:bg-shu-light hover:text-forest"
            @click="close"
          >
            <span>{{ brewLink.label }}</span>
            <span class="font-jp text-[17px] font-bold" lang="ja" aria-hidden="true">点前</span>
          </NuxtLink>
        </div>
      </div>
    </nav>
  </div>
</template>
