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
    const r = (await db.reminders.where('plantingId').equals(p.id).toArray()).find((x) => x.type === 'rega')!
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

  it('snooze adia o lembrete para hoje + N dias e reativa-o', async () => {
    const p = await plantingsRepo.create({
      plantSlug: 'alface',
      nickname: 'Alface',
      location: 'varanda',
      wateringEveryDays: 3,
    })
    const r = (await db.reminders.where('plantingId').equals(p.id).toArray())[0]
    await remindersRepo.snooze(r.id, 5)
    const after = await db.reminders.get(r.id)
    expect(after?.done).toBe(false)
    expect(after?.dueAt).toBe(addDaysISO(todayISO(), 5))
  })

  it('journalRepo.add rejeita plantingId inexistente', async () => {
    await expect(journalRepo.add({ plantingId: 'nao-existe', type: 'nota', note: 'x' })).rejects.toThrow()
  })

  it('marcar planta como perdida regista nota no diário', async () => {
    const p = await plantingsRepo.create({
      plantSlug: 'rucula',
      nickname: 'Rúcula',
      location: 'varanda',
      wateringEveryDays: 2,
    })
    await plantingsRepo.update(p.id, { status: 'perdida' })
    const journal = await db.journal.where('plantingId').equals(p.id).toArray()
    expect(journal.some((e) => e.note.includes('perdida'))).toBe(true)
  })

  it('marca todos os lembretes de uma planta como feitos', async () => {
    const p = await plantingsRepo.create({
      plantSlug: 'tomate',
      nickname: 'Tomateiro',
      location: 'varanda',
      wateringEveryDays: 2,
    })
    // tomate cria lembrete de rega + adubação (ambos pendentes)
    let pend = (await db.reminders.where('plantingId').equals(p.id).toArray()).filter((r) => !r.done)
    expect(pend.length).toBeGreaterThanOrEqual(2)
    await remindersRepo.completeAllForPlanting(p.id)
    pend = (await db.reminders.where('plantingId').equals(p.id).toArray()).filter((r) => !r.done)
    expect(pend).toHaveLength(0)
  })

  it('planeador: setCell ignora chaves fora da grelha', async () => {
    const bed = await bedsRepo.create({ name: 'C', kind: 'canteiro', rows: 3, cols: 3 })
    await bedsRepo.setCell(bed.id, '5-5', { plantSlug: 'alface' }) // fora da grelha 3x3
    await bedsRepo.setCell(bed.id, '1-1', { plantSlug: 'tomate' }) // válida
    const saved = await bedsRepo.get(bed.id)
    expect(saved!.cells['5-5']).toBeUndefined()
    expect(saved!.cells['1-1']).toBeTruthy()
  })

  it('planeador: clearCell remove a célula correta', async () => {
    const bed = await bedsRepo.create({ name: 'C', kind: 'canteiro', rows: 3, cols: 3 })
    await bedsRepo.setCell(bed.id, '0-0', { plantSlug: 'alface' })
    await bedsRepo.setCell(bed.id, '1-1', { plantSlug: 'tomate' })
    await bedsRepo.clearCell(bed.id, '0-0')
    const saved = await bedsRepo.get(bed.id)
    expect(saved!.cells['0-0']).toBeUndefined()
    expect(saved!.cells['1-1'].plantSlug).toBe('tomate')
  })

  it('planeador: limita o tamanho da grelha (1-12)', async () => {
    const bed = await bedsRepo.create({ name: 'X', kind: 'vaso', rows: 99, cols: 0 })
    expect(bed.rows).toBeLessThanOrEqual(12)
    expect(bed.cols).toBeGreaterThanOrEqual(1)
  })

  it('cria lembrete de adubação para plantas de fruto, mas não para folhas', async () => {
    const tomate = await plantingsRepo.create({
      plantSlug: 'tomate',
      nickname: 'Tomateiro',
      location: 'varanda',
      wateringEveryDays: 2,
    })
    const rsTomate = await db.reminders.where('plantingId').equals(tomate.id).toArray()
    expect(rsTomate.some((r) => r.type === 'aduba')).toBe(true)

    const alface = await plantingsRepo.create({
      plantSlug: 'alface',
      nickname: 'Alface',
      location: 'varanda',
      wateringEveryDays: 3,
    })
    const rsAlface = await db.reminders.where('plantingId').equals(alface.id).toArray()
    expect(rsAlface.some((r) => r.type === 'aduba')).toBe(false)
  })

  it('completar lembrete NÃO recorrente marca done=true', async () => {
    const p = await plantingsRepo.create({
      plantSlug: 'alface',
      nickname: 'Alface',
      location: 'varanda',
      wateringEveryDays: 3,
    })
    const r = (await db.reminders.where('plantingId').equals(p.id).toArray())[0]
    await db.reminders.update(r.id, { recurrenceDays: undefined }) // torna não-recorrente
    await remindersRepo.complete(r.id)
    expect((await db.reminders.get(r.id))?.done).toBe(true)
  })

  it('plantingsRepo.all exclui plantas perdidas', async () => {
    const p = await plantingsRepo.create({
      plantSlug: 'rucula',
      nickname: 'Rúcula',
      location: 'varanda',
      wateringEveryDays: 2,
    })
    await plantingsRepo.update(p.id, { status: 'perdida' })
    const all = await plantingsRepo.all()
    expect(all.find((x) => x.id === p.id)).toBeUndefined()
  })

  it('update clampa wateringEveryDays a ≥ 1', async () => {
    const p = await plantingsRepo.create({
      plantSlug: 'alface',
      nickname: 'Alface',
      location: 'varanda',
      wateringEveryDays: 3,
    })
    await plantingsRepo.update(p.id, { wateringEveryDays: 0 })
    expect((await plantingsRepo.get(p.id))?.wateringEveryDays).toBeGreaterThanOrEqual(1)
  })

  it('saneia nickname vazio e intervalo de rega inválido ao criar', async () => {
    const p = await plantingsRepo.create({
      plantSlug: 'rucula',
      nickname: '   ',
      location: 'varanda',
      wateringEveryDays: 0,
    })
    expect(p.nickname).toBe('rucula') // fallback para o slug
    expect(p.wateringEveryDays).toBeGreaterThanOrEqual(1)
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

  it('marcar planta como colhida regista um marco no diário', async () => {
    const p = await plantingsRepo.create({
      plantSlug: 'rabanete',
      nickname: 'Rabanetes',
      location: 'parapeito',
      wateringEveryDays: 2,
    })
    await plantingsRepo.update(p.id, { status: 'colhida' })
    const journal = await db.journal.where('plantingId').equals(p.id).toArray()
    expect(journal.some((e) => e.type === 'colheita')).toBe(true)
  })

  it('challengeRepo.reset apaga o run', async () => {
    const run = await challengeRepo.start('rabanete')
    await challengeRepo.completeDay(run.id, 0)
    await challengeRepo.reset(run.id)
    expect(await challengeRepo.get(run.id)).toBeUndefined()
    expect(await challengeRepo.current()).toBeUndefined()
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
