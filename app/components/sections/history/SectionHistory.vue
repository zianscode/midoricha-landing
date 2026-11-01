<script setup lang="ts">
import { historyContent as content } from '~/content/home'

const ERA_ID_PREFIX = 'era-'

const eraIds = content.eras.map((_, index) => `${ERA_ID_PREFIX}${index}`)
const activeIndex = useActiveSection(eraIds)
const activeEra = computed(() => content.eras[activeIndex.value] ?? content.eras[0]!)
</script>

<template>
  <section id="history" class="relative bg-cream py-28 md:py-40">
    <div class="wrap grid-editorial gap-y-10">
      <div class="col-span-4 md:col-span-5">
        <div class="md:sticky md:top-28">
          <p v-reveal class="label flex items-center gap-3 text-matcha">
            <span class="font-jp text-[17px] font-bold" lang="ja">{{ content.label.kanji }}</span>
            <span class="size-1 rounded-full bg-current opacity-50" aria-hidden="true" />
            <span>{{ content.label.reading }}</span>
          </p>
          <BaseHeading v-reveal="0.08" :heading="content.heading" class="mt-6 text-[clamp(2.8rem,5.4vw,5.6rem)]" />
          <p v-reveal="0.14" class="mt-8 max-w-sm text-[15px] leading-[1.7] text-ink/60">{{ content.intro }}</p>
          <HistoryKanji :era="activeEra" :seal="content.seal" class="mt-12 hidden md:flex" />
        </div>
      </div>

      <HistoryTimeline
        class="col-span-4 md:col-span-6 md:col-start-7"
        :eras="content.eras"
        :active-index="activeIndex"
        :id-prefix="ERA_ID_PREFIX"
      />
    </div>

    <div class="wrap mt-24 md:mt-36">
      <TeaPrinciples :title="content.principlesTitle" :principles="content.principles" />
    </div>

    <div class="wrap mt-20 md:mt-32">
      <JapaneseQuote :term="content.quote" :seal="content.seal" />
    </div>
  </section>
</template>
