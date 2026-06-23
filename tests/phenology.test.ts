import { describe, it, expect } from 'vitest'
import { dailyGDD, accumulatedGDD, gddTarget, phenologyEstimate, baseTempForPlant } from '@/utils/phenology'
import { monthlyMeanTemp, ZONE_CLIMATE_NORMALS } from '@/data/climate'
import { CLIMATE_ZONES } from '@/data/calendar'
import { PLANTS_BY_SLUG } from '@/data/plants'

describe('climate — normais', () => {
  it('cada zona climática do catálogo tem 12 normais mensais', () => {
    for (const z of CLIMATE_ZONES) {
      expect(ZONE_CLIMATE_NORMALS[z.code], `zona ${z.code} sem normais`).toBeTruthy()
      expect(ZONE_CLIMATE_NORMALS[z.code].length, `zona ${z.code}`).toBe(12)
    }
  })

  it('devolve média mensal por zona e cai no litoral norte se desconhecida', () => {
    expect(monthlyMeanTemp('litoral_sul', 7)).toBe(25)
    expect(monthlyMeanTemp('zona_inexistente', 7)).toBe(monthlyMeanTemp('litoral_norte', 7))
  })

  it('clampa meses fora do intervalo', () => {
    expect(monthlyMeanTemp('litoral_norte', 0)).toBe(monthlyMeanTemp('litoral_norte', 1))
    expect(monthlyMeanTemp('litoral_norte', 13)).toBe(monthlyMeanTemp('litoral_norte', 12))
  })
})

describe('dailyGDD', () => {
  it('é a diferença acima da base, nunca negativo', () => {
    expect(dailyGDD(20, 10)).toBe(10)
    expect(dailyGDD(8, 10)).toBe(0)
  })
})

describe('accumulatedGDD', () => {
  it('acumula calor ao longo dos dias (positivo num mês quente)', () => {
    // julho no litoral sul (25°C), base 10 → ~15/dia × 31
    const gdd = accumulatedGDD('litoral_sul', '2025-07-01', '2025-08-01', 10)
    expect(gdd).toBeGreaterThan(400)
    expect(gdd).toBeLessThan(500)
  })

  it('é zero quando o intervalo é nulo ou a média está abaixo da base', () => {
    expect(accumulatedGDD('litoral_norte', '2025-07-01', '2025-07-01', 10)).toBe(0)
    // base muito alta → sem acumulação
    expect(accumulatedGDD('litoral_norte', '2025-01-01', '2025-02-01', 50)).toBe(0)
  })
})

describe('baseTempForPlant', () => {
  it('usa o default por categoria (tomate=fruto→10, alface=folha→4)', () => {
    expect(baseTempForPlant(PLANTS_BY_SLUG['tomate'])).toBe(10)
    expect(baseTempForPlant(PLANTS_BY_SLUG['alface'])).toBe(4)
  })
})

describe('gddTarget', () => {
  it('é um número positivo para uma cultura real', () => {
    expect(gddTarget(PLANTS_BY_SLUG['tomate'], 'litoral_norte')).toBeGreaterThan(0)
  })
})

describe('phenologyEstimate', () => {
  it('progresso fica entre 0 e 1 e cresce com o tempo decorrido', () => {
    const tomate = PLANTS_BY_SLUG['tomate']
    const cedo = phenologyEstimate(tomate, '2025-05-01', 'litoral_norte', '2025-05-20')
    const tarde = phenologyEstimate(tomate, '2025-05-01', 'litoral_norte', '2025-07-01')
    expect(cedo.progress).toBeGreaterThanOrEqual(0)
    expect(tarde.progress).toBeLessThanOrEqual(1)
    expect(tarde.progress).toBeGreaterThan(cedo.progress)
  })

  it('semear no frio prevê uma colheita mais tardia do que semear no calor', () => {
    const alface = PLANTS_BY_SLUG['alface']
    const verao = phenologyEstimate(alface, '2025-05-01', 'litoral_norte', '2025-05-01')
    const inverno = phenologyEstimate(alface, '2025-11-01', 'litoral_norte', '2025-11-01')
    // mesma planta, mas menos calor disponível no inverno → mais dias até à colheita
    expect(inverno.daysToHarvestEstimate).toBeGreaterThan(verao.daysToHarvestEstimate)
  })

  it('quando o calor acumulado atinge o alvo, o progresso é 1 e não faltam dias', () => {
    const rabanete = PLANTS_BY_SLUG['rabanete']
    const est = phenologyEstimate(rabanete, '2025-04-01', 'litoral_norte', '2026-04-01')
    expect(est.progress).toBe(1)
    expect(est.daysToHarvestEstimate).toBe(0)
  })
})
