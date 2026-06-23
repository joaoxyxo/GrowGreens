// ---- Tipos de domínio do utilizador (guardados localmente em Dexie) ----

// Estados de uma planta na horta. Fonte única de verdade (evita magic strings).
export const PLANTING_STATUS = {
  ACTIVE: 'ativa',
  HARVESTED: 'colhida',
  LOST: 'perdida',
} as const
export type PlantingStatus = (typeof PLANTING_STATUS)[keyof typeof PLANTING_STATUS]
export type JournalEventType = 'nota' | 'rega' | 'aduba' | 'transplante' | 'colheita' | 'foto'
export type ReminderType = 'rega' | 'aduba' | 'tarefa'

export interface Planting {
  id: string
  plantSlug: string
  nickname: string
  location: string
  sownAt: string // ISO date
  status: PlantingStatus
  wateringEveryDays: number
  createdAt: string
  updatedAt: string
}

export interface JournalEntry {
  id: string
  plantingId: string
  type: JournalEventType
  note: string
  photo?: Blob
  createdAt: string
}

export interface Reminder {
  id: string
  plantingId: string
  type: ReminderType
  label: string
  dueAt: string // ISO date
  done: boolean
  recurrenceDays?: number
  createdAt: string
}

// ---- Planeador de horta (espelho digital do espaço real) ----
export type BedKind = 'canteiro' | 'vaso' | 'tabuleiro' | 'estufa'

export interface BedCell {
  plantSlug: string
  plantingId?: string // ligação a uma planta acompanhada na horta
  note?: string
}

export interface GardenBed {
  id: string
  name: string
  kind: BedKind
  rows: number
  cols: number
  cells: Record<string, BedCell> // chave "linha-coluna", ex.: "0-2"
  createdAt: string
  updatedAt: string
}

export interface ChallengeRun {
  id: string
  varietySlug: string
  startedAt: string // ISO date (Dia 0)
  completedDays: number[] // dias marcados como feitos (0-7)
  photos: { day: number; blob: Blob }[]
  finished: boolean
  finishedAt?: string
}

export interface Achievement {
  code: string
  unlockedAt: string
}

export interface ProgressState {
  xp: number
  streak: number
  lastActiveDay: string // YYYY-MM-DD
  completedLessons: string[]
  achievements: Achievement[]
  freezes: number // proteções de sequência disponíveis
  freezeRefillAt: string // YYYY-MM-DD a partir de quando repõe 1 freeze
}

export interface SettingsState {
  onboardingComplete: boolean
  profileName: string
  zoneCode: string
  goal: string
  space: string
  experience: string
  theme: 'system' | 'light' | 'dark'
  notificationsEnabled: boolean
}
