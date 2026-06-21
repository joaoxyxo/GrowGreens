import { describe, it, expect } from 'vitest'
import { PLANTS, PLANTS_BY_SLUG } from '@/data/plants'
import { CALENDAR } from '@/data/calendar'
import { RECIPES } from '@/data/recipes'
import { NUTRIENT_GROUPS_BY_CODE } from '@/data/health'
import { PESTS_BY_SLUG, DISEASES_BY_SLUG } from '@/data/pestsDiseases'
import { MICROGREENS } from '@/data/microgreens'
import { LESSONS, COURSE_UNITS, LESSONS_BY_ID } from '@/data/course'
import { SYMPTOMS } from '@/data/troubleshoot'
import { GLOSSARY } from '@/data/glossary'
import { FAQ } from '@/data/faq'

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

  it('plantas não seguras para animais (petSafe=false) têm nota de toxicidade', () => {
    for (const p of PLANTS) {
      if (!p.petSafe) {
        expect(p.toxicNote, `${p.slug} é petSafe=false mas sem toxicNote`).toBeTruthy()
      }
    }
  })

  it('nome científico é binomial e família termina em -aceae', () => {
    for (const p of PLANTS) {
      expect(p.scientificName.trim().split(/\s+/).length, `${p.slug}: ${p.scientificName}`).toBeGreaterThanOrEqual(2)
      expect(p.family, `${p.slug}: ${p.family}`).toMatch(/aceae$/)
    }
  })

  it('as fases de cada planta têm durações coerentes (min ≤ max)', () => {
    for (const p of PLANTS) {
      for (const s of p.stages) {
        if (s.durationDays) {
          expect(s.durationDays[0], `${p.slug}/${s.stage}`).toBeLessThanOrEqual(s.durationDays[1])
          expect(s.durationDays[0], `${p.slug}/${s.stage}`).toBeGreaterThanOrEqual(0)
        }
      }
    }
  })

  it('sintomas: refs cruzadas (related) apontam para pragas/doenças existentes', () => {
    for (const sym of SYMPTOMS) {
      for (const slug of sym.related ?? []) {
        expect(PESTS_BY_SLUG[slug] || DISEASES_BY_SLUG[slug], `${sym.id} -> ${slug}`).toBeTruthy()
      }
    }
  })

  it('todas as plantas têm pelo menos uma entrada de calendário', () => {
    const comCalendario = new Set(CALENDAR.map((e) => e.plant))
    for (const p of PLANTS) {
      expect(comCalendario.has(p.slug), `${p.slug} sem entrada de calendário`).toBe(true)
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

  it('microgreens: slugs únicos e daysToHarvest coerente', () => {
    const slugs = new Set<string>()
    for (const m of MICROGREENS) {
      expect(slugs.has(m.slug), `slug duplicado: ${m.slug}`).toBe(false)
      slugs.add(m.slug)
      expect(m.daysToHarvest[1]).toBeGreaterThanOrEqual(m.daysToHarvest[0])
    }
  })

  it('cada receita refere pelo menos uma planta', () => {
    for (const r of RECIPES) expect(r.plants.length, r.slug).toBeGreaterThan(0)
  })

  it('glossário e FAQ não têm entradas duplicadas', () => {
    const termos = GLOSSARY.map((t) => t.term.toLowerCase())
    expect(new Set(termos).size).toBe(termos.length)
    const qs = FAQ.map((f) => f.q.toLowerCase())
    expect(new Set(qs).size).toBe(qs.length)
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
