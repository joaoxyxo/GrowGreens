export interface AchievementDef {
  code: string
  name: string
  description: string
  emoji: string
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    code: 'primeira_colheita',
    name: 'Primeira Colheita',
    description: 'Concluíste o desafio dos microgreens e colheste comida do zero.',
    emoji: '🌱',
  },
  {
    code: 'semeador',
    name: 'Semeador',
    description: 'Adicionaste a tua primeira planta à horta.',
    emoji: '🪴',
  },
  {
    code: 'mao_verde',
    name: 'Mão Verde',
    description: 'Tens 5 plantas a crescer ao mesmo tempo.',
    emoji: '🌿',
  },
  {
    code: 'aprendiz',
    name: 'Aprendiz',
    description: 'Concluíste a tua primeira lição.',
    emoji: '📗',
  },
  {
    code: 'estudioso',
    name: 'Estudioso',
    description: 'Concluíste 10 lições do curso.',
    emoji: '🎓',
  },
  {
    code: 'constante',
    name: 'Constante',
    description: 'Mantiveste uma sequência de 7 dias.',
    emoji: '🔥',
  },
  {
    code: 'diarista',
    name: 'Diarista',
    description: 'Registaste 10 entradas no diário.',
    emoji: '📸',
  },
  {
    code: 'caca_fungos',
    name: 'Caçador de Fungos',
    description: 'Aprendeste a prevenir o míldio e o oídio.',
    emoji: '🛡️',
  },
  {
    code: 'colecionador',
    name: 'Colecionador',
    description: 'Cultivaste 10 espécies diferentes do catálogo.',
    emoji: '🌻',
  },
]

export function achievementDef(code: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.code === code)
}
