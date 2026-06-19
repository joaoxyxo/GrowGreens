import { db, newId } from '@/lib/db/dexie'
import type {
  Planting,
  JournalEntry,
  Reminder,
  ChallengeRun,
  JournalEventType,
  GardenBed,
  BedKind,
  BedCell,
} from '@/types/models'
import { todayISO, addDaysISO } from '@/utils/date'
import { getPlant } from '@/data/plants'

// ---------- Plantings ----------
export const plantingsRepo = {
  all: () => db.plantings.where('status').notEqual('perdida').reverse().sortBy('updatedAt'),
  active: () => db.plantings.where('status').equals('ativa').toArray(),
  get: (id: string) => db.plantings.get(id),
  async create(data: {
    plantSlug: string
    nickname: string
    location: string
    sownAt?: string
    wateringEveryDays: number
  }): Promise<Planting> {
    const now = todayISO()
    // Saneamento: nome com fallback e intervalo de rega válido (≥ 1 dia).
    const nickname = data.nickname.trim() || data.plantSlug
    const wateringEveryDays = Math.max(1, Math.round(data.wateringEveryDays) || 1)
    const planting: Planting = {
      id: newId(),
      plantSlug: data.plantSlug,
      nickname,
      location: data.location,
      sownAt: data.sownAt ?? now,
      status: 'ativa',
      wateringEveryDays,
      createdAt: now,
      updatedAt: now,
    }
    await db.plantings.add(planting)
    // primeiro lembrete de rega
    await remindersRepo.create({
      plantingId: planting.id,
      type: 'rega',
      label: `Regar ${planting.nickname}`,
      dueAt: addDaysISO(now, wateringEveryDays),
      recurrenceDays: wateringEveryDays,
    })
    // Plantas de fruto são gulosas: lembrete de adubação periódica (cada ~3 semanas).
    if (getPlant(data.plantSlug)?.category === 'fruto') {
      await remindersRepo.create({
        plantingId: planting.id,
        type: 'aduba',
        label: `Adubar ${nickname}`,
        dueAt: addDaysISO(now, 21),
        recurrenceDays: 21,
      })
    }
    return planting
  },
  async update(id: string, patch: Partial<Planting>) {
    // Clamp do intervalo de rega também na edição (≥ 1 dia).
    if (patch.wateringEveryDays !== undefined) {
      patch = { ...patch, wateringEveryDays: Math.max(1, Math.round(patch.wateringEveryDays) || 1) }
    }
    await db.transaction('rw', db.plantings, db.reminders, db.journal, async () => {
      await db.plantings.update(id, { ...patch, updatedAt: todayISO() })
      // Planta colhida ou perdida: já não faz sentido continuar a lembrar de a regar.
      if (patch.status === 'colhida' || patch.status === 'perdida') {
        const pending = await db.reminders.where('plantingId').equals(id).toArray()
        for (const r of pending) {
          if (!r.done) await db.reminders.update(r.id, { done: true, recurrenceDays: undefined })
        }
      }
      // Marco automático no diário ao mudar de estado.
      if (patch.status === 'colhida') {
        await db.journal.add({
          id: newId(),
          plantingId: id,
          type: 'colheita',
          note: 'Colheita registada. 🧺',
          createdAt: new Date().toISOString(),
        })
      } else if (patch.status === 'perdida') {
        await db.journal.add({
          id: newId(),
          plantingId: id,
          type: 'nota',
          note: 'Planta dada como perdida.',
          createdAt: new Date().toISOString(),
        })
      }
    })
  },
  async remove(id: string) {
    await db.transaction('rw', db.plantings, db.journal, db.reminders, async () => {
      await db.journal.where('plantingId').equals(id).delete()
      await db.reminders.where('plantingId').equals(id).delete()
      await db.plantings.delete(id)
    })
  },
}

// ---------- Journal ----------
export const journalRepo = {
  forPlanting: (plantingId: string) =>
    db.journal.where('plantingId').equals(plantingId).reverse().sortBy('createdAt'),
  async add(data: {
    plantingId: string
    type: JournalEventType
    note: string
    photo?: Blob
  }): Promise<JournalEntry> {
    // Garante que a planta existe antes de registar no diário (integridade).
    const planting = await db.plantings.get(data.plantingId)
    if (!planting) throw new Error(`Planta inexistente: ${data.plantingId}`)
    const entry: JournalEntry = {
      id: newId(),
      plantingId: data.plantingId,
      type: data.type,
      note: data.note,
      photo: data.photo,
      createdAt: new Date().toISOString(),
    }
    await db.journal.add(entry)
    await db.plantings.update(data.plantingId, { updatedAt: todayISO() })
    return entry
  },
  remove: (id: string) => db.journal.delete(id),
}

// ---------- Reminders ----------
export const remindersRepo = {
  all: () => db.reminders.toArray(),
  pending: () => db.reminders.filter((r) => !r.done).toArray(),
  async create(data: {
    plantingId: string
    type: Reminder['type']
    label: string
    dueAt: string
    recurrenceDays?: number
  }): Promise<Reminder> {
    const reminder: Reminder = {
      id: newId(),
      plantingId: data.plantingId,
      type: data.type,
      label: data.label,
      dueAt: data.dueAt,
      done: false,
      recurrenceDays: data.recurrenceDays,
      createdAt: new Date().toISOString(),
    }
    await db.reminders.add(reminder)
    return reminder
  },
  async complete(id: string) {
    const reminder = await db.reminders.get(id)
    if (!reminder) return
    if (reminder.type === 'rega') {
      await journalRepo.add({
        plantingId: reminder.plantingId,
        type: 'rega',
        note: 'Reguei (via lembrete).',
      })
    }
    if (reminder.recurrenceDays) {
      // reagenda
      await db.reminders.update(id, {
        dueAt: addDaysISO(todayISO(), reminder.recurrenceDays),
        done: false,
      })
    } else {
      await db.reminders.update(id, { done: true })
    }
  },
  // Adia um lembrete por `days` dias a partir de hoje (reativa-o).
  async snooze(id: string, days: number) {
    await db.reminders.update(id, { dueAt: addDaysISO(todayISO(), Math.max(1, days)), done: false })
  },
  // Marca todos os lembretes pendentes de uma planta como feitos (não reagenda).
  async completeAllForPlanting(plantingId: string) {
    const reminders = await db.reminders.where('plantingId').equals(plantingId).toArray()
    await Promise.all(
      reminders.filter((r) => !r.done).map((r) => db.reminders.update(r.id, { done: true, recurrenceDays: undefined })),
    )
  },
  remove: (id: string) => db.reminders.delete(id),
}

// ---------- Challenge ----------
export const challengeRepo = {
  current: async (): Promise<ChallengeRun | undefined> => {
    const runs = await db.challengeRuns.toArray()
    return runs.find((r) => !r.finished) ?? runs.sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0]
  },
  get: (id: string) => db.challengeRuns.get(id),
  async start(varietySlug: string): Promise<ChallengeRun> {
    const run: ChallengeRun = {
      id: newId(),
      varietySlug,
      startedAt: todayISO(),
      completedDays: [],
      photos: [],
      finished: false,
    }
    await db.challengeRuns.add(run)
    return run
  },
  async completeDay(id: string, day: number, photo?: Blob) {
    const run = await db.challengeRuns.get(id)
    if (!run) return
    const days = new Set(run.completedDays)
    days.add(day)
    const photos = photo ? [...run.photos, { day, blob: photo }] : run.photos
    const finished = day >= 7
    await db.challengeRuns.update(id, {
      completedDays: [...days].sort((a, b) => a - b),
      photos,
      finished: finished || run.finished,
      finishedAt: finished ? new Date().toISOString() : run.finishedAt,
    })
  },
  reset: (id: string) => db.challengeRuns.delete(id),
}

// ---------- Beds (planeador de horta) ----------
export const bedsRepo = {
  all: () => db.beds.reverse().sortBy('updatedAt'),
  get: (id: string) => db.beds.get(id),
  async create(data: { name: string; kind: BedKind; rows: number; cols: number }): Promise<GardenBed> {
    const now = todayISO()
    const bed: GardenBed = {
      id: newId(),
      name: data.name,
      kind: data.kind,
      rows: Math.max(1, Math.min(12, data.rows)),
      cols: Math.max(1, Math.min(12, data.cols)),
      cells: {},
      createdAt: now,
      updatedAt: now,
    }
    await db.beds.add(bed)
    return bed
  },
  async update(id: string, patch: Partial<GardenBed>) {
    await db.beds.update(id, { ...patch, updatedAt: todayISO() })
  },
  async setCell(id: string, key: string, cell: BedCell) {
    const bed = await db.beds.get(id)
    if (!bed) return
    // Ignora chaves fora da grelha (formato "linha-coluna" dentro de rows/cols).
    const [r, c] = key.split('-').map(Number)
    if (!Number.isInteger(r) || !Number.isInteger(c) || r < 0 || c < 0 || r >= bed.rows || c >= bed.cols) {
      return
    }
    bed.cells[key] = cell
    await db.beds.update(id, { cells: bed.cells, updatedAt: todayISO() })
  },
  async clearCell(id: string, key: string) {
    const bed = await db.beds.get(id)
    if (!bed) return
    delete bed.cells[key]
    await db.beds.update(id, { cells: bed.cells, updatedAt: todayISO() })
  },
  remove: (id: string) => db.beds.delete(id),
}
