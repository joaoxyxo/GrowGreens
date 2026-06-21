import { describe, it, expect } from 'vitest'
import { RECIPES, recipesForPlant } from '@/data/recipes'

describe('recipesForPlant', () => {
  it('devolve apenas receitas que listam a planta', () => {
    const r = recipesForPlant('tomate')
    expect(r.length).toBeGreaterThan(0)
    expect(r.every((rec) => rec.plants.includes('tomate'))).toBe(true)
  })

  it('devolve lista vazia para planta sem receitas', () => {
    expect(recipesForPlant('slug-inexistente')).toEqual([])
  })

  it('cada receita devolvida existe no catálogo de receitas', () => {
    const r = recipesForPlant('alho')
    expect(r.every((rec) => RECIPES.some((x) => x.slug === rec.slug))).toBe(true)
  })

  it('liga as plantas novas às suas receitas', () => {
    expect(recipesForPlant('chicoria').some((r) => r.slug === 'chicoria-salteada-alho')).toBe(true)
    expect(recipesForPlant('alcachofra').some((r) => r.slug === 'alcachofras-estufadas')).toBe(true)
  })
})
