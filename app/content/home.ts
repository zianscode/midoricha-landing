import { anchor } from '~/content/site'
import type {
  Heading,
  HistoryEra,
  JapaneseTerm,
  LeafFact,
  ModernUse,
  ProcessStep,
  SceneFigure,
  SensoryNote,
  TextItem
} from '~/types/content'

export const heroContent = {
  heading: { lead: 'From leaf', accent: 'to ritual.' } satisfies Heading,
  intro:
    "Shaded for weeks before harvest, then ground between granite stones a few dozen grams an hour. The quiet craft behind one of Japan's most distinctive green teas.",
  primaryAction: { label: 'Explore the journey', href: anchor('cultivation') },
  secondaryAction: { label: 'The leaf', href: anchor('leaf') },
  wordmark: 'matcha',
  figure: {
    scene: 'hero',
    label: 'A charcoal glazed chawan of whisked matcha beside a bamboo whisk, a tea sprig and a small heap of powder'
  } satisfies SceneFigure
}

export const leafContent = {
  heading: { lead: 'Before the powder,', accent: 'there is the leaf.' } satisfies Heading,
  intro:
    'Matcha begins long before the first whisk touches the bowl. Carefully shaded tea plants develop young, vibrant leaves rich in color, aroma, and character.',
  detail:
    "With less sunlight, the leaf holds on to more chlorophyll and theanine, the source of matcha's deep green and its rounded, savoury sweetness.",
  caption: { name: 'Camellia sinensis', note: 'One bud, two leaves' },
  figure: { scene: 'leaf', label: 'A tea sprig with one bud and two young leaves, turning slowly' } satisfies SceneFigure,
  facts: [
    { title: 'Cultivation', text: 'Grown on misted hillsides in Uji, Nishio and Kagoshima.', pin: { x: 30, y: 64 } },
    { title: 'Shade grown', text: 'Covered for weeks before harvest to deepen colour and sweetness.', pin: { x: 68, y: 44 } },
    { title: 'Hand selected', text: 'Only the youngest, most tender leaves are chosen.', pin: { x: 50, y: 18 } }
  ] satisfies LeafFact[]
}

export const cultivationContent = {
  heading: { lead: 'Shade. Time.', accent: 'Precision.' } satisfies Heading,
  intro: 'Matcha is decided in the field. Every step that follows only protects what the leaf already holds.',
  figure: {
    scene: 'cultivation',
    label: 'Rows of clipped tea bushes receding into mist, changing as the stages of cultivation pass'
  } satisfies SceneFigure,
  stages: [
    { title: 'Shade', text: 'For around three weeks before harvest, the bushes are covered and light is slowly withdrawn.' },
    { title: 'Harvest', text: 'In spring, only the newest shoots are picked: the bud and the first tender leaves.' },
    { title: 'Steam', text: 'Within hours of picking, the leaves are briefly steamed to keep their colour.' },
    { title: 'Dry', text: 'Dried flat, then stripped of stems and veins. What remains is called tencha.' },
    { title: 'Stone Grind', text: 'Granite mills turn slowly, reducing tencha to a fine, silken powder.' }
  ] satisfies TextItem[]
}

export const processContent = {
  heading: { lead: 'Slowly transformed.', accent: 'Never rushed.' } satisfies Heading,
  intro:
    'Five steps separate a living leaf from the powder in your bowl. None of them can be hurried without the tea tasting of it.',
  hint: 'Keep scrolling',
  steps: [
    {
      id: 'shade',
      title: 'Shade',
      text: 'Shading pushes the plant to make more chlorophyll and amino acids. The leaf turns a deeper green, and bitterness gives way to sweetness.'
    },
    {
      id: 'harvest',
      title: 'Harvest',
      text: 'First flush leaves are gathered in spring, when they are softest and most concentrated in flavour.'
    },
    {
      id: 'steam',
      title: 'Steam',
      text: 'A short burst of steam stops oxidation. It is what keeps Japanese green tea green and fresh in taste.'
    },
    {
      id: 'dry',
      title: 'Dry',
      text: 'The leaves are dried without rolling, then stems and veins are removed. The flat, delicate flakes are tencha.'
    },
    {
      id: 'grind',
      title: 'Grind',
      text: 'Tencha is fed into a granite mill turning at a deliberately slow pace, so friction never warms the leaf.'
    }
  ] satisfies ProcessStep[]
}

export const grindingContent = {
  heading: { lead: 'Patience\nbecomes', accent: 'powder.', inline: true } satisfies Heading,
  intro: 'Traditionally ground at a pace slow enough to protect the delicate character of the tea.',
  note: 'A single stone mill yields only a few dozen grams in an hour.',
  phases: ['Tencha', 'Milling', 'Powder'],
  figure: {
    scene: 'mill',
    label: 'A granite stone mill turning as tea flakes fall into it and fine green powder gathers beneath'
  } satisfies SceneFigure
}

export const sensoryContent = {
  heading: { lead: 'Green, layered,', accent: 'alive.', inline: true } satisfies Heading,
  caption: 'Profile of a first harvest ceremonial matcha. Every garden tastes different.',
  maxLevel: 5,
  notes: [
    { name: 'Umami', level: 5, text: 'Deep and savoury, from amino acids the shade preserves.', tone: ['#a7c06f', '#6d8f3c', '#3f5f27'] },
    { name: 'Sweet', level: 3, text: 'A soft, lingering sweetness that never turns sugary.', tone: ['#d4e3a8', '#a9c677', '#6f8f45'] },
    { name: 'Grassy', level: 3, text: 'Freshly cut greens, young spinach, a breath of the sea.', tone: ['#bcd57e', '#86ab43', '#4d7128'] },
    { name: 'Creamy', level: 4, text: 'A velvet texture once whisked into fine foam.', tone: ['#e6edcf', '#c2d49a', '#8aa55f'] },
    { name: 'Bitter', level: 2, text: 'A clean, gentle bitterness that keeps it bright.', tone: ['#93ad62', '#58773a', '#2c4520'] }
  ] satisfies SensoryNote[]
}

export const historyContent = {
  label: { kanji: '歴史', reading: 'Rekishi' },
  heading: { lead: 'Eight centuries', accent: 'in a bowl.' } satisfies Heading,
  intro:
    'Powdered tea reached Japan with a Zen monk and a handful of seeds. Over the next four hundred years it grew from temple medicine into one of the quietest arts the country has.',
  seal: '緑茶',
  eras: [
    {
      period: '9th to 13th century',
      kanji: '唐',
      kanjiMeaning: 'Tang China',
      title: 'Tea as powder',
      text: 'In Tang China, tea leaves were steamed, pressed into cakes and ground before brewing. By the Song dynasty, Chan monks were whisking the powder straight in the bowl.'
    },
    {
      period: '1191',
      kanji: '禅',
      kanjiMeaning: 'Zen',
      title: 'A monk brings seeds home',
      text: 'The monk Eisai returns from China with tea seeds and the habit of whisked tea. In 1211 he writes Kissa Yōjōki, a small book that praises tea for keeping the body well.'
    },
    {
      period: '13th century',
      kanji: '畑',
      kanjiMeaning: 'Field',
      title: 'Gardens near Kyoto',
      text: 'Eisai shares seeds with the monk Myōe, who plants them at Kōzanji in Toganoo. Tea from these hills is called honcha, true tea, and growing soon spreads south to Uji.'
    },
    {
      period: '15th century',
      kanji: '侘',
      kanjiMeaning: 'Wabi',
      title: 'The beauty of less',
      text: 'Murata Jukō turns away from lavish tea parties toward a small room, plain utensils and quiet attention. The style becomes known as wabi cha.'
    },
    {
      period: '16th century',
      kanji: '覆',
      kanjiMeaning: 'Cover',
      title: 'Shade over Uji',
      text: 'Growers in Uji start covering their fields with reed screens and straw before the spring harvest. The shaded leaves grow sweeter and greener, and matcha as we know it begins.'
    },
    {
      period: '1522 to 1591',
      kanji: '利',
      kanjiMeaning: 'Rikyū',
      title: 'Sen no Rikyū',
      text: 'Rikyū shapes the tea ceremony that is still practised today: a tiny room, a low doorway that makes every guest bow, and four principles to guide the host.'
    },
    {
      period: 'Today',
      kanji: '今',
      kanjiMeaning: 'Now',
      title: 'A bowl for everyone',
      text: 'Matcha is still stone ground in Uji, Nishio and Kagoshima. It has also found its way into lattes, pastry and kitchens far from Japan.'
    }
  ] satisfies HistoryEra[],
  principlesTitle: 'The four principles of tea',
  principles: [
    { kanji: '和', reading: 'wa', meaning: 'Harmony', text: 'Between host and guest, and with the season outside the window.' },
    { kanji: '敬', reading: 'kei', meaning: 'Respect', text: 'For every person, every utensil and every gesture in the room.' },
    { kanji: '清', reading: 'sei', meaning: 'Purity', text: 'Of the room, of the tools and, slowly, of the mind.' },
    { kanji: '寂', reading: 'jaku', meaning: 'Tranquility', text: 'The calm that stays once the other three are in place.' }
  ] satisfies JapaneseTerm[],
  quote: {
    kanji: '一期一会',
    reading: 'ichigo ichie',
    meaning: 'One time, one meeting',
    text: 'Every gathering happens only once. The same guests may return, but this bowl, on this day, will not come again. So the host prepares it as if it were the only one.'
  } satisfies JapaneseTerm
}

export const ritualContent = {
  heading: { lead: 'Make room', accent: 'for a moment.' } satisfies Heading,
  intro: 'Matcha is not only something you drink. It is a pause, a ritual, and a way of being present.',
  action: { label: 'Make a bowl yourself', href: '/brew' },
  figure: {
    scene: 'ritual',
    label: 'Top down view of an ash glazed bowl of whisked matcha with steam rising, a whisk, a lacquered caddy and a tea scoop'
  } satisfies SceneFigure,
  steps: [
    { title: 'Sift', text: 'Two small scoops through a fine sieve.' },
    { title: 'Pour', text: 'A little water, just off the boil, around 80 °C.' },
    { title: 'Whisk', text: 'Quick, light strokes until a fine foam rises.' },
    { title: 'Pause', text: 'Hold the bowl in both hands. Drink slowly.' }
  ] satisfies TextItem[]
}

export const modernContent = {
  heading: { lead: 'Ancient ritual.', accent: 'Modern rhythm.' } satisfies Heading,
  intro: 'The same leaf and the same care, carried into the way we eat, drink and make things now.',
  uses: [
    {
      kind: 'ceremonial',
      title: 'Ceremonial',
      text: 'Whisked with water alone. The purest expression of the leaf.',
      alt: 'Top down view of whisked matcha in a dark chawan, a bamboo whisk resting beside it'
    },
    {
      kind: 'latte',
      title: 'Latte',
      text: 'Softened with milk, over ice or warm. An everyday ritual.',
      alt: 'A glass of iced milk with matcha floating on top'
    },
    {
      kind: 'culinary',
      title: 'Culinary',
      text: 'Folded into pastry, dusted over desserts, stirred into savoury dishes.',
      alt: 'Matcha powder dusted through a fine sieve onto a pale surface'
    },
    {
      kind: 'creative',
      title: 'Creative',
      text: 'Colour, texture and a little ceremony, wherever inspiration leads.',
      alt: 'An ensō circle drawn in matcha powder on a dark green surface'
    }
  ] satisfies ModernUse[]
}

export const closingContent = {
  heading: { lead: 'Slow down.', accent: 'Whisk well.' } satisfies Heading,
  intro: 'Discover the craft, character, and quiet ritual behind matcha.',
  action: { label: 'Begin the journey', href: anchor('leaf') },
  marquee: ['Shade', 'Harvest', 'Steam', 'Dry', 'Grind', 'Whisk', 'Pause'],
  figure: { scene: 'floatingLeaf', label: 'A single tea leaf floating above its soft shadow' } satisfies SceneFigure
}
