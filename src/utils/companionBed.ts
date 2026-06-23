import type { Plant } from '@/types/catalog'
import { areCompanions, areAntagonists } from '@/utils/growth'

// Otimizador de consociação: avalia as combinações de plantas de um canteiro
// (companheiras vs antagonistas) e sugere boas adições. Módulo puro.

export interface BedPair {
  a: string
  b: string
}

export interface BedAnalysis {
  synergies: BedPair[]
  conflicts: BedPair[]
  /** Saldo simples: nº de boas vizinhanças menos más vizinhanças. */
  score: number
}

/** Avalia todos os pares distintos de plantas presentes no canteiro. */
export function analyzeBed(plants: Plant[]): BedAnalysis {
  const uniq = [...new Map(plants.map((p) => [p.slug, p])).values()]
  const synergies: BedPair[] = []
  const conflicts: BedPair[] = []
  for (let i = 0; i < uniq.length; i++) {
    for (let j = i + 1; j < uniq.length; j++) {
      const a = uniq[i]
      const b = uniq[j]
      if (areAntagonists(a, b)) conflicts.push({ a: a.slug, b: b.slug })
      else if (areCompanions(a, b)) synergies.push({ a: a.slug, b: b.slug })
    }
  }
  return { synergies, conflicts, score: synergies.length - conflicts.length }
}

/**
 * Sugere plantas (do catálogo) que são boas companheiras de pelo menos uma das
 * presentes e antagonistas de nenhuma. Ordenado por nº de sinergias.
 */
export function suggestCompanions(present: Plant[], catalog: Plant[], limit = 4): Plant[] {
  const presentSlugs = new Set(present.map((p) => p.slug))
  return catalog
    .filter((c) => !presentSlugs.has(c.slug))
    .map((c) => {
      let good = 0
      let bad = 0
      for (const p of present) {
        if (areAntagonists(c, p)) bad++
        else if (areCompanions(c, p)) good++
      }
      return { c, good, bad }
    })
    .filter((x) => x.good > 0 && x.bad === 0)
    .sort((a, b) => b.good - a.good || a.c.slug.localeCompare(b.c.slug))
    .slice(0, limit)
    .map((x) => x.c)
}
