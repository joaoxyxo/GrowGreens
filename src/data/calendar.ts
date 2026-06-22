import type { ClimateZone, CalendarEntry } from '@/types/catalog'

export const CLIMATE_ZONES: ClimateZone[] = [
  {
    code: 'litoral_norte',
    name: 'Litoral Norte (Ovar/Aveiro)',
    description: 'Clima atlântico ameno e húmido. Invernos suaves, verões frescos. Risco principal: fungos.',
    lastFrostMonth: 3,
    firstFrostMonth: 12,
  },
  {
    code: 'interior_norte',
    name: 'Interior Norte e Centro',
    description: 'Invernos mais frios com geada até meados de abril; verões quentes.',
    lastFrostMonth: 4,
    firstFrostMonth: 11,
  },
  {
    code: 'litoral_sul',
    name: 'Litoral Sul e Alentejo',
    description: 'Verões quentes e secos, invernos amenos. Geada rara no litoral.',
    lastFrostMonth: 2,
    firstFrostMonth: 12,
  },
]

export const CLIMATE_ZONES_BY_CODE: Record<string, ClimateZone> = Object.fromEntries(
  CLIMATE_ZONES.map((z) => [z.code, z]),
)

// Calendário para a zona Litoral Norte (Ovar/Aveiro).
// Meses: 1=Jan ... 12=Dez.
export const CALENDAR: CalendarEntry[] = [
  // Folhas
  { plant: 'alface', zone: 'litoral_norte', action: 'sementeira_direta', months: [3, 4, 5, 8, 9] },
  { plant: 'alface', zone: 'litoral_norte', action: 'transplante', months: [4, 5, 9, 10] },
  { plant: 'alface', zone: 'litoral_norte', action: 'colheita', months: [5, 6, 7, 10, 11] },
  { plant: 'rucula', zone: 'litoral_norte', action: 'sementeira_direta', months: [3, 4, 5, 8, 9, 10] },
  { plant: 'rucula', zone: 'litoral_norte', action: 'colheita', months: [4, 5, 6, 9, 10, 11] },
  { plant: 'espinafre', zone: 'litoral_norte', action: 'sementeira_direta', months: [2, 3, 9, 10] },
  { plant: 'espinafre', zone: 'litoral_norte', action: 'colheita', months: [4, 5, 11, 12, 1] },
  // Brássicas
  { plant: 'rabanete', zone: 'litoral_norte', action: 'sementeira_direta', months: [3, 4, 5, 6, 7, 8, 9] },
  { plant: 'rabanete', zone: 'litoral_norte', action: 'colheita', months: [4, 5, 6, 7, 8, 9, 10] },
  { plant: 'brocolos', zone: 'litoral_norte', action: 'sementeira_interior', months: [7, 8] },
  { plant: 'brocolos', zone: 'litoral_norte', action: 'transplante', months: [8, 9] },
  { plant: 'brocolos', zone: 'litoral_norte', action: 'colheita', months: [11, 12, 1, 2] },
  { plant: 'couve-galega', zone: 'litoral_norte', action: 'sementeira_interior', months: [4, 5, 7, 8] },
  { plant: 'couve-galega', zone: 'litoral_norte', action: 'transplante', months: [5, 6, 8, 9] },
  { plant: 'couve-galega', zone: 'litoral_norte', action: 'colheita', months: [9, 10, 11, 12, 1, 2, 3] },
  // Raízes
  { plant: 'cenoura', zone: 'litoral_norte', action: 'sementeira_direta', months: [3, 4, 8, 9] },
  { plant: 'cenoura', zone: 'litoral_norte', action: 'colheita', months: [6, 7, 11, 12] },
  { plant: 'beterraba', zone: 'litoral_norte', action: 'sementeira_direta', months: [3, 4, 5, 8, 9] },
  { plant: 'beterraba', zone: 'litoral_norte', action: 'colheita', months: [6, 7, 10, 11] },
  { plant: 'alho', zone: 'litoral_norte', action: 'sementeira_direta', months: [10, 11] },
  { plant: 'alho', zone: 'litoral_norte', action: 'colheita', months: [6, 7] },
  { plant: 'cebola', zone: 'litoral_norte', action: 'transplante', months: [10, 11, 2, 3] },
  { plant: 'cebola', zone: 'litoral_norte', action: 'colheita', months: [6, 7, 8] },
  // Frutos
  { plant: 'tomate', zone: 'litoral_norte', action: 'sementeira_interior', months: [2, 3] },
  { plant: 'tomate', zone: 'litoral_norte', action: 'transplante', months: [5] },
  { plant: 'tomate', zone: 'litoral_norte', action: 'colheita', months: [7, 8, 9, 10] },
  { plant: 'pimento', zone: 'litoral_norte', action: 'sementeira_interior', months: [2, 3] },
  { plant: 'pimento', zone: 'litoral_norte', action: 'transplante', months: [5] },
  { plant: 'pimento', zone: 'litoral_norte', action: 'colheita', months: [7, 8, 9, 10] },
  { plant: 'courgette', zone: 'litoral_norte', action: 'sementeira_direta', months: [4, 5, 6] },
  { plant: 'courgette', zone: 'litoral_norte', action: 'colheita', months: [6, 7, 8, 9] },
  { plant: 'morango', zone: 'litoral_norte', action: 'transplante', months: [10, 11, 3] },
  { plant: 'morango', zone: 'litoral_norte', action: 'colheita', months: [4, 5, 6] },
  // Leguminosas
  { plant: 'feijao-verde', zone: 'litoral_norte', action: 'sementeira_direta', months: [5, 6, 7] },
  { plant: 'feijao-verde', zone: 'litoral_norte', action: 'colheita', months: [7, 8, 9] },
  { plant: 'ervilha', zone: 'litoral_norte', action: 'sementeira_direta', months: [10, 11, 1, 2] },
  { plant: 'ervilha', zone: 'litoral_norte', action: 'colheita', months: [2, 3, 4, 5] },
  // Aromáticas
  { plant: 'manjericao', zone: 'litoral_norte', action: 'sementeira_interior', months: [3, 4] },
  { plant: 'manjericao', zone: 'litoral_norte', action: 'transplante', months: [5, 6] },
  { plant: 'manjericao', zone: 'litoral_norte', action: 'colheita', months: [6, 7, 8, 9] },
  { plant: 'salsa', zone: 'litoral_norte', action: 'sementeira_direta', months: [3, 4, 5, 8, 9] },
  { plant: 'salsa', zone: 'litoral_norte', action: 'colheita', months: [6, 7, 8, 9, 10, 11] },
  { plant: 'hortela', zone: 'litoral_norte', action: 'transplante', months: [3, 4, 5, 9] },
  { plant: 'hortela', zone: 'litoral_norte', action: 'colheita', months: [5, 6, 7, 8, 9, 10] },
  { plant: 'alecrim', zone: 'litoral_norte', action: 'transplante', months: [3, 4, 5, 9, 10] },
  { plant: 'alecrim', zone: 'litoral_norte', action: 'colheita', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },

  // --- Novas culturas ---
  // Folhas
  { plant: 'acelga', zone: 'litoral_norte', action: 'sementeira_direta', months: [3, 4, 5, 8, 9] },
  { plant: 'acelga', zone: 'litoral_norte', action: 'colheita', months: [6, 7, 8, 11, 12, 1, 2] },
  { plant: 'agriao', zone: 'litoral_norte', action: 'sementeira_direta', months: [3, 4, 5, 8, 9, 10] },
  { plant: 'agriao', zone: 'litoral_norte', action: 'colheita', months: [4, 5, 6, 9, 10, 11] },
  // Brássicas
  { plant: 'couve-flor', zone: 'litoral_norte', action: 'sementeira_interior', months: [6, 7, 8] },
  { plant: 'couve-flor', zone: 'litoral_norte', action: 'transplante', months: [8, 9] },
  { plant: 'couve-flor', zone: 'litoral_norte', action: 'colheita', months: [11, 12, 1, 2, 3] },
  { plant: 'couve-lombarda', zone: 'litoral_norte', action: 'sementeira_interior', months: [6, 7, 8] },
  { plant: 'couve-lombarda', zone: 'litoral_norte', action: 'transplante', months: [8, 9] },
  { plant: 'couve-lombarda', zone: 'litoral_norte', action: 'colheita', months: [11, 12, 1, 2, 3] },
  // Raízes
  { plant: 'nabo', zone: 'litoral_norte', action: 'sementeira_direta', months: [3, 4, 8, 9, 10] },
  { plant: 'nabo', zone: 'litoral_norte', action: 'colheita', months: [5, 6, 10, 11, 12] },
  { plant: 'alho-frances', zone: 'litoral_norte', action: 'sementeira_interior', months: [3, 4] },
  { plant: 'alho-frances', zone: 'litoral_norte', action: 'transplante', months: [6, 7] },
  { plant: 'alho-frances', zone: 'litoral_norte', action: 'colheita', months: [10, 11, 12, 1, 2, 3] },
  { plant: 'batata', zone: 'litoral_norte', action: 'sementeira_direta', months: [2, 3, 4] },
  { plant: 'batata', zone: 'litoral_norte', action: 'colheita', months: [6, 7, 8] },
  // Frutos
  { plant: 'pepino', zone: 'litoral_norte', action: 'sementeira_direta', months: [4, 5, 6] },
  { plant: 'pepino', zone: 'litoral_norte', action: 'colheita', months: [7, 8, 9] },
  { plant: 'abobora', zone: 'litoral_norte', action: 'sementeira_direta', months: [4, 5, 6] },
  { plant: 'abobora', zone: 'litoral_norte', action: 'colheita', months: [9, 10, 11] },
  { plant: 'beringela', zone: 'litoral_norte', action: 'sementeira_interior', months: [2, 3] },
  { plant: 'beringela', zone: 'litoral_norte', action: 'transplante', months: [5, 6] },
  { plant: 'beringela', zone: 'litoral_norte', action: 'colheita', months: [8, 9, 10] },
  // Leguminosas
  { plant: 'fava', zone: 'litoral_norte', action: 'sementeira_direta', months: [10, 11, 12] },
  { plant: 'fava', zone: 'litoral_norte', action: 'colheita', months: [3, 4, 5] },
  { plant: 'feijao-frade', zone: 'litoral_norte', action: 'sementeira_direta', months: [5, 6, 7] },
  { plant: 'feijao-frade', zone: 'litoral_norte', action: 'colheita', months: [8, 9, 10] },
  // Aromáticas
  { plant: 'coentros', zone: 'litoral_norte', action: 'sementeira_direta', months: [3, 4, 5, 8, 9] },
  { plant: 'coentros', zone: 'litoral_norte', action: 'colheita', months: [5, 6, 7, 9, 10] },
  { plant: 'cebolinho', zone: 'litoral_norte', action: 'transplante', months: [3, 4, 5, 9] },
  { plant: 'cebolinho', zone: 'litoral_norte', action: 'colheita', months: [4, 5, 6, 7, 8, 9, 10] },
  { plant: 'tomilho', zone: 'litoral_norte', action: 'transplante', months: [3, 4, 5, 9, 10] },
  { plant: 'tomilho', zone: 'litoral_norte', action: 'colheita', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { plant: 'oregaos', zone: 'litoral_norte', action: 'transplante', months: [3, 4, 5, 9, 10] },
  { plant: 'oregaos', zone: 'litoral_norte', action: 'colheita', months: [5, 6, 7, 8, 9, 10] },
  { plant: 'louro', zone: 'litoral_norte', action: 'transplante', months: [3, 4, 5, 9, 10] },
  { plant: 'louro', zone: 'litoral_norte', action: 'colheita', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { plant: 'funcho', zone: 'litoral_norte', action: 'sementeira_direta', months: [3, 4, 8, 9] },
  { plant: 'funcho', zone: 'litoral_norte', action: 'colheita', months: [6, 7, 11, 12] },
  { plant: 'melao', zone: 'litoral_norte', action: 'sementeira_interior', months: [3, 4] },
  { plant: 'melao', zone: 'litoral_norte', action: 'sementeira_direta', months: [5] },
  { plant: 'melao', zone: 'litoral_norte', action: 'colheita', months: [8, 9] },
  { plant: 'couve-chinesa', zone: 'litoral_norte', action: 'sementeira_direta', months: [3, 4, 8, 9] },
  { plant: 'couve-chinesa', zone: 'litoral_norte', action: 'colheita', months: [5, 6, 10, 11] },
  { plant: 'aipo', zone: 'litoral_norte', action: 'sementeira_interior', months: [2, 3] },
  { plant: 'aipo', zone: 'litoral_norte', action: 'transplante', months: [5, 6] },
  { plant: 'aipo', zone: 'litoral_norte', action: 'colheita', months: [9, 10, 11] },
  { plant: 'malagueta', zone: 'litoral_norte', action: 'sementeira_interior', months: [2, 3] },
  { plant: 'malagueta', zone: 'litoral_norte', action: 'transplante', months: [5] },
  { plant: 'malagueta', zone: 'litoral_norte', action: 'colheita', months: [8, 9, 10] },
  { plant: 'couve-de-bruxelas', zone: 'litoral_norte', action: 'sementeira_interior', months: [4, 5] },
  { plant: 'couve-de-bruxelas', zone: 'litoral_norte', action: 'transplante', months: [6, 7] },
  { plant: 'couve-de-bruxelas', zone: 'litoral_norte', action: 'colheita', months: [11, 12, 1, 2] },
  { plant: 'canonigos', zone: 'litoral_norte', action: 'sementeira_direta', months: [9, 10, 11] },
  { plant: 'canonigos', zone: 'litoral_norte', action: 'colheita', months: [11, 12, 1, 2, 3] },
  { plant: 'cebolinho-chines', zone: 'litoral_norte', action: 'transplante', months: [3, 4, 5, 9] },
  { plant: 'cebolinho-chines', zone: 'litoral_norte', action: 'colheita', months: [4, 5, 6, 7, 8, 9, 10] },
  { plant: 'mizuna', zone: 'litoral_norte', action: 'sementeira_direta', months: [3, 4, 8, 9, 10] },
  { plant: 'mizuna', zone: 'litoral_norte', action: 'colheita', months: [4, 5, 6, 10, 11] },
  { plant: 'beldroega', zone: 'litoral_norte', action: 'sementeira_direta', months: [5, 6, 7] },
  { plant: 'beldroega', zone: 'litoral_norte', action: 'colheita', months: [6, 7, 8, 9] },
  { plant: 'segurelha', zone: 'litoral_norte', action: 'sementeira_direta', months: [4, 5, 6] },
  { plant: 'segurelha', zone: 'litoral_norte', action: 'colheita', months: [7, 8, 9] },
  { plant: 'tomilho-limao', zone: 'litoral_norte', action: 'transplante', months: [3, 4, 5, 9, 10] },
  { plant: 'tomilho-limao', zone: 'litoral_norte', action: 'colheita', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { plant: 'manjerona', zone: 'litoral_norte', action: 'transplante', months: [4, 5, 6] },
  { plant: 'manjerona', zone: 'litoral_norte', action: 'colheita', months: [6, 7, 8, 9] },
  { plant: 'cerefolio', zone: 'litoral_norte', action: 'sementeira_direta', months: [3, 4, 8, 9] },
  { plant: 'cerefolio', zone: 'litoral_norte', action: 'colheita', months: [4, 5, 6, 10, 11] },
  { plant: 'chicoria', zone: 'litoral_norte', action: 'sementeira_direta', months: [4, 5, 6, 7, 8] },
  { plant: 'chicoria', zone: 'litoral_norte', action: 'colheita', months: [9, 10, 11, 12, 1, 2] },
  { plant: 'alcachofra', zone: 'litoral_norte', action: 'sementeira_interior', months: [2, 3] },
  { plant: 'alcachofra', zone: 'litoral_norte', action: 'transplante', months: [4, 5] },
  { plant: 'alcachofra', zone: 'litoral_norte', action: 'colheita', months: [4, 5, 6] },
  { plant: 'nabica', zone: 'litoral_norte', action: 'sementeira_direta', months: [2, 3, 4, 9, 10] },
  { plant: 'nabica', zone: 'litoral_norte', action: 'colheita', months: [4, 5, 6, 11, 12] },
  { plant: 'physalis', zone: 'litoral_norte', action: 'sementeira_interior', months: [2, 3] },
  { plant: 'physalis', zone: 'litoral_norte', action: 'transplante', months: [5, 6] },
  { plant: 'physalis', zone: 'litoral_norte', action: 'colheita', months: [8, 9, 10] },
  { plant: 'grao-de-bico', zone: 'litoral_norte', action: 'sementeira_direta', months: [3, 4] },
  { plant: 'grao-de-bico', zone: 'litoral_norte', action: 'colheita', months: [7, 8] },
  { plant: 'espargo', zone: 'litoral_norte', action: 'transplante', months: [2, 3] },
  { plant: 'espargo', zone: 'litoral_norte', action: 'colheita', months: [3, 4, 5] },
  { plant: 'lentilha', zone: 'litoral_norte', action: 'sementeira_direta', months: [2, 3, 4] },
  { plant: 'lentilha', zone: 'litoral_norte', action: 'colheita', months: [6, 7] },
  { plant: 'ruibarbo', zone: 'litoral_norte', action: 'transplante', months: [2, 3, 10, 11] },
  { plant: 'ruibarbo', zone: 'litoral_norte', action: 'colheita', months: [4, 5, 6] },
]

export const CALENDAR_ACTION_LABELS: Record<string, { label: string; emoji: string }> = {
  sementeira_interior: { label: 'Semear (interior)', emoji: '🏠' },
  sementeira_direta: { label: 'Semear', emoji: '🌱' },
  transplante: { label: 'Transplantar', emoji: '🪴' },
  colheita: { label: 'Colher', emoji: '🧺' },
}

// Desfasamento por zona face ao litoral norte (base dos dados):
// interior = clima mais tardio na primavera (geada até abril) → +1 mês nas sementeiras de calor;
// litoral sul = mais precoce/quente → -1 mês. Aplicado às sementeiras/transplantes (não às colheitas).
const ZONE_SHIFT: Record<string, number> = {
  litoral_norte: 0,
  interior_norte: 1,
  litoral_sul: -1,
}

function shiftMonth(m: number, delta: number): number {
  return ((m - 1 + delta + 12) % 12) + 1
}

// Cache por zona+mês (calendário estático e determinístico).
const calendarForCache = new Map<string, ReturnType<typeof computeCalendarFor>>()

// Devolve o calendário para QUALQUER zona, derivando das entradas base do litoral norte
// com um desfasamento sazonal. Garante que nenhuma zona fica sem dados.
export function calendarFor(zone: string, month: number) {
  const key = `${zone}-${month}`
  const cached = calendarForCache.get(key)
  if (cached) return cached
  const result = computeCalendarFor(zone, month)
  calendarForCache.set(key, result)
  return result
}

function computeCalendarFor(zone: string, month: number) {
  const delta = ZONE_SHIFT[zone] ?? 0
  return CALENDAR.filter((base) => {
    const months =
      base.action === 'colheita' ? base.months : base.months.map((m) => shiftMonth(m, delta))
    return months.includes(month)
  }).map((base) => ({
    ...base,
    zone,
    months: base.action === 'colheita' ? base.months : base.months.map((m) => shiftMonth(m, delta)),
  }))
}

/** Calendário de uma planta numa zona, com sementeiras/transplantes deslocados pelo clima da zona (colheita não desloca). */
export function calendarForPlant(plant: string, zone: string) {
  const delta = ZONE_SHIFT[zone] ?? 0
  return CALENDAR.filter((e) => e.plant === plant).map((base) => ({
    ...base,
    zone,
    months: base.action === 'colheita' ? base.months : base.months.map((m) => shiftMonth(m, delta)),
  }))
}

// Cache por zona+mês: o calendário é estático, logo o resultado é determinístico.
const sowableCache = new Map<string, Set<string>>()

/** Conjunto de slugs de plantas com sementeira (direta ou interior) numa zona/mês. Cacheado. */
export function plantSowableThisMonth(zone: string, month: number): Set<string> {
  const key = `${zone}-${month}`
  const cached = sowableCache.get(key)
  if (cached) return cached
  const set = new Set<string>()
  for (const e of calendarFor(zone, month)) {
    if (e.action === 'sementeira_direta' || e.action === 'sementeira_interior') set.add(e.plant)
  }
  sowableCache.set(key, set)
  return set
}

// Dica de preparação de solo por estação (1=Jan … 12=Dez → estação).
export function soilTipForMonth(month: number): string {
  if (month >= 3 && month <= 5)
    return 'Primavera: solta o solo e incorpora composto antes de semear. Cobre (mulch) para reter humidade.'
  if (month >= 6 && month <= 8)
    return 'Verão: rega de manhã e mantém uma camada de cobertura para o solo não secar nem aquecer demais.'
  if (month >= 9 && month <= 11)
    return 'Outono: enriquece com composto após as colheitas; considera um adubo verde nos canteiros vazios.'
  return 'Inverno: deixa descansar ou semeia adubo verde (favas/tremoço); evita pisar e compactar o solo molhado.'
}

// Alerta sazonal do mês (faixa "Este mês em Ovar/Aveiro")
export const MONTHLY_TIPS: Record<number, string> = {
  1: 'Inverno suave no litoral: protege das geadas no interior e planeia a primavera.',
  2: 'Começa o tomate e o pimento em interior, ao abrigo. Prepara o solo.',
  3: 'Arranca a primavera! Semeia folhas e raízes. Atenção à humidade e ao míldio.',
  4: 'Mês muito produtivo: semeia folhas, raízes e leguminosas, e transplanta alface. No interior ainda pode haver geada tardia até meados do mês — protege o tomate e o manjericão à noite.',
  5: 'Já podes pôr cá fora o tomate, o manjericão e o feijão — passou o frio.',
  6: 'Rega de manhã e na base. Vigia o oídio nas courgettes com o tempo húmido.',
  7: 'Pico do verão: colhe tomate e courgette. Semeia já as couves de outono.',
  8: 'Transplanta brássicas para o outono. Mantém a rega regular no calor.',
  9: 'Setembro húmido: atenção redobrada ao míldio no tomate. Semeia folhas de outono.',
  10: 'Planta alho e ervilhas. Boa altura para morangueiros. Colhe abóboras.',
  11: 'Outono chuvoso: garante boa drenagem. Couves e favas a todo o vapor.',
  12: 'Composta os restos da horta e planeia o próximo ano. Colhe couves e nabos.',
}
