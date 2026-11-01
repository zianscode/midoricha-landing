import type { Link, NavSection, SectionId } from '~/types/content'

export const BRAND_NAME = 'midoricha'

export const anchor = (id: SectionId) => `#${id}`

export const navigationSections: NavSection[] = [
  { id: 'top', label: 'Intro' },
  { id: 'leaf', label: 'The Leaf' },
  { id: 'cultivation', label: 'Cultivation' },
  { id: 'process', label: 'Process' },
  { id: 'grinding', label: 'Stone Ground' },
  { id: 'character', label: 'Character' },
  { id: 'history', label: 'History' },
  { id: 'ritual', label: 'Ritual' },
  { id: 'modern', label: 'Today' },
  { id: 'begin', label: 'Begin' }
]

export const brewLink: Link = { label: 'Make a bowl yourself', href: '/brew' }

export const footerContent = {
  statement: 'An exploration of matcha, its origins, and the ritual surrounding it.',
  copyright: '© 2026 Midoricha. All rights reserved.',
  tagline: 'From a single green leaf to a timeless ritual.',
  explore: [
    { label: 'Origins', href: anchor('history') },
    { label: 'Process', href: anchor('process') },
    { label: 'Ritual', href: anchor('ritual') },
    { label: 'Journal', href: anchor('modern') }
  ] satisfies Link[],
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'Pinterest', href: 'https://www.pinterest.com/' },
    { label: 'Behance', href: 'https://www.behance.net/' }
  ] satisfies Link[]
}
