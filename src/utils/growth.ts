import type { Plant } from '@/types/catalog'

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
