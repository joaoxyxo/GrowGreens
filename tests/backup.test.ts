import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '@/lib/db/dexie'
import { plantingsRepo, journalRepo } from '@/repositories'
import { exportData, clearAllData } from '@/utils/backup'

describe('backup — exportar e apagar dados', () => {
  beforeEach(async () => {
    await Promise.all([
      db.plantings.clear(),
      db.journal.clear(),
      db.reminders.clear(),
      db.challengeRuns.clear(),
      db.beds.clear(),
      db.meta.clear(),
    ])
  })

  it('exportData inclui plantings, journal e reminders', async () => {
    const p = await plantingsRepo.create({
      plantSlug: 'alface',
      nickname: 'Alface',
      location: 'varanda',
      wateringEveryDays: 3,
    })
    await journalRepo.add({ plantingId: p.id, type: 'nota', note: 'oi' })
    const data = await exportData()
    expect(data.version).toBe(1)
    expect(data.plantings).toHaveLength(1)
    expect(data.journal).toHaveLength(1)
    expect(data.reminders.length).toBeGreaterThanOrEqual(1)
    // a foto (Blob) é omitida do backup
    expect((data.journal[0] as Record<string, unknown>).photo).toBeUndefined()
  })

  it('clearAllData apaga todas as tabelas', async () => {
    await plantingsRepo.create({
      plantSlug: 'rucula',
      nickname: 'Rúcula',
      location: 'varanda',
      wateringEveryDays: 2,
    })
    await clearAllData()
    expect(await db.plantings.count()).toBe(0)
    expect(await db.reminders.count()).toBe(0)
    expect(await db.journal.count()).toBe(0)
  })
})
