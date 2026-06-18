import Dexie, { type Table } from 'dexie'
import type { Planting, JournalEntry, Reminder, ChallengeRun, GardenBed } from '@/types/models'

export interface MetaRecord {
  key: string
  value: unknown
}

export class GrowGreensDB extends Dexie {
  plantings!: Table<Planting, string>
  journal!: Table<JournalEntry, string>
  reminders!: Table<Reminder, string>
  challengeRuns!: Table<ChallengeRun, string>
  beds!: Table<GardenBed, string>
  meta!: Table<MetaRecord, string>

  constructor() {
    super('growgreens')
    this.version(1).stores({
      plantings: 'id, plantSlug, status, updatedAt',
      journal: 'id, plantingId, createdAt',
      reminders: 'id, plantingId, dueAt, done',
      challengeRuns: 'id, startedAt, finished',
      meta: 'key',
    })
    // v2: planeador de horta (espelho digital)
    this.version(2).stores({
      beds: 'id, updatedAt',
    })
  }
}

export const db = new GrowGreensDB()

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}
