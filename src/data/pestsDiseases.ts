import type { Pest, Disease } from '@/types/catalog'

export const PESTS: Pest[] = [
  {
    slug: 'afideo',
    name: 'Afídeo (pulgão)',
    emoji: '🐛',
    description:
      'Pequenos insetos (verdes, pretos ou rosados) que se agrupam nos rebentos tenros e por baixo das folhas. Surgem sobretudo na primavera, quando há muita rebentação nova.',
    symptoms: 'Folhas enroladas e pegajosas, rebentos deformados, presença de formigas.',
    prevention: 'Plantas saudáveis resistem melhor. Atrai joaninhas com flores; evita excesso de azoto.',
    treatment:
      'Jato de água, sabão potássico ou óleo de nim. Esmaga as colónias pequenas à mão. Controlo biológico: joaninhas e larvas de crisopa devoram pulgões — atrai-as com flores (calêndula, funcho a florir) e evita inseticidas de largo espetro.',
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
    treatment:
      'Apanha à mão as lagartas e esmaga os ovos amarelos (em grupos, no verso das folhas). Bacillus thuringiensis (Bt) é um tratamento biológico muito eficaz: é uma bactéria que só afeta lagartas, inofensiva para pessoas, abelhas e animais — pulveriza ao fim da tarde e repete após chuva. Vespas parasitoides e aves também ajudam a controlar a população.',
  },
  {
    slug: 'altica',
    name: 'Áltica (pulga-da-terra)',
    emoji: '⚫',
    description:
      'Minúsculos besouros saltadores que atacam brássicas jovens, sobretudo rúcula e rabanete. Mais ativa na primavera e no verão quente e seco.',
    symptoms: 'Folhas crivadas de pequenos buracos redondos, como tiros de chumbo.',
    prevention: 'Rede fina sobre as plântulas; mantém o solo húmido (gostam de seco e quente).',
    treatment: 'Rede de proteção; armadilhas adesivas amarelas.',
  },
  {
    slug: 'mosca-branca',
    name: 'Mosca-branca',
    emoji: '⚪',
    description:
      'Insetos brancos minúsculos que voam em nuvem quando se mexe a planta; comuns em tomate e pimento. Pico no fim do verão e o ano todo em estufa ou interior.',
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
    prevention:
      'Rede de proteção; não desbastar ao entardecer (o cheiro atrai a mosca); associar com cebola/alho.',
    treatment: 'Sobretudo prevenção com rede; rotação de culturas.',
  },
  {
    slug: 'cochonilha',
    name: 'Cochonilha',
    emoji: '🛡️',
    description:
      'Pequenas carapaças ou bolas algodoadas agarradas a caules e nervuras, sobretudo em aromáticas e plantas de interior.',
    symptoms: 'Pontos imóveis castanhos/brancos, melada pegajosa e fumagina (bolor preto) nas folhas.',
    prevention: 'Inspeciona plantas novas antes de juntar às outras; bom arejamento; evita excesso de azoto.',
    treatment: 'Limpa com cotonete embebido em álcool; pulveriza com óleo de nim ou sabão potássico.',
  },
  {
    slug: 'acaro-aranha',
    name: 'Ácaro-aranha',
    emoji: '🕷️',
    description:
      'Ácaros minúsculos que proliferam em ar quente e seco, tecendo teias finas no verso das folhas.',
    symptoms: 'Pontilhado amarelo/bronzeado nas folhas e teias muito finas; folhas que secam.',
    prevention: 'Aumenta a humidade (borrifa as folhas); evita stress hídrico; o calor seco favorece-os.',
    treatment: 'Jatos de água no verso das folhas; óleo de nim; remove folhas muito atacadas.',
  },
  {
    slug: 'tripes',
    name: 'Tripes',
    emoji: '🐜',
    description: 'Insetos minúsculos e alongados que raspam as folhas e flores para se alimentarem.',
    symptoms: 'Manchas prateadas/esbranquiçadas e pontos pretos (dejetos); flores deformadas.',
    prevention: 'Armadilhas adesivas azuis; rega adequada; remove ervas hospedeiras à volta.',
    treatment: 'Óleo de nim ou sabão potássico; introduz predadores naturais; remove partes muito afetadas.',
  },
  {
    slug: 'nematodes',
    name: 'Nemátodes-das-galhas',
    emoji: '🪱',
    description:
      'Vermes microscópicos do solo que atacam as raízes, sobretudo em solos quentes e arenosos (tomate, cenoura).',
    symptoms:
      'Plantas mirradas e a murchar com calor apesar de regadas; raízes com nódulos/galhas ao arrancar.',
    prevention:
      'Rotação de culturas; adiciona matéria orgânica; planta tagetes (cravo-túnico) que os repele; usa variedades resistentes.',
    treatment:
      'Não há cura química caseira: arranca e destrói as plantas afetadas (não compostar) e roda a cultura nesse canteiro durante uns anos.',
  },
]

export const DISEASES: Disease[] = [
  {
    slug: 'mildio',
    name: 'Míldio',
    emoji: '🍂',
    isFungal: true,
    description:
      'Doença fúngica favorecida pela humidade e folhas molhadas — o maior inimigo da horta no litoral atlântico.',
    symptoms: 'Manchas amareladas na página superior e penugem acinzentada por baixo; folhas que secam.',
    prevention:
      'Espaçamento generoso, boa ventilação, rega de manhã e SEMPRE na base (nunca nas folhas). Calda bordalesa em prevenção nas culturas sensíveis. Consociação e rotação evitam concentrar a mesma família e cortam o ciclo do fungo.',
    treatment:
      'Remove folhas afetadas; melhora o arejamento; trata com produtos à base de cobre (uso moderado).',
  },
  {
    slug: 'oidio',
    name: 'Oídio (pó branco)',
    emoji: '⚪',
    isFungal: true,
    description:
      'Fungo que cobre as folhas com um pó branco; comum no fim do verão húmido em courgette, couves e morango.',
    symptoms: 'Pó branco farinhento nas folhas, que depois amarelecem e secam.',
    prevention:
      'No litoral húmido: arejamento e espaçamento generoso, rega de manhã e na base (nunca à noite nem sobre as folhas) e evita o stress hídrico que o favorece. Consociação: intercala plantas para arejar e não amontoar a mesma família; variedades resistentes ajudam.',
    treatment:
      'Remove folhas atacadas; pulveriza com leite diluído (1:9) ou enxofre; bicarbonato de sódio diluído.',
  },
]

export const PESTS_BY_SLUG: Record<string, Pest> = Object.fromEntries(PESTS.map((p) => [p.slug, p]))
export const DISEASES_BY_SLUG: Record<string, Disease> = Object.fromEntries(DISEASES.map((d) => [d.slug, d]))
