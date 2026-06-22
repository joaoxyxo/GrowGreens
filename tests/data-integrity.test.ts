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

  it('microgreens: blackoutDays válidos e dentro do tempo de colheita', () => {
    for (const m of MICROGREENS) {
      expect(m.blackoutDays[0], `${m.slug} blackout min`).toBeGreaterThanOrEqual(0)
      expect(m.blackoutDays[1], `${m.slug} blackout cresc.`).toBeGreaterThanOrEqual(m.blackoutDays[0])
      // O blackout (escuro) acontece antes da colheita.
      expect(m.blackoutDays[1], `${m.slug} blackout < colheita`).toBeLessThan(m.daysToHarvest[1])
      expect(m.soakHours, `${m.slug} soakHours`).toBeGreaterThanOrEqual(0)
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

  it('cada planta tem textos essenciais não vazios (in30Seconds, growingTips)', () => {
    for (const p of PLANTS) {
      expect(p.in30Seconds.length, `${p.slug} sem in30Seconds`).toBeGreaterThan(0)
      expect(p.in30Seconds.every((t) => t.trim().length > 0), `${p.slug} in30Seconds vazio`).toBe(true)
      expect(p.growingTips.trim().length, `${p.slug} sem growingTips`).toBeGreaterThan(0)
      expect(p.shortDescription.trim().length, `${p.slug} sem shortDescription`).toBeGreaterThan(0)
    }
  })

  it('cada planta tem portugalNotes e harvestNotes não vazios', () => {
    for (const p of PLANTS) {
      expect(p.portugalNotes.trim().length, `${p.slug} sem portugalNotes`).toBeGreaterThan(0)
      expect(p.harvestNotes.trim().length, `${p.slug} sem harvestNotes`).toBeGreaterThan(0)
    }
  })

  it('o catálogo tem variedade de categorias', () => {
    const cats = new Set(PLANTS.map((p) => p.category))
    for (const c of ['folha', 'fruto', 'raiz', 'leguminosa', 'aromatica']) {
      expect(cats.has(c as never), `falta categoria ${c}`).toBe(true)
    }
  })

  it('cada lição tem pelo menos um passo de resumo (summary)', () => {
    for (const l of LESSONS) {
      expect(l.steps.some((s) => s.kind === 'summary'), `${l.id} sem summary`).toBe(true)
    }
  })

  it('cada sintoma tem o que fazer (whatToDo) não vazio', () => {
    for (const sym of SYMPTOMS) {
      expect(sym.whatToDo.length, `${sym.id} sem whatToDo`).toBeGreaterThan(0)
      expect(sym.likely.trim().length, `${sym.id} sem likely`).toBeGreaterThan(0)
    }
  })

  it('cada microgreen tem flavour e note não vazios', () => {
    for (const m of MICROGREENS) {
      expect(m.flavour.trim().length, `${m.slug} sem flavour`).toBeGreaterThan(0)
      expect(m.note.trim().length, `${m.slug} sem note`).toBeGreaterThan(0)
    }
  })

  it('cada receita tem ingredientes e passos não vazios', () => {
    for (const r of RECIPES) {
      expect(r.ingredients.length, `${r.slug} sem ingredientes`).toBeGreaterThan(0)
      expect(r.steps.length, `${r.slug} sem passos`).toBeGreaterThan(0)
      expect(r.ingredients.every((i) => i.trim().length > 0), `${r.slug} ingrediente vazio`).toBe(true)
      expect(r.steps.every((s) => s.trim().length > 0), `${r.slug} passo vazio`).toBe(true)
    }
  })

  it('cada grupo de saúde tem whyGood e nutrients não vazios', () => {
    for (const g of Object.values(NUTRIENT_GROUPS_BY_CODE)) {
      expect(g.whyGood.length, `${g.code} sem whyGood`).toBeGreaterThan(0)
      expect(g.nutrients.length, `${g.code} sem nutrients`).toBeGreaterThan(0)
    }
  })

  it('as plantas listadas em cada grupo de saúde existem no catálogo', () => {
    for (const g of Object.values(NUTRIENT_GROUPS_BY_CODE)) {
      for (const slug of g.plants) {
        expect(PLANTS_BY_SLUG[slug], `grupo ${g.code} -> ${slug}`).toBeTruthy()
      }
    }
  })

  it('FAQ e glossário têm emoji em todas as entradas', () => {
    for (const f of FAQ) expect(f.emoji.trim().length, `FAQ "${f.q}" sem emoji`).toBeGreaterThan(0)
    for (const t of GLOSSARY) expect(t.emoji.trim().length, `glossário "${t.term}" sem emoji`).toBeGreaterThan(0)
  })

  it('nenhuma planta lista a si própria como companheira ou antagonista', () => {
    for (const p of PLANTS) {
      expect(p.companions.includes(p.slug), `${p.slug} é companheira de si própria`).toBe(false)
      expect(p.antagonists.includes(p.slug), `${p.slug} é antagonista de si própria`).toBe(false)
    }
  })

  it('passos de quiz têm correctIndex dentro do nº de opções', () => {
    for (const l of LESSONS) {
      for (const s of l.steps) {
        if (s.kind === 'choice' || s.kind === 'truefalse') {
          const n = s.options?.length ?? 0
          expect(s.correctIndex, `${l.id}: correctIndex`).toBeGreaterThanOrEqual(0)
          expect(s.correctIndex!, `${l.id}: correctIndex < opções`).toBeLessThan(n)
        }
      }
    }
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
