import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/ui/BaseButton.vue'
import PlantCard from '@/components/PlantCard.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import Badge from '@/components/ui/Badge.vue'
import AppCard from '@/components/ui/AppCard.vue'
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
