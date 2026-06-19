import type { Plant, WaterNeed } from '@/types/catalog'

// Dias entre regas recomendados por necessidade hídrica da planta.
const WATERING_DAYS_BY_NEED: Record<WaterNeed, number> = { baixa: 5, moderada: 3, alta: 2 }

/** Intervalo de rega (em dias) sugerido a partir da necessidade hídrica da espécie. */
export function defaultWateringDays(waterNeed: WaterNeed): number {
  return WATERING_DAYS_BY_NEED[waterNeed] ?? 3
}

/** Duas plantas são boas vizinhas se qualquer uma listar a outra como companheira. */
export function areCompanions(a: Plant, b: Plant): boolean {
  return a.companions.includes(b.slug) || b.companions.includes(a.slug)
}

/** Duas plantas são más vizinhas se qualquer uma listar a outra como antagonista. */
export function areAntagonists(a: Plant, b: Plant): boolean {
  return a.antagonists.includes(b.slug) || b.antagonists.includes(a.slug)
}

const STAGE_LABELS: Record<string, string> = {
  germinacao: 'Germinação',
  plantula: 'Plântula',
  vegetativo: 'Crescimento',
  floracao: 'Floração',
  frutificacao: 'Frutificação',
  colheita: 'Colheita',
}

/**
 * Estima a fase de crescimento atual a partir dos dias decorridos e das durações
 * definidas na espécie. Útil para mostrar progresso real de cada planta.
 */
export function estimateStage(plant: Plant, daysOld: number): { label: string; index: number; total: number } {
  const stages = plant.stages
  let acc = 0
  for (let i = 0; i < stages.length; i++) {
    const s = stages[i]
    const dur = s.durationDays ? s.durationDays[1] : Number.MAX_SAFE_INTEGER
    acc += dur
    if (daysOld <= acc || i === stages.length - 1) {
      return { label: STAGE_LABELS[s.stage] ?? s.stage, index: i, total: stages.length }
    }
  }
  return { label: STAGE_LABELS[stages[0].stage] ?? '—', index: 0, total: stages.length }
}
