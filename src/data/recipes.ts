import type { Recipe } from '@/types/catalog'

export const RECIPES: Recipe[] = [
  {
    slug: 'salada-rucula-pera',
    title: 'Salada de rúcula com pera',
    emoji: '🥗',
    description: 'Fresca, rápida e perfeita para usar a tua primeira colheita de folhas.',
    prepMinutes: 10,
    difficulty: 'facil',
    season: ['primavera', 'outono'],
    ingredients: [
      'Mão-cheia de rúcula (e/ou alface) acabada de colher',
      '1 pera madura às fatias',
      'Lascas de queijo curado',
      'Nozes',
      'Azeite, vinagre balsâmico, sal',
    ],
    steps: [
      'Lava e seca bem as folhas.',
      'Dispõe a rúcula, a pera, o queijo e as nozes.',
      'Tempera com azeite, um fio de balsâmico e sal a gosto.',
    ],
    plants: ['rucula', 'alface'],
  },
  {
    slug: 'pesto-manjericao',
    title: 'Pesto de manjericão da varanda',
    emoji: '🌿',
    description: 'Transforma a colheita de manjericão num molho que dura dias.',
    prepMinutes: 10,
    difficulty: 'facil',
    season: ['verao'],
    ingredients: [
      '2 mãos-cheias de folhas de manjericão',
      '50 g de pinhões (ou nozes)',
      '50 g de queijo curado ralado',
      '1 dente de alho',
      'Azeite q.b., sal',
    ],
    steps: [
      'Tritura o manjericão com os pinhões, o alho e o queijo.',
      'Junta azeite em fio até ficar cremoso.',
      'Ajusta o sal. Guarda no frigorífico coberto com um fio de azeite.',
    ],
    plants: ['manjericao', 'alho'],
  },
  {
    slug: 'salada-tomate',
    title: 'Salada de tomate e manjericão',
    emoji: '🍅',
    description: 'O verão num prato. Só funciona com tomate mesmo maduro do quintal.',
    prepMinutes: 10,
    difficulty: 'facil',
    season: ['verao'],
    ingredients: [
      'Tomates maduros às fatias',
      'Folhas de manjericão',
      'Cebola fina (opcional)',
      'Azeite, sal, orégãos',
    ],
    steps: [
      'Corta os tomates e dispõe num prato.',
      'Espalha o manjericão e a cebola.',
      'Tempera com azeite, sal e orégãos. Deixa repousar 10 min.',
    ],
    plants: ['tomate', 'manjericao'],
  },
  {
    slug: 'molho-tomate',
    title: 'Molho de tomate caseiro',
    emoji: '🍝',
    description: 'Aproveita o excedente de tomate — e liberta mais licopeno do que cru.',
    prepMinutes: 40,
    difficulty: 'facil',
    season: ['verao', 'outono'],
    ingredients: [
      '1 kg de tomate maduro',
      '1 cebola, 2 dentes de alho',
      'Azeite, sal, folhas de manjericão',
    ],
    steps: [
      'Refoga a cebola e o alho em azeite.',
      'Junta o tomate picado e deixa apurar 30 min em lume brando.',
      'Tempera com sal e manjericão no fim.',
    ],
    plants: ['tomate', 'cebola', 'alho', 'manjericao'],
  },
  {
    slug: 'caldo-verde',
    title: 'Caldo verde',
    emoji: '🍲',
    description: 'O clássico português, da tua própria couve-galega.',
    prepMinutes: 45,
    difficulty: 'facil',
    season: ['outono', 'inverno'],
    ingredients: [
      'Couve-galega cortada muito fina',
      '4 batatas',
      '1 cebola, 2 dentes de alho',
      'Azeite, sal, chouriço (opcional)',
    ],
    steps: [
      'Coze as batatas com a cebola e o alho; reduz a puré com o caldo.',
      'Junta a couve cortada fina e deixa cozer 5-8 min.',
      'Tempera com azeite e sal; serve com rodelas de chouriço.',
    ],
    plants: ['couve-galega', 'cebola', 'alho'],
  },
  {
    slug: 'esparregado',
    title: 'Esparregado de espinafres',
    emoji: '🥬',
    description: 'Acompanhamento cremoso que usa muito espinafre.',
    prepMinutes: 20,
    difficulty: 'facil',
    season: ['outono', 'inverno', 'primavera'],
    ingredients: ['Espinafres', '1 dente de alho', 'Azeite, farinha (opcional), sal, vinagre'],
    steps: [
      'Salteia o alho em azeite.',
      'Junta os espinafres e deixa murchar.',
      'Tritura, ajusta com um pouco de vinagre e sal.',
    ],
    plants: ['espinafre', 'alho'],
  },
]

export const RECIPES_BY_SLUG: Record<string, Recipe> = Object.fromEntries(
  RECIPES.map((r) => [r.slug, r]),
)

export function recipesForPlant(slug: string): Recipe[] {
  return RECIPES.filter((r) => r.plants.includes(slug))
}
