import type { Reminder } from '@/types/models'
import { parseISO } from 'date-fns'

function toICSDate(d: Date): string {
  // Formato: AAAAMMDD (evento de dia inteiro)
  return (
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0')
  )
}

// Escapa o texto para valores de propriedade do iCalendar (RFC 5545).
function escapeICS(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

function toICSStamp(d: Date): string {
  // Formato UTC: AAAAMMDDTHHMMSSZ (obrigatório no campo DTSTAMP)
  return (
    d.getUTCFullYear().toString() +
    String(d.getUTCMonth() + 1).padStart(2, '0') +
    String(d.getUTCDate()).padStart(2, '0') +
    'T' +
    String(d.getUTCHours()).padStart(2, '0') +
    String(d.getUTCMinutes()).padStart(2, '0') +
    String(d.getUTCSeconds()).padStart(2, '0') +
    'Z'
  )
}

/**
 * Gera um ficheiro .ics com os lembretes (eventos de dia inteiro, com recorrência
 * quando aplicável). Funciona em qualquer calendário (iOS, Android, Google, Outlook).
 */
export function buildICS(reminders: Reminder[], stamp: Date = new Date()): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GrowGreens//PT//',
    'CALSCALE:GREGORIAN',
  ]
  const dtstamp = toICSStamp(stamp)
  for (const r of reminders) {
    if (r.done) continue
    const start = parseISO(r.dueAt)
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${r.id}@growgreens`)
    lines.push(`DTSTAMP:${dtstamp}`)
    lines.push(`DTSTART;VALUE=DATE:${toICSDate(start)}`)
    lines.push(`SUMMARY:🌱 ${escapeICS(r.label)}`)
    if (r.recurrenceDays) lines.push(`RRULE:FREQ=DAILY;INTERVAL=${r.recurrenceDays}`)
    lines.push('END:VEVENT')
  }
  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

export function downloadICS(reminders: Reminder[]) {
  const blob = new Blob([buildICS(reminders)], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'growgreens-lembretes.ics'
  a.click()
  URL.revokeObjectURL(url)
}
