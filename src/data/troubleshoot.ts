// Resolução de problemas por sintomas — sem IA, em linguagem de principiante.
export interface Symptom {
  id: string
  emoji: string
  label: string
  likely: string
  whatToDo: string[]
  /** Slugs de pragas/doenças relacionadas (de pestsDiseases) para saber mais. */
  related?: string[]
}

export const SYMPTOMS: Symptom[] = [
  {
    id: 'amarela',
    emoji: '🟡',
    label: 'Folhas a ficar amarelas',
    likely: 'Quase sempre é água a mais (o erro nº1) — ou falta de nutrientes.',
    whatToDo: [
      'Faz o teste do dedo: se a 2 cm o solo está húmido, NÃO regues.',
      'Confirma que o vaso tem furos de drenagem.',
      'Se o solo está pobre, dá um adubo líquido fraco.',
    ],
  },
  {
    id: 'murcha',
    emoji: '🥀',
    label: 'Planta murcha / caída',
    likely: 'Pode ser sede... ou o contrário, raízes encharcadas.',
    whatToDo: [
      'Vê o solo: seco e duro → rega bem. Encharcado e com cheiro → deixa secar.',
      'No calor, murchar ao meio-dia e recuperar à tarde é normal.',
      'Protege do sol forte do meio-dia se acabou de ser transplantada.',
    ],
  },
  {
    id: 'esticada',
    emoji: '📏',
    label: 'Caule comprido, fino e pálido',
    likely: 'Falta de luz (estiolamento).',
    whatToDo: [
      'Aproxima de uma janela bem soalheira.',
      'No inverno do litoral, considera uma luz de cultivo.',
      'Roda o vaso para crescer direita.',
    ],
  },
  {
    id: 'po-branco',
    emoji: '⚪',
    label: 'Pó branco nas folhas',
    likely: 'Oídio — um fungo comum no nosso clima húmido.',
    whatToDo: [
      'Remove as folhas mais afetadas.',
      'Melhora o arejamento; rega na base, nunca por cima.',
      'Pulveriza com leite diluído (1 parte para 9 de água) ou enxofre.',
    ],
    related: ['oidio'],
  },
  {
    id: 'manchas',
    emoji: '🍂',
    label: 'Manchas + penugem por baixo',
    likely: 'Míldio — o maior inimigo da horta no litoral atlântico.',
    whatToDo: [
      'Tira as folhas doentes (não as deixes no chão).',
      'Dá mais espaço entre plantas para o ar circular.',
      'Rega de manhã e só na base. Calda bordalesa em prevenção.',
    ],
    related: ['mildio'],
  },
  {
    id: 'bichos',
    emoji: '🐛',
    label: 'Bichos / folhas comidas ou pegajosas',
    likely: 'Pulgões, lesmas ou lagartas.',
    whatToDo: [
      'Pegajoso e enrolado → pulgões: jato de água ou sabão potássico.',
      'Buracos e rastos prateados → lesmas: apanha à noite, casca de ovo à volta.',
      'Buracos grandes nas couves → lagartas: apanha à mão, rede de proteção.',
    ],
    related: ['afideo', 'lesma', 'lagarta'],
  },
  {
    id: 'nao-germina',
    emoji: '🌰',
    label: 'As sementes não nascem',
    likely: 'Demasiado frio, demasiado fundo, ou solo seco.',
    whatToDo: [
      'Mantém o solo sempre húmido (mas não encharcado) até nascerem.',
      'Não enterres fundo demais — regra: 2-3x a altura da semente.',
      'Algumas (salsa, cenoura) são MESMO lentas: espera 2-3 semanas.',
    ],
  },
  {
    id: 'flores-caem',
    emoji: '🌸',
    label: 'Flores que caem sem dar fruto',
    likely: 'Falta de polinização ou stress (calor, sede) — comum em tomate, pepino, abóbora e courgette.',
    whatToDo: [
      'Atrai polinizadores (flores à volta) ou poliniza à mão com um pincel de flor em flor.',
      'Rega de forma regular: oscilações de água fazem cair as flores.',
      'Nas aboboráceas, as primeiras flores macho caírem é normal — espera pelas fêmeas (com fruto pequeno atrás).',
    ],
  },
  {
    id: 'ponta-podre',
    emoji: '🍅',
    label: 'Frutos a apodrecer na ponta',
    likely: 'Podridão apical: falta de cálcio causada por rega irregular (tomate, pimento, courgette).',
    whatToDo: [
      'Rega de forma regular e constante — a causa é quase sempre a água, não o solo.',
      'Aplica uma camada de cobertura (mulch) para o solo não secar e voltar a encharcar.',
      'Remove os frutos afetados; os seguintes vêm sãos quando a rega estabiliza.',
    ],
  },
  {
    id: 'pontas-castanhas',
    emoji: '🟫',
    label: 'Pontas ou bordos das folhas castanhos e secos',
    likely: 'Excesso de adubo/sais no substrato, ou ar muito seco — queima as pontas (tip burn).',
    whatToDo: [
      'Rega abundante uma vez para "lavar" os sais em excesso (deixa escorrer bem).',
      'Reduz a frequência/dose de adubo nas próximas semanas.',
      'Em interior, afasta de fontes de calor e aumenta um pouco a humidade.',
    ],
  },
  {
    id: 'damping-off',
    emoji: '💀',
    label: 'Plântulas tombam e morrem à base (logo após nascer)',
    likely: 'Damping-off: fungos do solo favorecidos por excesso de água e pouco arejamento.',
    whatToDo: [
      'Rega menos e por baixo (capilaridade); deixa a superfície secar entre regas.',
      'Mais luz e ar a circular; não semeies demasiado denso.',
      'Usa substrato limpo de sementeira; as plântulas tombadas não recuperam — recomeça.',
    ],
    related: ['mildio'],
  },
  {
    id: 'clorose',
    emoji: '🍐',
    label: 'Folhas amarelas mas com nervuras ainda verdes (clorose)',
    likely: 'Falta de ferro/magnésio (clorose), frequente em substrato muito alcalino ou encharcado.',
    whatToDo: [
      'Confirma a drenagem — raízes encharcadas não absorvem ferro.',
      'Usa um adubo com micronutrientes (ferro/magnésio) ou composto maduro.',
      'Se a água for muito calcária, intercala com água da chuva.',
    ],
  },
  {
    id: 'teias-finas',
    emoji: '🕸️',
    label: 'Teias finas e pontilhado claro nas folhas',
    likely: 'Ácaro-aranha, que prolifera em ar quente e seco (comum em interior no verão).',
    whatToDo: [
      'Aumenta a humidade: borrifa o verso das folhas com água.',
      'Lava as folhas com jatos de água para reduzir a população.',
      'Em ataques fortes, usa óleo de nim e remove as folhas mais afetadas.',
    ],
    related: ['acaro-aranha'],
  },
  {
    id: 'folhas-pegajosas',
    emoji: '🍯',
    label: 'Folhas pegajosas e brilhantes (melada), às vezes com bolor preto',
    likely: 'Melada de pulgões ou cochonilha — açúcar que escorre e atrai fumagina (bolor preto) e formigas.',
    whatToDo: [
      'Procura colónias nos rebentos e no verso das folhas (pulgões) ou carapaças/algodão nos caules (cochonilha).',
      'Limpa a melada com pano húmido; em cochonilha, passa cotonete com álcool.',
      'Pulveriza com sabão potássico ou óleo de nim; controla as formigas que protegem as pragas.',
    ],
    related: ['afideo', 'cochonilha'],
  },
  {
    id: 'raizes-com-galhas',
    emoji: '🪱',
    label: 'Planta mirrada e a murchar com calor; raízes com nódulos ao arrancar',
    likely: 'Nemátodes-das-galhas no solo — vermes microscópicos que deformam as raízes e travam a absorção de água.',
    whatToDo: [
      'Arranca e destrói as plantas afetadas (não compostar).',
      'Faz rotação de culturas nesse canteiro durante alguns anos e adiciona matéria orgânica.',
      'Planta tagetes (cravo-túnico), que ajuda a repelir os nemátodes, e usa variedades resistentes.',
    ],
    related: ['nematodes'],
  },
  {
    id: 'folhas-crivadas',
    emoji: '⚫',
    label: 'Folhas jovens crivadas de pequenos buracos redondos (como tiros de chumbo)',
    likely: 'Áltica (pulga-da-terra), minúsculos besouros saltadores que atacam brássicas jovens (rúcula, rabanete) no tempo quente e seco.',
    whatToDo: [
      'Cobre as plântulas com rede fina logo após a sementeira.',
      'Mantém o solo húmido — a áltica gosta de seco e quente.',
      'Usa armadilhas adesivas amarelas e adia a sementeira para alturas mais frescas.',
    ],
    related: ['altica'],
  },
  {
    id: 'nuvem-brancos',
    emoji: '⚪',
    label: 'Nuvem de insetos brancos minúsculos ao tocar na planta',
    likely: 'Mosca-branca, comum em tomate e pimento (e em estufa/interior) — suga a seiva e deixa as folhas pegajosas e amareladas.',
    whatToDo: [
      'Pendura armadilhas adesivas amarelas perto das plantas.',
      'Pulveriza o verso das folhas com sabão potássico ou óleo de nim, ao fim do dia.',
      'Melhora a ventilação e remove folhas muito infestadas; o manjericão por perto ajuda a afastá-las.',
    ],
    related: ['mosca-branca'],
  },
]

export const SYMPTOMS_BY_ID: Record<string, Symptom> = Object.fromEntries(SYMPTOMS.map((s) => [s.id, s]))
