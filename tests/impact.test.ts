import { describe, it, expect } from 'vitest'
import { gardenImpact, attractsPollinators } from '@/utils/impact'
import { PLANTS_BY_SLUG } from '@/data/plants'

const item = (slug: string, status = 'ativa') => ({ plant: PLANTS_BY_SLUG[slug], status })

describe('attractsPollinators', () => {
  it('é verdadeiro para plantas polinizadas por insetos', () => {
    // tomate é autofértil; courgette/abóbora dependem de insetos
    expect(attractsPollinators(PLANTS_BY_SLUG['courgette'])).toBe(true)
    expect(attractsPollinators(PLANTS_BY_SLUG['alface'])).toBe(false)
  })
})

describe('gardenImpact', () => {
  it('conta espécies distintas e colheitas concluídas', () => {
    const impact = gardenImpact(
      [
        item('tomate', 'colhida'),
        item('tomate', 'ativa'),
        item('alface', 'colhida'),
        item('cenoura', 'ativa'),
      ],
      5,
    )
    expect(impact.speciesCount).toBe(3) // tomate, alface, cenoura
    expect(impact.harvestCount).toBe(2)
  })

  it('cobre grupos nutricionais distintos', () => {
    const impact = gardenImpact([item('alface'), item('tomate'), item('feijao-verde')], 5)
    // folhas_verdes, frutos_raizes, leguminosas → 3 grupos
    expect(impact.nutrientGroupsCovered.length).toBeGreaterThanOrEqual(3)
    expect(impact.nutrientGroupsTotal).toBe(5)
  })

  it('calcula a pontuação de polinizadores (% de espécies que os favorecem)', () => {
    const impact = gardenImpact([item('courgette'), item('alface')], 5)
    // 1 de 2 favorece polinizadores → 50%
    expect(impact.pollinatorSpecies).toBe(1)
    expect(impact.pollinatorScore).toBe(50)
  })

  it('horta vazia → tudo a zero, sem divisão por zero', () => {
    const impact = gardenImpact([], 5)
    expect(impact.speciesCount).toBe(0)
    expect(impact.pollinatorScore).toBe(0)
  })
})
