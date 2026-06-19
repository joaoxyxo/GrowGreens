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
]
