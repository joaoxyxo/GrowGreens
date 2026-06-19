import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import PlantCard from '@/components/PlantCard.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import Badge from '@/components/ui/Badge.vue'
import AppCard from '@/components/ui/AppCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import StatChip from '@/components/ui/StatChip.vue'
import DifficultyDots from '@/components/ui/DifficultyDots.vue'
import PageHeader from '@/components/PageHeader.vue'
import type { Plant } from '@/types/catalog'

describe('BaseButton', () => {
  it('renderiza o conteúdo do slot', () => {
    const w = mount(BaseButton, { slots: { default: 'Começar' } })
    expect(w.text()).toBe('Começar')
    expect(w.find('button').exists()).toBe(true)
  })

  it('reflete o estado disabled no elemento', () => {
    const w = mount(BaseButton, { props: { disabled: true }, slots: { default: 'X' } })
    expect(w.find('button').attributes('disabled')).toBeDefined()
  })

  it('encaminha o clique quando ativo', async () => {
    const w = mount(BaseButton, { slots: { default: 'X' } })
    await w.find('button').trigger('click')
    // o clique nativo propaga-se (o componente reencaminha via fallthrough)
    expect(w.emitted('click')).toBeTruthy()
  })

  it('aplica a classe da variante primária por defeito', () => {
    const w = mount(BaseButton, { slots: { default: 'X' } })
    expect(w.find('button').classes().join(' ')).toContain('bg-green-500')
  })
})

describe('ProgressBar', () => {
  const barStyle = (w: ReturnType<typeof mount>) => w.findAll('div')[1].attributes('style') ?? ''

  it('mapeia o valor para a largura percentual', () => {
    expect(barStyle(mount(ProgressBar, { props: { value: 50, max: 100 } }))).toContain('width: 50%')
  })

  it('faz clamping a 0-100', () => {
    expect(barStyle(mount(ProgressBar, { props: { value: 200, max: 100 } }))).toContain('width: 100%')
    expect(barStyle(mount(ProgressBar, { props: { value: -10, max: 100 } }))).toContain('width: 0%')
  })
})

describe('Badge', () => {
  it('renderiza o slot e o ícone', () => {
    const w = mount(Badge, { props: { icon: '🌿' }, slots: { default: 'Recomendado' } })
    expect(w.text()).toContain('Recomendado')
    expect(w.text()).toContain('🌿')
  })
})

describe('AppCard', () => {
  it('renderiza o conteúdo do slot', () => {
    const w = mount(AppCard, { slots: { default: 'Conteúdo' } })
    expect(w.text()).toContain('Conteúdo')
  })
})

describe('EmptyState', () => {
  it('renderiza emoji, título e descrição', () => {
    const w = mount(EmptyState, { props: { emoji: '🔍', title: 'Sem resultados', description: 'Tenta outra coisa.' } })
    expect(w.text()).toContain('🔍')
    expect(w.text()).toContain('Sem resultados')
    expect(w.text()).toContain('Tenta outra coisa.')
  })
})

describe('StatChip', () => {
  it('mostra valor e ícone; label vai no title', () => {
    const w = mount(StatChip, { props: { icon: '🔥', value: 7, label: 'dias' } })
    expect(w.text()).toContain('7')
    expect(w.text()).toContain('🔥')
    expect(w.attributes('title')).toBe('dias')
  })
})

describe('DifficultyDots', () => {
  it('preenche o nº certo de pontos por dificuldade', () => {
    const facil = mount(DifficultyDots, { props: { level: 'facil' } })
    expect(facil.text()).toContain('Fácil')
    expect(facil.findAll('.bg-green-500')).toHaveLength(1)
    const dificil = mount(DifficultyDots, { props: { level: 'dificil' } })
    expect(dificil.findAll('.bg-green-500')).toHaveLength(3)
    expect(dificil.text()).toContain('Exigente')
  })
})

describe('PageHeader', () => {
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/', component: { template: '<div/>' } }] })

  it('renderiza título e subtítulo', () => {
    const w = mount(PageHeader, {
      props: { title: 'Catálogo', subtitle: 'Descobre' },
      global: { plugins: [router] },
    })
    expect(w.text()).toContain('Catálogo')
    expect(w.text()).toContain('Descobre')
  })
})

describe('PlantCard', () => {
  const plant = {
    slug: 'alface',
    name: 'Alface',
    emoji: '🥬',
    category: 'folha',
    difficulty: 'facil',
    shortDescription: 'A rainha das saladas.',
    beginnerFriendly: true,
    daysToHarvest: [45, 70],
  } as unknown as Plant

  it('renderiza o nome e o emoji da planta', () => {
    const w = mount(PlantCard, {
      props: { plant },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })
    expect(w.text()).toContain('Alface')
    expect(w.text()).toContain('🥬')
  })
})
