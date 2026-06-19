import { liveQuery } from 'dexie'
import { ref, type Ref } from 'vue'
import { db } from '@/lib/db/dexie'
import type { Reminder } from '@/types/models'

// Subscrição única partilhada por toda a app — evita várias live queries
// idênticas de `db.reminders` (Home, Horta, Planeador usam a mesma lista).
let shared: Ref<Reminder[]> | null = null

/** Live query partilhada de todos os lembretes. */
export function useReminders(): Ref<Reminder[]> {
  if (!shared) {
    const value = ref<Reminder[]>([])
    liveQuery(() => db.reminders.toArray()).subscribe({
      next: (r) => {
        value.value = r
      },
      error: (e) => console.error('[useReminders]', e),
    })
    shared = value
  }
  return shared
}
