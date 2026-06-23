import type { Plant } from '@/types/catalog'
import { FOLHA_PLANTS } from './folha'
import { BRASSICA_PLANTS } from './brassica'
import { RAIZ_PLANTS } from './raiz'
import { FRUTO_PLANTS } from './fruto'
import { LEGUMINOSA_PLANTS } from './leguminosa'
import { AROMATICA_PLANTS } from './aromatica'

// Catálogo agronómico curado para Portugal litoral atlântico (Ovar/Aveiro),
// dividido por categoria (ver ./<categoria>.ts). A API pública mantém-se:
// PLANTS, PLANTS_BY_SLUG e getPlant.
export const PLANTS: Plant[] = [
  ...FOLHA_PLANTS,
  ...BRASSICA_PLANTS,
  ...RAIZ_PLANTS,
  ...FRUTO_PLANTS,
  ...LEGUMINOSA_PLANTS,
  ...AROMATICA_PLANTS,
]

export const PLANTS_BY_SLUG: Record<string, Plant> = Object.fromEntries(
  PLANTS.map((p) => [p.slug, p]),
)

export function getPlant(slug: string): Plant | undefined {
  return PLANTS_BY_SLUG[slug]
}
