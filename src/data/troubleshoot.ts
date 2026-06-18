// Resolução de problemas por sintomas — sem IA, em linguagem de principiante.
export interface Symptom {
  id: string
  emoji: string
  label: string
  likely: string
  whatToDo: string[]
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
]
