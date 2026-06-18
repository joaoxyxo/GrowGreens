// Lógica pura do desafio de microgreens (7 dias), testável isoladamente.

export type ChallengeDayState = 'done' | 'today' | 'locked' | 'available'

export const CHALLENGE_LAST_DAY = 7

/**
 * Dia mais avançado desbloqueado. Os dias abrem com o tempo real de calendário
 * (currentDay) OU à medida que se concluem passos (maxCompleted + 1) — o que for
 * maior — para se poder avançar ao próprio ritmo sem esperar 7 dias.
 */
export function computeUnlockedDay(currentDay: number, completedDays: number[]): number {
  const maxCompleted = completedDays.length ? Math.max(...completedDays) : -1
  return Math.min(CHALLENGE_LAST_DAY, Math.max(currentDay, maxCompleted + 1))
}

/** Estado de um dia do desafio, dado o dia desbloqueado e os dias concluídos. */
export function challengeDayState(
  day: number,
  unlockedDay: number,
  completedDays: number[],
): ChallengeDayState {
  if (completedDays.includes(day)) return 'done'
  if (day < unlockedDay) return 'available'
  if (day === unlockedDay) return 'today'
  return 'locked'
}
