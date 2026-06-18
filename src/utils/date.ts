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

export function todayISO(): string {
  return startOfDay(new Date()).toISOString()
}

export function todayKey(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function isoDay(d: Date | string): string {
  const date = typeof d === 'string' ? parseISO(d) : d
  return format(date, 'yyyy-MM-dd')
}

export function fmtDate(d: string | Date, pattern = "d 'de' MMMM"): string {
  const date = typeof d === 'string' ? parseISO(d) : d
  return format(date, pattern, { locale: pt })
}

export function fmtRelative(d: string | Date): string {
  const date = typeof d === 'string' ? parseISO(d) : d
  return formatDistanceToNowStrict(date, { locale: pt, addSuffix: true })
}

export function daysSince(d: string | Date): number {
  const date = typeof d === 'string' ? parseISO(d) : d
  return Math.max(0, differenceInCalendarDays(new Date(), date))
}

export function addDaysISO(d: string | Date, days: number): string {
  const date = typeof d === 'string' ? parseISO(d) : d
  return addDays(date, days).toISOString()
}

export function isOverdue(dueISO: string): boolean {
  return isBefore(parseISO(dueISO), startOfDay(new Date()))
}

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

export function currentMonth(): number {
  return new Date().getMonth() + 1
}

export function currentSeason(): 'primavera' | 'verao' | 'outono' | 'inverno' {
  const m = currentMonth()
  if (m >= 3 && m <= 5) return 'primavera'
  if (m >= 6 && m <= 8) return 'verao'
  if (m >= 9 && m <= 11) return 'outono'
  return 'inverno'
}
