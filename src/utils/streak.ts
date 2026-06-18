// Lógica pura de sequência (streak) com proteção (freeze), testável isoladamente.

function daysBetweenKeys(a: string, b: string): number {
  if (!a) return Infinity
  const da = new Date(a + 'T00:00:00')
  const db = new Date(b + 'T00:00:00')
  return Math.round((db.getTime() - da.getTime()) / 86400000)
}

export interface StreakState {
  streak: number
  lastActiveDay: string
  freezes: number
  freezeRefillAt: string
}

const MAX_FREEZES = 1
const FREEZE_REFILL_DAYS = 7

function addDaysKey(key: string, days: number): string {
  const d = new Date(key + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * Atualiza a sequência ao registar atividade em `today`.
 * - Mesmo dia: sem alteração.
 * - 1 dia de intervalo: continua (+1).
 * - 2 dias (faltou 1 dia) com freeze disponível: consome freeze e continua (+1).
 * - Caso contrário: reinicia a 1.
 * Repõe 1 freeze quando `today` >= freezeRefillAt.
 */
export function applyActivity(prev: StreakState, today: string): StreakState {
  let { streak, freezes, freezeRefillAt } = prev

  // Repor freeze se passou o período
  if (freezeRefillAt && daysBetweenKeys(freezeRefillAt, today) >= 0 && freezes < MAX_FREEZES) {
    freezes = MAX_FREEZES
    freezeRefillAt = ''
  }

  if (prev.lastActiveDay === today) {
    return { streak: Math.max(streak, 1), lastActiveDay: today, freezes, freezeRefillAt }
  }

  const gap = daysBetweenKeys(prev.lastActiveDay, today)
  if (gap === 1) {
    streak += 1
  } else if (gap === 2 && freezes > 0) {
    freezes -= 1
    freezeRefillAt = addDaysKey(today, FREEZE_REFILL_DAYS)
    streak += 1
  } else {
    streak = 1
  }

  return { streak, lastActiveDay: today, freezes, freezeRefillAt }
}
