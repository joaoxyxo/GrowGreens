// Dúvidas frequentes de quem está a começar — respostas curtas em pt-PT.
export interface FaqItem {
  q: string
  a: string
  emoji: string
}

export const FAQ: FaqItem[] = [
  {
    emoji: '💧',
    q: 'Com que frequência devo regar?',
    a: 'Depende da planta e do tempo, não do calendário. Faz o teste do dedo: mete-o ~2 cm no substrato — se estiver húmido, espera; se estiver seco, rega. Em casa, morre-se mais por água a mais do que a menos.',
  },
  {
    emoji: '☀️',
    q: 'Quanta luz precisam as plantas?',
    a: 'Folhas e ervas contentam-se com 3-4 h de sol (meia-sombra); frutos como tomate e pepino querem 6 h ou mais de sol direto. Caules compridos e pálidos são sinal de pouca luz.',
  },
  {
    emoji: '🪴',
    q: 'Que vaso devo usar?',
    a: 'O suficiente para as raízes e SEMPRE com furos de drenagem. Folhas e ervas vivem em 2-3 L; raízes e frutos pedem 8-20 L. Sem furos, a água parada apodrece as raízes.',
  },
  {
    emoji: '🌱',
    q: 'Posso começar sem experiência nenhuma?',
    a: 'Sim. Começa pelos microgreens (colheita em ~7 dias) ou por folhas fáceis como rúcula e alface. O Desafio guia-te dia a dia.',
  },
  {
    emoji: '🌿',
    q: 'Preciso de adubar?',
    a: 'No início, um bom substrato com composto chega. Plantas de fruto (tomate, pepino) são gulosas e agradecem adubo durante a frutificação. Folhas e ervas precisam de pouco.',
  },
  {
    emoji: '🐛',
    q: 'Apareceram bichos/manchas — e agora?',
    a: 'Vai a "A minha planta não está bem" e identifica pelo sintoma. No litoral húmido, a maioria dos problemas é fungo (rega de manhã e na base ajuda a prevenir).',
  },
  {
    emoji: '🏠',
    q: 'Interior ou exterior?',
    a: 'Folhas e ervas crescem bem num parapeito soalheiro; frutos (tomate, pepino) precisam de muito sol e ficam melhor numa varanda/quintal. Os microgreens fazem-se sempre em casa, o ano todo.',
  },
  {
    emoji: '🧺',
    q: 'Quando é que sei que está pronto para colher?',
    a: 'Cada ficha do catálogo indica os dias até à colheita e o ponto certo. Em geral: folhas colhem-se jovens (corta-e-volta), frutos quando bem corados e firmes, raízes quando engrossam.',
  },
  {
    emoji: '🪟',
    q: 'Tenho pragas dentro de casa — é normal?',
    a: 'Sim, sobretudo pulgões, mosca-branca e cochonilha em plantas de interior. Areja o espaço, limpa as folhas e usa sabão potássico ou óleo de nim. Evita regar a mais.',
  },
  {
    emoji: '🌿',
    q: 'Adubo orgânico ou químico?',
    a: 'Para uma horta de casa, o orgânico (composto, estrume curado, húmus de minhoca) é a melhor base: alimenta o solo e liberta nutrientes devagar. O químico age rápido mas, em excesso, queima raízes e acidifica. Começa pelo composto.',
  },
  {
    emoji: '🫙',
    q: 'Vale a pena guardar sementes?',
    a: 'Sim, de variedades tradicionais (não híbridas F1, que não saem "iguais"). Deixa secar bem as sementes de tomate, feijão, alface ou ervilha e guarda-as num frasco, ao escuro e seco. Poupas e ganhas plantas adaptadas ao teu espaço.',
  },
  {
    emoji: '☀️',
    q: 'Quantas horas de sol precisa a minha horta?',
    a: 'A maioria das hortícolas de fruto (tomate, pimento, courgette) quer 6+ horas de sol direto. Folhas e ervas aromáticas safam-se com 4-5h. Em varandas viradas a norte, aposta em alface, rúcula, espinafre e microgreens, que toleram menos sol.',
  },
  {
    emoji: '🐝',
    q: 'Tenho flores mas não dão fruto. Porquê?',
    a: 'Em tomate, courgette ou pepino é quase sempre falta de polinização (poucos insetos numa varanda) ou calor extremo. Abana as plantas de manhã para soltar o pólen, ou poliniza à mão com um pincel. Atrai abelhas com flores por perto (calêndula, manjericão a florir).',
  },
  {
    emoji: '🌡️',
    q: 'Posso semear no inverno?',
    a: 'Sim, mas escolhe culturas de frio: favas, ervilhas, couves, alho, cebola, espinafre e alface de inverno. No litoral atlântico o frio raramente é extremo. Em interior, os microgreens dão o ano todo.',
  },
  {
    emoji: '🪴',
    q: 'Que tamanho de vaso preciso?',
    a: 'Depende da planta: folhas e ervas safam-se com 3-5 L; tomate, pimento e courgette querem 15-30 L para a raiz se desenvolver. Vaso pequeno = rega constante e planta a sofrer. Na ficha de cada planta indicamos o volume mínimo.',
  },
  {
    emoji: '💧',
    q: 'Rego de manhã ou à noite?',
    a: 'De manhã, sempre que possível: a planta bebe antes do calor e a folha seca durante o dia, o que evita fungos como o míldio. Rega à noite só em última opção — a humidade que fica nas folhas convida a doenças.',
  },
  {
    emoji: '🌱',
    q: 'As minhas sementes não nascem. Porquê?',
    a: 'As causas mais comuns: enterraste-as fundo demais (a regra é ~2-3× a largura da semente), o solo secou na germinação, ou a temperatura está baixa. Mantém húmido (não encharcado) e ao calor, e dá tempo — algumas demoram 2-3 semanas.',
  },
  {
    emoji: '🪴',
    q: 'Que substrato uso para semear?',
    a: 'Para sementeira, um substrato fino, leve e bem drenante (turfa/fibra de coco + perlite) dá melhores resultados que terra de jardim pesada. Para vasos definitivos, mistura com composto. Evita terra do quintal compactada — sufoca as raízes.',
  },
  {
    emoji: '🌗',
    q: 'A minha varanda só tem sol parte do dia. Dá para horta?',
    a: 'Dá! Com 3-4 horas de sol cultivas folhas (alface, rúcula, espinafre), aromáticas (salsa, hortelã, cebolinho) e rabanetes. Frutos como tomate e pimento querem mais sol; em meia-sombra produzem pouco. E há sempre os microgreens, que dão dentro de casa.',
  },
  {
    emoji: '♻️',
    q: 'Posso fazer composto numa varanda?',
    a: 'Sim — com um vermicompostor (caixa com minhocas) fazes húmus a partir de restos de cozinha, sem cheiro e em pouco espaço. Evita carne, lacticínios e cítricos em excesso. Em poucos meses tens adubo caseiro de qualidade.',
  },
]
