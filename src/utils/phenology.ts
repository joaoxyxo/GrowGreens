import type { Plant } from '@/types/catalog'
import { monthlyMeanTemp } from '@/data/climate'
import { CALENDAR } from '@/data/calendar'
import { todayISO } from '@/utils/date'

// Graus-dia de crescimento (GDD): as plantas desenvolvem-se ao ritmo do calor
// acumulado acima de uma temperatura base, não ao ritmo do calendário. Este
// módulo é puro (sem Vue/Dexie) e estima o progresso até à colheita a partir das
// normais climáticas da zona.

// Temperatura base (°C) por categoria — abaixo dela o desenvolvimento pára.
const BASE_TEMP_BY_CATEGORY: Record<string, number> = {
  fruto: 10,
  leguminosa: 7,
  raiz: 5,
  folha: 4,
  brassica: 5,
  aromatica: 7,
  microgreen: 8,
}

/** Temperatura base da planta: a definida na ficha, ou o default da sua categoria. */
export function baseTempForPlant(plant: Plant): number {
  return plant.baseTempC ?? BASE_TEMP_BY_CATEGORY[plant.category] ?? 6
}

/** Graus-dia de um único dia: max(0, média − base). */
export function dailyGDD(meanTempC: number, baseTempC: number): number {
  return Math.max(0, meanTempC - baseTempC)
}

/** Graus-dia acumulados entre duas datas (de `fromISO` inclusive a `toISO` exclusive). */
export function accumulatedGDD(zone: string, fromISO: string, toISO: string, baseTempC: number): number {
  const d = new Date(fromISO)
  d.setHours(0, 0, 0, 0)
  const end = new Date(toISO)
  end.setHours(0, 0, 0, 0)
  let gdd = 0
  let guard = 0
  while (d < end && guard < 1500) {
    gdd += dailyGDD(monthlyMeanTemp(zone, d.getMonth() + 1), baseTempC)
    d.setDate(d.getDate() + 1)
    guard++
  }
  return Math.round(gdd)
}

/** Mês típico de sementeira da planta (o mais cedo do catálogo), ou abril por omissão. */
function primarySowMonth(plant: Plant): number {
  const months = CALENDAR.filter(
    (e) => e.plant === plant.slug && (e.action === 'sementeira_direta' || e.action === 'sementeira_interior'),
  ).flatMap((e) => e.months)
  return months.length ? [...months].sort((a, b) => a - b)[0] : 4
}

/**
 * Alvo de graus-dia até à colheita: o calor acumulado num ciclo normal, simulado
 * a partir do dia 1 do mês típico de sementeira durante `daysToHarvest` (limite
 * superior). É um número estável que representa as unidades de calor que a cultura
 * precisa para amadurecer.
 */
export function gddTarget(plant: Plant, zone: string): number {
  const base = baseTempForPlant(plant)
  const start = new Date(2025, primarySowMonth(plant) - 1, 1)
  const end = new Date(start)
  end.setDate(end.getDate() + plant.daysToHarvest[1])
  return accumulatedGDD(zone, start.toISOString(), end.toISOString(), base)
}

export interface PhenologyEstimate {
  baseTempC: number
  accumulatedGDD: number
  targetGDD: number
  /** Progresso 0–1 (calor acumulado / alvo). */
  progress: number
  /** Data prevista de colheita (ISO), projetando o calor futuro com as normais. */
  estimatedHarvestISO: string
  /** Dias estimados até à colheita a partir de hoje (0 se já atingiu o alvo). */
  daysToHarvestEstimate: number
}

/**
 * Estima o progresso fenológico de uma planta semeada, baseado no calor acumulado.
 * Adapta-se à época: semear no frio acumula calor mais devagar → colheita mais tardia.
 */
export function phenologyEstimate(
  plant: Plant,
  sownISO: string,
  zone: string,
  today: string = todayISO(),
): PhenologyEstimate {
  const base = baseTempForPlant(plant)
  const target = gddTarget(plant, zone)
  const acc = accumulatedGDD(zone, sownISO, today, base)
  const progress = target > 0 ? Math.min(1, acc / target) : 0

  // Projeta o calor futuro dia a dia até atingir o alvo.
  let daysAhead = 0
  const d = new Date(today)
  d.setHours(0, 0, 0, 0)
  if (acc < target) {
    let cum = acc
    let guard = 0
    while (cum < target && guard < 1500) {
      cum += dailyGDD(monthlyMeanTemp(zone, d.getMonth() + 1), base)
      d.setDate(d.getDate() + 1)
      guard++
    }
    daysAhead = guard
  }

  return {
    baseTempC: base,
    accumulatedGDD: acc,
    targetGDD: target,
    progress,
    estimatedHarvestISO: d.toISOString(),
    daysToHarvestEstimate: daysAhead,
  }
}
