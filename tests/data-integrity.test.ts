import { describe, it, expect } from 'vitest'
import { PLANTS, PLANTS_BY_SLUG } from '@/data/plants'
import { CALENDAR } from '@/data/calendar'
import { RECIPES } from '@/data/recipes'
import { NUTRIENT_GROUPS_BY_CODE } from '@/data/health'
import { PESTS_BY_SLUG, DISEASES_BY_SLUG } from '@/data/pestsDiseases'
import { MICROGREENS } from '@/data/microgreens'
import { LESSONS, COURSE_UNITS, LESSONS_BY_ID } from '@/data/course'

describe('integridade do núcleo agronómico', () => {
  it('tem um conjunto razoável de plantas', () => {
    expect(PLANTS.length).toBeGreaterThanOrEqual(15)
  })

  it('cada planta tem slug único e campos essenciais', () => {
    const slugs = new Set<string>()
    for (const p of PLANTS) {
      expect(slugs.has(p.slug)).toBe(false)
      slugs.add(p.slug)
      expect(p.name).toBeTruthy()
      expect(p.daysToHarvest[1]).toBeGreaterThanOrEqual(p.daysToHarvest[0])
      expect(p.phRange[0]).toBeLessThanOrEqual(p.phRange[1])
      expect(p.stages.length).toBeGreaterThan(0)
    }
  })

  it('companheiras e antagonistas referem plantas existentes', () => {
    for (const p of PLANTS) {
      for (const c of [...p.companions, ...p.antagonists]) {
        expect(PLANTS_BY_SLUG[c], `${p.slug} -> ${c}`).toBeTruthy()
      }
    }
  })

  it('pragas, doenças e grupo nutricional existem', () => {
    for (const p of PLANTS) {
      for (const pest of p.pests) expect(PESTS_BY_SLUG[pest], pest).toBeTruthy()
      for (const d of p.diseases) expect(DISEASES_BY_SLUG[d], d).toBeTruthy()
      expect(NUTRIENT_GROUPS_BY_CODE[p.nutrientGroup], p.nutrientGroup).toBeTruthy()
    }
  })

  it('o calendário só refere plantas existentes e meses válidos', () => {
    for (const e of CALENDAR) {
      expect(PLANTS_BY_SLUG[e.plant], e.plant).toBeTruthy()
      for (const m of e.months) {
        expect(m).toBeGreaterThanOrEqual(1)
        expect(m).toBeLessThanOrEqual(12)
      }
    }
  })

  it('as receitas referem plantas existentes', () => {
    for (const r of RECIPES) {
      for (const slug of r.plants) expect(PLANTS_BY_SLUG[slug], `${r.slug} -> ${slug}`).toBeTruthy()
    }
  })

  it('o desafio dos microgreens tem variedades de principiante', () => {
    expect(MICROGREENS.some((m) => m.beginner)).toBe(true)
    const radish = MICROGREENS.find((m) => m.slug === 'rabanete')
    expect(radish?.daysToHarvest[0]).toBeLessThanOrEqual(7)
  })

  it('o curso é coerente (lições das unidades existem)', () => {
    for (const u of COURSE_UNITS) {
      for (const lid of u.lessonIds) expect(LESSONS_BY_ID[lid], lid).toBeTruthy()
    }
    for (const l of LESSONS) {
      expect(l.steps.length).toBeGreaterThan(0)
      for (const s of l.steps) {
        if (s.kind === 'choice' || s.kind === 'truefalse') {
          expect(s.options && s.options.length).toBeGreaterThan(0)
          expect(s.correctIndex).toBeGreaterThanOrEqual(0)
        }
      }
    }
  })
})
