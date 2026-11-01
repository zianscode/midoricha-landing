<script setup lang="ts">
import { footerContent } from '~/content/site'

const { followAnchor } = useSmoothScroll()
</script>

<template>
  <footer class="border-t border-ink/10 bg-paper pb-10 pt-20 text-ink">
    <div class="wrap grid-editorial gap-y-14">
      <div class="col-span-4 md:col-span-5">
        <p class="text-forest">
          <BrandMark accent />
        </p>
        <p class="display mt-8 max-w-sm text-[1.6rem] leading-[1.15] text-forest">{{ footerContent.statement }}</p>
      </div>

      <nav class="col-span-2 md:col-span-2 md:col-start-8" aria-label="Footer">
        <p class="label text-ink/40">Explore</p>
        <ul class="mt-6 space-y-3 text-[14px]">
          <li v-for="link in footerContent.explore" :key="link.label">
            <a :href="link.href" class="link-underline pb-0.5 text-ink/75 hover:text-ink" @click="followAnchor($event, link.href)">
              {{ link.label }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="col-span-2 md:col-span-2 md:col-start-11">
        <p class="label text-ink/40">Follow</p>
        <ul class="mt-6 space-y-3 text-[14px]">
          <li v-for="link in footerContent.social" :key="link.label">
            <a :href="link.href" target="_blank" rel="noopener noreferrer" class="link-underline pb-0.5 text-ink/75 hover:text-ink">
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>

      <div class="col-span-4 flex flex-col justify-between gap-3 border-t border-ink/10 pt-6 text-[12px] text-ink/45 md:col-span-12 md:flex-row">
        <p>{{ footerContent.copyright }}</p>
        <p>{{ footerContent.tagline }}</p>
      </div>
    </div>
  </footer>
</template>
