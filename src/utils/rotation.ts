import type { Plant, PlantCategory } from '@/types/catalog'

// Rotação de culturas: não plantar a mesma família/grupo no mesmo sítio anos
// seguidos. Tem dois fundamentos complementares:
//  1. Ciclo de nutrientes — alternar grupos com necessidades diferentes de azoto
//     (leguminosa fixa → folha gulosa → fruto → raiz pouco exigente).
//  2. Quebra de pragas/doenças — não repetir a mesma FAMÍLIA botânica num local
//     durante ~3 anos, pois partilham inimigos que se acumulam no solo.
// Módulo puro (sem Vue/Dexie).

export type RotationGroup = 'leguminosa' | 'folha' | 'fruto' | 'raiz' | 'aromatica'

export interface RotationGroupInfo {
  group: RotationGroup
  name: string
  emoji: string
  role: string
}

// Ordem do ciclo anual clássico (4 talhões). Aromáticas/perenes ficam à parte.
export const ROTATION_CYCLE: RotationGroup[] = ['leguminosa', 'folha', 'fruto', 'raiz']

export const ROTATION_GROUPS: Record<RotationGroup, RotationGroupInfo> = {
  leguminosa: {
    group: 'leguminosa',
    name: 'Leguminosas',
    emoji: '🫛',
    role: 'Fixam azoto no solo (com bactérias nas raízes) — enriquecem-no para a cultura seguinte.',
  },
  folha: {
    group: 'folha',
    name: 'Folhas e brássicas',
    emoji: '🥬',
    role: 'Gulosas de azoto — aproveitam o solo enriquecido pelas leguminosas.',
  },
  fruto: {
    group: 'fruto',
    name: 'Frutos',
    emoji: '🍅',
    role: 'Exigentes em nutrientes e água — pedem solo fértil e bem adubado.',
  },
  raiz: {
    group: 'raiz',
    name: 'Raízes e bolbos',
    emoji: '🥕',
    role: 'Pouco exigentes em azoto (que daria folha em vez de raiz) — fecham o ciclo.',
  },
  aromatica: {
    group: 'aromatica',
    name: 'Aromáticas e perenes',
    emoji: '🌿',
    role: 'Muitas são perenes e ficam fora da rotação anual; várias repelem pragas.',
  },
}

const CATEGORY_TO_GROUP: Record<PlantCategory, RotationGroup | null> = {
  leguminosa: 'leguminosa',
  brassica: 'folha',
  folha: 'folha',
  fruto: 'fruto',
  raiz: 'raiz',
  aromatica: 'aromatica',
  microgreen: null,
}

/** Grupo de rotação de uma planta (a partir da categoria). `null` para microgreens. */
export function rotationGroupForPlant(plant: Plant): RotationGroup | null {
  return CATEGORY_TO_GROUP[plant.category] ?? null
}

/** Próximo grupo no ciclo de nutrientes (leguminosa → folha → fruto → raiz → leguminosa). */
export function nextRotationGroup(group: RotationGroup): RotationGroup | null {
  const i = ROTATION_CYCLE.indexOf(group)
  if (i === -1) return null // aromáticas/perenes não entram no ciclo
  return ROTATION_CYCLE[(i + 1) % ROTATION_CYCLE.length]
}

export interface RotationAdvice {
  group: RotationGroup | null
  /** A família botânica já esteve neste local recentemente (risco de pragas/doenças). */
  repeatsFamily: boolean
  /** Grupo recomendado a seguir, no mesmo local, na próxima época. */
  nextGroup: RotationGroup | null
  message: string
}

/**
 * Conselho de rotação para plantar `plant` num local que teve recentemente as
 * famílias `recentFamilies` (mais recente primeiro). Sem histórico, dá só o ciclo.
 */
export function rotationAdvice(plant: Plant, recentFamilies: string[] = []): RotationAdvice {
  const group = rotationGroupForPlant(plant)
  const repeatsFamily = recentFamilies.includes(plant.family)
  const nextGroup = group ? nextRotationGroup(group) : null

  let message: string
  if (repeatsFamily) {
    message = `Atenção: a família ${plant.family} já esteve aqui há pouco tempo. Espera ~3 anos antes de a repetir no mesmo sítio, para não acumular pragas e doenças do solo.`
  } else if (nextGroup) {
    message = `Boa escolha. Na próxima época, neste local, segue para ${ROTATION_GROUPS[nextGroup].name.toLowerCase()}.`
  } else {
    message = 'Aromáticas e perenes ficam fora da rotação anual — podem permanecer no mesmo lugar.'
  }
  return { group, repeatsFamily, nextGroup, message }
}
