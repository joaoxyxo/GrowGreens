import type { Plant } from '@/types/catalog'

// Painel de impacto da horta: métricas derivadas das plantas cultivadas, sem
// necessidade de registo extra. Módulo puro.

export interface ImpactItem {
  plant: Plant
  status: string
}

export interface GardenImpact {
  /** Espécies diferentes já cultivadas. */
  speciesCount: number
  /** Colheitas concluídas (estado "colhida"). */
  harvestCount: number
  /** Códigos dos grupos nutricionais já cultivados. */
  nutrientGroupsCovered: string[]
  nutrientGroupsTotal: number
  /** Espécies que atraem/dependem de polinizadores (polinização por insetos). */
  pollinatorSpecies: number
  /** % das espécies cultivadas que favorecem polinizadores (0–100). */
  pollinatorScore: number
}

/** Indica se a planta favorece a biodiversidade de polinizadores (polinizada por insetos). */
export function attractsPollinators(plant: Plant): boolean {
  return plant.pollination === 'insetos'
}

/** Calcula o painel de impacto a partir das plantas cultivadas (com o respetivo estado). */
export function gardenImpact(items: ImpactItem[], nutrientGroupsTotal: number): GardenImpact {
  const speciesMap = new Map<string, Plant>()
  let harvestCount = 0
  for (const it of items) {
    speciesMap.set(it.plant.slug, it.plant)
    if (it.status === 'colhida') harvestCount++
  }
  const species = [...speciesMap.values()]
  const nutrientGroupsCovered = [...new Set(species.map((p) => p.nutrientGroup))]
  const pollinatorSpecies = species.filter(attractsPollinators).length
  const pollinatorScore = species.length ? Math.round((pollinatorSpecies / species.length) * 100) : 0

  return {
    speciesCount: species.length,
    harvestCount,
    nutrientGroupsCovered,
    nutrientGroupsTotal,
    pollinatorSpecies,
    pollinatorScore,
  }
}
