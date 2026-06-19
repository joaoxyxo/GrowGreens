import type { NutrientGroup } from '@/types/catalog'

export const NUTRIENT_GROUPS: NutrientGroup[] = [
  {
    code: 'folhas_verdes',
    name: 'Folhas verdes',
    emoji: '🥬',
    plants: ['alface', 'espinafre', 'acelga', 'agriao'],
    whyGood: [
      'Muito baixas em calorias e ricas em fibra — saciam sem pesar.',
      'Das melhores fontes de folato e vitamina K, importantes para o sangue e os ossos.',
      'Contêm nitratos naturais (espinafre) associados a melhor tensão arterial.',
    ],
    nutrients: [
      { nutrient: 'Vitamina K', effect: 'Coagulação do sangue e saúde óssea.' },
      { nutrient: 'Folato (B9)', effect: 'Formação de células; essencial na gravidez.' },
      { nutrient: 'Luteína', effect: 'Acumula-se na retina e protege a visão.' },
      { nutrient: 'Fibra', effect: 'Digestão e saciedade.' },
    ],
    tip: 'O efeito do alimento inteiro supera o dos suplementos — come as folhas, não pastilhas.',
  },
  {
    code: 'brassicas',
    name: 'Brássicas (crucíferas)',
    emoji: '🥦',
    plants: ['brocolos', 'rabanete', 'rucula', 'couve-galega', 'couve-flor', 'couve-lombarda', 'nabo'],
    whyGood: [
      'Contêm glucosinolatos, precursores do sulforafano, estudado pelo seu potencial anticancerígeno.',
      'O consumo regular associa-se a menor mortalidade por todas as causas.',
      'Ricas em vitamina C e fibra.',
    ],
    nutrients: [
      { nutrient: 'Sulforafano', effect: 'Composto bioativo com potencial protetor.' },
      { nutrient: 'Vitamina C', effect: 'Imunidade e absorção de ferro.' },
      { nutrient: 'Fibra', effect: 'Saúde intestinal.' },
    ],
    tip: 'Comer parte crua (rúcula, rabanete) preserva a vitamina C; cozinhar pouco mantém mais nutrientes.',
    caution: 'Em grandes quantidades cruas podem afetar a tiroide em pessoas sensíveis — variedade é a chave.',
  },
  {
    code: 'frutos_raizes',
    name: 'Frutos e raízes',
    emoji: '🍅',
    plants: ['tomate', 'pimento', 'cenoura', 'beterraba', 'courgette', 'pepino', 'abobora', 'beringela', 'melao', 'batata', 'alho-frances'],
    whyGood: [
      'O tomate é a principal fonte de licopeno, ligado à saúde cardiovascular.',
      'Cenoura e beterraba dão beta-caroteno e nitratos benéficos.',
      'Ricos em vitamina C, potássio e antioxidantes.',
    ],
    nutrients: [
      { nutrient: 'Licopeno', effect: 'Antioxidante; mais disponível com calor e gordura.' },
      { nutrient: 'Beta-caroteno', effect: 'Precursor da vitamina A; visão e pele.' },
      { nutrient: 'Potássio', effect: 'Equilíbrio de fluidos e tensão arterial.' },
    ],
    tip: 'O tomate cozinhado com um fio de azeite liberta MAIS licopeno do que cru. Come os dois!',
  },
  {
    code: 'leguminosas',
    name: 'Leguminosas',
    emoji: '🫛',
    plants: ['feijao-verde', 'ervilha', 'fava', 'feijao-frade'],
    whyGood: [
      'Fonte económica de proteína vegetal e fibra solúvel.',
      'Ajudam a baixar o colesterol LDL e a controlar a glicemia (baixo índice glicémico).',
      'Comê-las várias vezes por semana associa-se a menor risco cardíaco.',
    ],
    nutrients: [
      { nutrient: 'Proteína vegetal', effect: 'Construção e reparação dos tecidos.' },
      { nutrient: 'Fibra solúvel', effect: 'Reduz o colesterol; alimenta a flora intestinal.' },
      { nutrient: 'Folato e ferro', effect: 'Energia e formação de sangue.' },
    ],
    tip: 'Combina com uma fonte de vitamina C (ex.: pimento) para absorver melhor o ferro vegetal.',
  },
  {
    code: 'aromaticas',
    name: 'Aromáticas',
    emoji: '🌿',
    plants: ['manjericao', 'salsa', 'hortela', 'alecrim', 'coentros', 'cebolinho', 'tomilho', 'oregaos', 'louro', 'funcho'],
    whyGood: [
      'Concentram antioxidantes e óleos essenciais num volume pequeno.',
      'Dão muito sabor — ajudam a reduzir o sal nas refeições.',
      'A salsa é rica em vitaminas A, C e K; o manjericão tem eugenol anti-inflamatório.',
      'Coentros e funcho ajudam a digestão; o tomilho e os orégãos são ricos em compostos antimicrobianos.',
    ],
    nutrients: [
      { nutrient: 'Antioxidantes (polifenóis)', effect: 'Combatem o stress oxidativo.' },
      { nutrient: 'Vitamina K', effect: 'Saúde óssea e do sangue.' },
      { nutrient: 'Óleos essenciais', effect: 'Aroma e propriedades antimicrobianas.' },
    ],
    tip: 'Adiciona as folhas frescas no fim da cozedura para preservar o aroma e os nutrientes.',
  },
]

export const NUTRIENT_GROUPS_BY_CODE: Record<string, NutrientGroup> = Object.fromEntries(
  NUTRIENT_GROUPS.map((g) => [g.code, g]),
)

export const HEALTH_DISCLAIMER =
  'Esta informação é educativa e baseada em evidência geral. Não substitui aconselhamento médico ou nutricional individual.'
