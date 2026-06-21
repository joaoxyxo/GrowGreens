/** Normaliza texto para pesquisa: minúsculas e sem acentos (tolerante a diacríticos). */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}
