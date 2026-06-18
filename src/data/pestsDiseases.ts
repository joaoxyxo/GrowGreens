import type { Pest, Disease } from '@/types/catalog'

export const PESTS: Pest[] = [
  {
    slug: 'afideo',
    name: 'Afídeo (pulgão)',
    emoji: '🐛',
    description: 'Pequenos insetos (verdes, pretos ou rosados) que se agrupam nos rebentos tenros e por baixo das folhas.',
    symptoms: 'Folhas enroladas e pegajosas, rebentos deformados, presença de formigas.',
    prevention: 'Plantas saudáveis resistem melhor. Atrai joaninhas com flores; evita excesso de azoto.',
    treatment: 'Jato de água, sabão potássico ou óleo de nim. Esmaga as colónias pequenas à mão.',
  },
  {
    slug: 'lesma',
    name: 'Lesmas e caracóis',
    emoji: '🐌',
    description: 'Moluscos noturnos que adoram plântulas e folhas tenras, sobretudo em tempo húmido.',
    symptoms: 'Folhas com buracos irregulares e rastos prateados de muco.',
    prevention: 'Rega de manhã (não à noite). Barreiras de casca de ovo ou cinza à volta das plantas.',
    treatment: 'Apanha à noite com lanterna. Armadilhas de cerveja. Iscos de fosfato de ferro (bio).',
  },
  {
    slug: 'lagarta',
    name: 'Lagarta-da-couve',
    emoji: '🐛',
    description: 'Larvas verdes (da borboleta branca) que devastam as brássicas na primavera e verão.',
    symptoms: 'Folhas de couve com grandes buracos; excrementos verdes; lagartas no verso.',
    prevention: 'Rede anti-insetos sobre as couves. Inspeção regular do verso das folhas.',
    treatment: 'Apanha à mão. Bacillus thuringiensis (Bt) é um tratamento biológico eficaz.',
  },
  {
    slug: 'altica',
    name: 'Áltica (pulga-da-terra)',
    emoji: '⚫',
    description: 'Minúsculos besouros saltadores que atacam brássicas jovens, sobretudo rúcula e rabanete.',
    symptoms: 'Folhas crivadas de pequenos buracos redondos, como tiros de chumbo.',
    prevention: 'Rede fina sobre as plântulas; mantém o solo húmido (gostam de seco e quente).',
    treatment: 'Rede de proteção; armadilhas adesivas amarelas.',
  },
  {
    slug: 'mosca-branca',
    name: 'Mosca-branca',
    emoji: '⚪',
    description: 'Insetos brancos minúsculos que voam em nuvem quando se mexe a planta; comuns em tomate e pimento.',
    symptoms: 'Nuvem branca ao tocar; folhas amareladas e pegajosas.',
    prevention: 'Boa ventilação; armadilhas amarelas; manjericão por perto ajuda.',
    treatment: 'Sabão potássico, óleo de nim, armadilhas adesivas.',
  },
  {
    slug: 'mosca-cenoura',
    name: 'Mosca-da-cenoura',
    emoji: '🪰',
    description: 'A larva faz galerias nas raízes da cenoura (e salsa).',
    symptoms: 'Galerias escuras nas raízes; folhagem avermelhada.',
    prevention: 'Rede de proteção; não desbastar ao entardecer (o cheiro atrai a mosca); associar com cebola/alho.',
    treatment: 'Sobretudo prevenção com rede; rotação de culturas.',
  },
]

export const DISEASES: Disease[] = [
  {
    slug: 'mildio',
    name: 'Míldio',
    emoji: '🍂',
    isFungal: true,
    description: 'Doença fúngica favorecida pela humidade e folhas molhadas — o maior inimigo da horta no litoral atlântico.',
    symptoms: 'Manchas amareladas na página superior e penugem acinzentada por baixo; folhas que secam.',
    prevention:
      'Espaçamento generoso, boa ventilação, rega de manhã e SEMPRE na base (nunca nas folhas). Calda bordalesa em prevenção nas culturas sensíveis.',
    treatment: 'Remove folhas afetadas; melhora o arejamento; trata com produtos à base de cobre (uso moderado).',
  },
  {
    slug: 'oidio',
    name: 'Oídio (pó branco)',
    emoji: '⚪',
    isFungal: true,
    description: 'Fungo que cobre as folhas com um pó branco; comum no fim do verão húmido em courgette, couves e morango.',
    symptoms: 'Pó branco farinhento nas folhas, que depois amarelecem e secam.',
    prevention: 'Arejamento, espaçamento, rega na base. Evita stress hídrico.',
    treatment: 'Remove folhas atacadas; pulveriza com leite diluído (1:9) ou enxofre; bicarbonato de sódio diluído.',
  },
]

export const PESTS_BY_SLUG: Record<string, Pest> = Object.fromEntries(PESTS.map((p) => [p.slug, p]))
export const DISEASES_BY_SLUG: Record<string, Disease> = Object.fromEntries(
  DISEASES.map((d) => [d.slug, d]),
)
