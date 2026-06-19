import {
  format,
  formatDistanceToNowStrict,
  differenceInCalendarDays,
  addDays,
  startOfDay,
  isBefore,
  parseISO,
} from 'date-fns'
import { pt } from 'date-fns/locale'

/** Início do dia de hoje em ISO (âncora estável para datas sem hora). */
export function todayISO(): string {
  return startOfDay(new Date()).toISOString()
}

/** Chave do dia de hoje em `yyyy-MM-dd` (para comparações e streak). */
export function todayKey(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

/** Converte uma data/ISO para a chave de dia `yyyy-MM-dd`. */
export function isoDay(d: Date | string): string {
  const date = typeof d === 'string' ? parseISO(d) : d
  return format(date, 'yyyy-MM-dd')
}

/** Formata uma data em pt-PT (por defeito "d 'de' MMMM"). */
export function fmtDate(d: string | Date, pattern = "d 'de' MMMM"): string {
  const date = typeof d === 'string' ? parseISO(d) : d
  return format(date, pattern, { locale: pt })
}

/** Distância relativa a agora, em pt-PT (ex.: "há 3 dias"). */
export function fmtRelative(d: string | Date): string {
  const date = typeof d === 'string' ? parseISO(d) : d
  return formatDistanceToNowStrict(date, { locale: pt, addSuffix: true })
}

/** Nº de dias de calendário decorridos desde `d` (mínimo 0). */
export function daysSince(d: string | Date): number {
  const date = typeof d === 'string' ? parseISO(d) : d
  return Math.max(0, differenceInCalendarDays(new Date(), date))
}

/** Soma `days` dias a `d` e devolve em ISO. */
export function addDaysISO(d: string | Date, days: number): string {
  const date = typeof d === 'string' ? parseISO(d) : d
  return addDays(date, days).toISOString()
}

/** Verdadeiro se a data de vencimento já passou (antes de hoje). */
export function isOverdue(dueISO: string): boolean {
  return isBefore(parseISO(dueISO), startOfDay(new Date()))
}

/** Verdadeiro se a data de vencimento é hoje. */
export function isDueToday(dueISO: string): boolean {
  return isoDay(dueISO) === todayKey()
}

export const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

/** Mês atual como número 1-12. */
export function currentMonth(): number {
  return new Date().getMonth() + 1
}

/** Estação atual no hemisfério norte, a partir do mês. */
export function currentSeason(): 'primavera' | 'verao' | 'outono' | 'inverno' {
  const m = currentMonth()
  if (m >= 3 && m <= 5) return 'primavera'
  if (m >= 6 && m <= 8) return 'verao'
  if (m >= 9 && m <= 11) return 'outono'
  return 'inverno'
}
