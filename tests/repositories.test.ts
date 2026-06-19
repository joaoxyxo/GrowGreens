import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '@/lib/db/dexie'
import { plantingsRepo, journalRepo, remindersRepo, challengeRepo, bedsRepo } from '@/repositories'
import { addDaysISO, todayISO } from '@/utils/date'

describe('repositórios (local-first)', () => {
  beforeEach(async () => {
    await Promise.all([
      db.plantings.clear(),
      db.journal.clear(),
      db.reminders.clear(),
      db.challengeRuns.clear(),
      db.beds.clear(),
    ])
  })

  it('cria uma planta e gera lembrete de rega', async () => {
    const p = await plantingsRepo.create({
      plantSlug: 'alface',
      nickname: 'Alface 1',
      location: 'varanda',
      wateringEveryDays: 3,
    })
    expect(p.id).toBeTruthy()
    const plantings = await db.plantings.toArray()
    expect(plantings).toHaveLength(1)
    const reminders = await db.reminders.where('plantingId').equals(p.id).toArray()
    expect(reminders.length).toBe(1)
    expect(reminders[0].type).toBe('rega')
  })

  it('adiciona entradas de diário', async () => {
    const p = await plantingsRepo.create({
      plantSlug: 'rabanete',
      nickname: 'Rabanetes',
      location: 'parapeito',
      wateringEveryDays: 2,
    })
    await journalRepo.add({ plantingId: p.id, type: 'nota', note: 'Primeiras folhas!' })
    const entries = await db.journal.where('plantingId').equals(p.id).toArray()
    expect(entries).toHaveLength(1)
    expect(entries[0].note).toContain('folhas')
  })

  it('completar lembrete recorrente reagenda e regista rega', async () => {
    const p = await plantingsRepo.create({
      plantSlug: 'tomate',
      nickname: 'Tomateiro',
      location: 'varanda',
      wateringEveryDays: 2,
    })
    const r = (await db.reminders.where('plantingId').equals(p.id).toArray())[0]
    await remindersRepo.complete(r.id)
    const after = await db.reminders.get(r.id)
    expect(after?.done).toBe(false) // recorrente: reagendado
    // Reagenda a partir da data de conclusão (hoje), não da data anterior.
    expect(after?.dueAt).toBe(addDaysISO(todayISO(), 2))
    const journal = await db.journal.where('plantingId').equals(p.id).toArray()
    expect(journal.some((e) => e.type === 'rega')).toBe(true)
  })

  it('avança o desafio dos microgreens e termina ao dia 7', async () => {
    const run = await challengeRepo.start('rabanete')
    await challengeRepo.completeDay(run.id, 0)
    await challengeRepo.completeDay(run.id, 7)
    const updated = await challengeRepo.get(run.id)
    expect(updated?.finished).toBe(true)
    expect(updated?.completedDays).toContain(0)
    expect(updated?.completedDays).toContain(7)
  })

  it('planeador: cria espaço, planta numa célula e limpa', async () => {
    const bed = await bedsRepo.create({ name: 'Canteiro 1', kind: 'canteiro', rows: 3, cols: 4 })
    expect(bed.rows).toBe(3)
    await bedsRepo.setCell(bed.id, '0-0', { plantSlug: 'alface' })
    await bedsRepo.setCell(bed.id, '1-2', { plantSlug: 'tomate' })
    let saved = await bedsRepo.get(bed.id)
    expect(Object.keys(saved!.cells)).toHaveLength(2)
    expect(saved!.cells['0-0'].plantSlug).toBe('alface')
    await bedsRepo.clearCell(bed.id, '0-0')
    saved = await bedsRepo.get(bed.id)
    expect(Object.keys(saved!.cells)).toHaveLength(1)
  })

  it('planeador: limita o tamanho da grelha (1-12)', async () => {
    const bed = await bedsRepo.create({ name: 'X', kind: 'vaso', rows: 99, cols: 0 })
    expect(bed.rows).toBeLessThanOrEqual(12)
    expect(bed.cols).toBeGreaterThanOrEqual(1)
  })

  it('marcar planta como colhida conclui os lembretes pendentes', async () => {
    const p = await plantingsRepo.create({
      plantSlug: 'alface',
      nickname: 'Alface',
      location: 'varanda',
      wateringEveryDays: 3,
    })
    let pendentes = (await db.reminders.where('plantingId').equals(p.id).toArray()).filter((r) => !r.done)
    expect(pendentes.length).toBe(1)
    await plantingsRepo.update(p.id, { status: 'colhida' })
    pendentes = (await db.reminders.where('plantingId').equals(p.id).toArray()).filter((r) => !r.done)
    expect(pendentes.length).toBe(0)
  })

  it('remover planta apaga diário e lembretes', async () => {
    const p = await plantingsRepo.create({
      plantSlug: 'rucula',
      nickname: 'Rúcula',
      location: 'varanda',
      wateringEveryDays: 2,
    })
    await journalRepo.add({ plantingId: p.id, type: 'nota', note: 'teste' })
    await plantingsRepo.remove(p.id)
    expect(await db.plantings.count()).toBe(0)
    expect(await db.journal.count()).toBe(0)
    expect(await db.reminders.count()).toBe(0)
  })
})
