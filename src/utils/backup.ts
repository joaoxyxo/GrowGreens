import { db } from '@/lib/db/dexie'

// Backup/exportação dos dados locais do utilizador. As fotos (Blob) não são
// serializáveis em JSON, por isso são omitidas do backup.
export interface BackupData {
  version: number
  exportedAt: string
  plantings: unknown[]
  journal: unknown[]
  reminders: unknown[]
  challengeRuns: unknown[]
  beds: unknown[]
  meta: unknown[]
}

export async function exportData(): Promise<BackupData> {
  const [plantings, journal, reminders, challengeRuns, beds, meta] = await Promise.all([
    db.plantings.toArray(),
    db.journal.toArray(),
    db.reminders.toArray(),
    db.challengeRuns.toArray(),
    db.beds.toArray(),
    db.meta.toArray(),
  ])
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    plantings,
    // photo/photos são Blobs (não serializáveis): undefined é omitido pelo JSON.stringify.
    journal: journal.map((e) => ({ ...e, photo: undefined })),
    reminders,
    challengeRuns: challengeRuns.map((r) => ({ ...r, photos: undefined })),
    beds,
    meta,
  }
}

export function downloadBackup(data: BackupData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'growgreens-backup.json'
  a.click()
  URL.revokeObjectURL(url)
}

/** Apaga TODOS os dados locais do utilizador (irreversível). */
export async function clearAllData(): Promise<void> {
  const tables = [db.plantings, db.journal, db.reminders, db.challengeRuns, db.beds, db.meta]
  await db.transaction('rw', tables, async () => {
    await Promise.all(tables.map((t) => t.clear()))
  })
}
