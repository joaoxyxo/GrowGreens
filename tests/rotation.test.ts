import { describe, it, expect } from 'vitest'
import {
  rotationGroupForPlant,
  nextRotationGroup,
  rotationAdvice,
  familyConcentration,
  ROTATION_CYCLE,
  ROTATION_GROUPS,
} from '@/utils/rotation'
import { PLANTS_BY_SLUG } from '@/data/plants'

describe('rotationGroupForPlant', () => {
  it('mapeia a categoria para o grupo de rotação', () => {
    expect(rotationGroupForPlant(PLANTS_BY_SLUG['feijao-verde'])).toBe('leguminosa')
    expect(rotationGroupForPlant(PLANTS_BY_SLUG['couve-galega'])).toBe('folha') // brássica
    expect(rotationGroupForPlant(PLANTS_BY_SLUG['alface'])).toBe('folha')
    expect(rotationGroupForPlant(PLANTS_BY_SLUG['tomate'])).toBe('fruto')
    expect(rotationGroupForPlant(PLANTS_BY_SLUG['cenoura'])).toBe('raiz')
    expect(rotationGroupForPlant(PLANTS_BY_SLUG['manjericao'])).toBe('aromatica')
  })
})

describe('nextRotationGroup', () => {
  it('segue o ciclo leguminosa → folha → fruto → raiz → leguminosa', () => {
    expect(nextRotationGroup('leguminosa')).toBe('folha')
    expect(nextRotationGroup('folha')).toBe('fruto')
    expect(nextRotationGroup('fruto')).toBe('raiz')
    expect(nextRotationGroup('raiz')).toBe('leguminosa')
  })

  it('aromáticas não entram no ciclo anual', () => {
    expect(nextRotationGroup('aromatica')).toBeNull()
  })

  it('o ciclo cobre os 4 grupos principais', () => {
    expect(ROTATION_CYCLE).toHaveLength(4)
    for (const g of ROTATION_CYCLE) expect(ROTATION_GROUPS[g]).toBeTruthy()
  })
})

describe('rotationAdvice', () => {
  it('sem histórico, recomenda o grupo seguinte do ciclo', () => {
    const a = rotationAdvice(PLANTS_BY_SLUG['feijao-verde'], [])
    expect(a.repeatsFamily).toBe(false)
    expect(a.nextGroup).toBe('folha')
    expect(a.message).toMatch(/folhas/i)
  })

  it('avisa quando a mesma família botânica esteve no local recentemente', () => {
    const tomate = PLANTS_BY_SLUG['tomate'] // Solanaceae
    const a = rotationAdvice(tomate, ['Solanaceae'])
    expect(a.repeatsFamily).toBe(true)
    expect(a.message).toMatch(/Solanaceae|3 anos/)
  })

  it('apanha famílias partilhadas mesmo com categorias diferentes (batata × tomate)', () => {
    // batata (raiz) e tomate (fruto) são ambas Solanaceae → não devem seguir-se
    const batata = PLANTS_BY_SLUG['batata']
    expect(batata.family).toBe('Solanaceae')
    const a = rotationAdvice(batata, ['Solanaceae'])
    expect(a.repeatsFamily).toBe(true)
  })

  it('aromáticas/perenes ficam fora da rotação', () => {
    const a = rotationAdvice(PLANTS_BY_SLUG['alecrim'], [])
    expect(a.nextGroup).toBeNull()
    expect(a.message).toMatch(/fora da rota/i)
  })
})

describe('familyConcentration', () => {
  it('deteta famílias com 2+ ocorrências, por ordem decrescente', () => {
    const r = familyConcentration([
      'Solanaceae',
      'Solanaceae',
      'Brassicaceae',
      'Brassicaceae',
      'Brassicaceae',
      'Fabaceae',
    ])
    expect(r[0]).toEqual({ family: 'Brassicaceae', count: 3 })
    expect(r[1]).toEqual({ family: 'Solanaceae', count: 2 })
    expect(r.find((x) => x.family === 'Fabaceae')).toBeUndefined() // só 1
  })

  it('lista vazia quando não há repetição', () => {
    expect(familyConcentration(['Solanaceae', 'Fabaceae'])).toEqual([])
    expect(familyConcentration([])).toEqual([])
  })
})
