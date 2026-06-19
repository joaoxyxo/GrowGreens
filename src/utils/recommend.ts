import { PLANTS } from '@/data/plants'
import { plantSowableThisMonth } from '@/data/calendar'
import { currentMonth, currentSeason } from '@/utils/date'
import type { Plant } from '@/types/catalog'
import type { SettingsState } from '@/types/models'

/**
 * Recomenda plantas para começar, com base no espaço, região, estação e experiência.
 * Pontua cada planta e devolve as melhores.
 */
export function recommendPlants(settings: SettingsState, limit = 3): Plant[] {
  const sowable = plantSowableThisMonth(settings.zoneCode, currentMonth())
  const season = currentSeason()
  const indoorOnly = settings.space === 'interior' || settings.space === 'parapeito'
  const beginner = settings.experience === 'nunca'

  const scored = PLANTS.map((p) => {
    let score = 0
    if (sowable.has(p.slug)) score += 4 // época certa agora
    if (beginner && p.beginnerFriendly) score += 3
    if (p.difficulty === 'facil') score += 2
    if (indoorOnly && (p.location === 'interior' || p.location === 'ambos')) score += 3
    if (indoorOnly && p.location === 'exterior') score -= 4
    if (indoorOnly && p.potVolumeL <= 4) score += 1
    if (p.indoorViabilityBySeason[season] === 'bom') score += 1
    if (p.indoorViabilityBySeason[season] === 'evitar' && indoorOnly) score -= 2
    return { p, score }
  })

  return scored
    // Desempate por slug para ordenação determinística e estável.
    .sort((a, b) => b.score - a.score || a.p.slug.localeCompare(b.p.slug))
    .slice(0, limit)
    .map((s) => s.p)
}
