// ---- Tipos do catálogo (dados estáticos, só de leitura) ----

/** Categoria botânica/culinária da planta (usada para filtros e agrupamentos). */
export type PlantCategory =
  | 'folha'
  | 'brassica'
  | 'raiz'
  | 'fruto'
  | 'leguminosa'
  | 'aromatica'
  | 'microgreen'

/** Nível de dificuldade para principiantes. */
export type Difficulty = 'facil' | 'medio' | 'dificil'
/** Onde a cultura se dá: só interior, só exterior, ou ambos. */
export type GrowLocation = 'interior' | 'exterior' | 'ambos'
/** Método de propagação recomendado. */
export type SowingMethod = 'sementeira_direta' | 'transplante' | 'ambos' | 'bolbo'
/** Exposição solar necessária. */
export type SunExposure = 'sol_pleno' | 'meia_sombra' | 'sombra'
export type WaterNeed = 'baixa' | 'moderada' | 'alta'
export type PollinationType = 'autofertil' | 'vento' | 'insetos' | 'manual' | 'nao_aplicavel'
export type Season = 'primavera' | 'verao' | 'outono' | 'inverno'

export type GrowthStageCode =
  | 'germinacao'
  | 'plantula'
  | 'vegetativo'
  | 'floracao'
  | 'frutificacao'
  | 'colheita'

export interface PlantStageGuide {
  stage: GrowthStageCode
  durationDays?: [number, number]
  text: string
}

export interface Plant {
  slug: string
  name: string
  scientificName: string
  family: string
  category: PlantCategory
  emoji: string
  difficulty: Difficulty
  location: GrowLocation
  beginnerFriendly: boolean
  isMicrogreen?: boolean

  daysToHarvest: [number, number]
  daysToGerminate?: [number, number]
  /** Temperatura base (°C) para o cálculo de graus-dia. Omisso → default por categoria. */
  baseTempC?: number
  sowingMethod: SowingMethod
  sunExposure: SunExposure
  sunHoursMin: number
  waterNeed: WaterNeed
  phRange: [number, number]
  sowingDepthCm: number
  spacingCm: number
  potVolumeL: number
  frostTolerant: boolean

  // Adições de especialista
  indoorViabilityBySeason: Record<Season, 'bom' | 'possivel' | 'evitar'>
  needsSupplementalLight: boolean
  pollination: PollinationType

  // Segurança
  edibleParts: string
  toxicNote?: string
  petSafe: boolean

  // Texto
  shortDescription: string
  in30Seconds: string[]
  growingTips: string
  wateringNotes: string
  feedingNotes: string
  harvestNotes: string
  portugalNotes: string
  expectations: string
  commonMistake: string

  stages: PlantStageGuide[]

  // Relações (por slug / id)
  companions: string[]
  antagonists: string[]
  pests: string[]
  diseases: string[]
  nutrientGroup: string
  recipes: string[]
}

export interface MicrogreenInfo {
  slug: string
  name: string
  emoji: string
  soakHours: number
  blackoutDays: [number, number]
  daysToHarvest: [number, number]
  flavour: string
  beginner: boolean
  note: string
}

export type CalendarAction =
  | 'sementeira_interior'
  | 'sementeira_direta'
  | 'transplante'
  | 'colheita'

export interface CalendarEntry {
  plant: string // slug
  zone: string // zone code
  months: number[] // 1-12
  action: CalendarAction
}

export interface ClimateZone {
  code: string
  name: string
  description: string
  lastFrostMonth: number
  firstFrostMonth: number
}

export type CompanionRelation = 'benefica' | 'prejudicial'

export interface Companion {
  plant: string
  companion: string
  relation: CompanionRelation
  reason: string
}

export interface Pest {
  slug: string
  name: string
  emoji: string
  description: string
  symptoms: string
  prevention: string
  treatment: string
}

export interface Disease {
  slug: string
  name: string
  emoji: string
  isFungal: boolean
  description: string
  symptoms: string
  prevention: string
  treatment: string
}

export interface NutrientGroup {
  code: string
  name: string
  emoji: string
  plants: string[]
  whyGood: string[]
  nutrients: { nutrient: string; effect: string }[]
  tip: string
  caution?: string
}

export interface Recipe {
  slug: string
  title: string
  emoji: string
  description: string
  prepMinutes: number
  difficulty: Difficulty
  season: Season[]
  ingredients: string[]
  steps: string[]
  plants: string[]
}

// ---- Curso ----

export type LessonStepKind =
  | 'concept'
  | 'choice'
  | 'truefalse'
  | 'order'
  | 'summary'

export interface LessonStep {
  kind: LessonStepKind
  title?: string
  body?: string
  emoji?: string
  // para choice / truefalse
  question?: string
  options?: string[]
  correctIndex?: number
  explanation?: string
  // para order
  items?: string[]
  correctOrder?: number[]
  // para summary
  bullets?: string[]
}

export interface Lesson {
  id: string
  unitId: string
  title: string
  subtitle: string
  xp: number
  steps: LessonStep[]
}

export interface CourseUnit {
  id: string
  order: number
  title: string
  description: string
  emoji: string
  color: string
  lessonIds: string[]
}

// ---- Desafio microgreens ----

export interface ChallengeDay {
  day: number
  phase: string
  title: string
  show: string
  tell: string
  tasks: string[]
  warning: string
  askPhoto: boolean
}
