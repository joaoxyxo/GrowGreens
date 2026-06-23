// Chave de diagnóstico dicotómica — guia o utilizador por perguntas simples até
// uma causa provável, como faz um fitopatologista. As folhas-resultado apontam
// para um sintoma de `troubleshoot.ts` (id), onde está o "o que fazer".

export interface KeyQuestion {
  id: string
  kind: 'question'
  question: string
  options: { label: string; next: string; emoji?: string }[]
}
export interface KeyResult {
  id: string
  kind: 'result'
  /** id de um Symptom em troubleshoot.ts */
  symptomId: string
}
export type KeyNode = KeyQuestion | KeyResult

export const KEY_ROOT = 'start'

export const DIAGNOSIS_KEY: Record<string, KeyNode> = {
  start: {
    id: 'start',
    kind: 'question',
    question: 'Onde notas o problema?',
    options: [
      { label: 'Nas folhas', emoji: '🍃', next: 'folhas' },
      { label: 'Na planta toda (murcha/esticada)', emoji: '🥀', next: 'planta' },
      { label: 'Nas flores ou frutos', emoji: '🌸', next: 'fruto' },
      { label: 'Nas sementes / plântulas', emoji: '🌱', next: 'plantula' },
    ],
  },

  // --- Folhas ---
  folhas: {
    id: 'folhas',
    kind: 'question',
    question: 'O que vês nas folhas?',
    options: [
      { label: 'Estão amarelas', emoji: '🟡', next: 'folhas-amarelas' },
      { label: 'Têm manchas ou pó', emoji: '🔬', next: 'folhas-manchas' },
      { label: 'Têm buracos / estão a ser comidas', emoji: '🐛', next: 'folhas-buracos' },
      { label: 'Estão pegajosas, com teias ou bichos', emoji: '🕸️', next: 'folhas-bichos' },
      { label: 'As pontas estão castanhas/secas', emoji: '🍂', next: 'pontas-castanhas' },
    ],
  },
  'folhas-amarelas': {
    id: 'folhas-amarelas',
    kind: 'question',
    question: 'Como é o amarelecimento?',
    options: [
      { label: 'Folha toda amarela (começa pelas mais velhas)', next: 'amarela' },
      { label: 'Amarelo entre as nervuras, que ficam verdes', next: 'clorose' },
    ],
  },
  'folhas-manchas': {
    id: 'folhas-manchas',
    kind: 'question',
    question: 'É pó ou são manchas?',
    options: [
      { label: 'Pó branco farinhento por cima', next: 'po-branco' },
      { label: 'Manchas amareladas + penugem por baixo', next: 'manchas' },
    ],
  },
  'folhas-buracos': {
    id: 'folhas-buracos',
    kind: 'question',
    question: 'Como são os buracos?',
    options: [
      { label: 'Buracos grandes + rastos prateados ou lagartas', next: 'bichos' },
      { label: 'Crivadas de furinhos redondos (folhas jovens)', next: 'folhas-crivadas' },
    ],
  },
  'folhas-bichos': {
    id: 'folhas-bichos',
    kind: 'question',
    question: 'O que observas mais de perto?',
    options: [
      { label: 'Teias muito finas + pontilhado claro', next: 'teias-finas' },
      { label: 'Folhas pegajosas/brilhantes (melada)', next: 'folhas-pegajosas' },
      { label: 'Nuvem de insetos brancos ao tocar', next: 'nuvem-brancos' },
    ],
  },

  // --- Planta toda ---
  planta: {
    id: 'planta',
    kind: 'question',
    question: 'Como está a planta?',
    options: [
      { label: 'Murcha / caída', emoji: '🥀', next: 'planta-murcha' },
      { label: 'Esticada, pálida e frágil', emoji: '📏', next: 'esticada' },
    ],
  },
  'planta-murcha': {
    id: 'planta-murcha',
    kind: 'question',
    question: 'O solo está...',
    options: [
      { label: 'Seco ao toque', next: 'murcha' },
      { label: 'Húmido/encharcado, mas continua murcha', next: 'raizes-com-galhas' },
    ],
  },

  // --- Flores / frutos ---
  fruto: {
    id: 'fruto',
    kind: 'question',
    question: 'O que se passa?',
    options: [
      { label: 'As flores caem sem dar fruto', next: 'flores-caem' },
      { label: 'Mancha preta e mole na base do fruto', next: 'ponta-podre' },
      { label: 'Nuvem de insetos brancos', next: 'nuvem-brancos' },
    ],
  },

  // --- Sementes / plântulas ---
  plantula: {
    id: 'plantula',
    kind: 'question',
    question: 'O que aconteceu?',
    options: [
      { label: 'As sementes não nascem', next: 'nao-germina' },
      { label: 'A plântula tombou/apodreceu à superfície', next: 'damping-off' },
    ],
  },

  // --- Resultados (apontam para sintomas) ---
  amarela: { id: 'amarela', kind: 'result', symptomId: 'amarela' },
  clorose: { id: 'clorose', kind: 'result', symptomId: 'clorose' },
  'po-branco': { id: 'po-branco', kind: 'result', symptomId: 'po-branco' },
  manchas: { id: 'manchas', kind: 'result', symptomId: 'manchas' },
  bichos: { id: 'bichos', kind: 'result', symptomId: 'bichos' },
  'folhas-crivadas': { id: 'folhas-crivadas', kind: 'result', symptomId: 'folhas-crivadas' },
  'teias-finas': { id: 'teias-finas', kind: 'result', symptomId: 'teias-finas' },
  'folhas-pegajosas': { id: 'folhas-pegajosas', kind: 'result', symptomId: 'folhas-pegajosas' },
  'nuvem-brancos': { id: 'nuvem-brancos', kind: 'result', symptomId: 'nuvem-brancos' },
  'pontas-castanhas': { id: 'pontas-castanhas', kind: 'result', symptomId: 'pontas-castanhas' },
  murcha: { id: 'murcha', kind: 'result', symptomId: 'murcha' },
  'raizes-com-galhas': { id: 'raizes-com-galhas', kind: 'result', symptomId: 'raizes-com-galhas' },
  esticada: { id: 'esticada', kind: 'result', symptomId: 'esticada' },
  'flores-caem': { id: 'flores-caem', kind: 'result', symptomId: 'flores-caem' },
  'ponta-podre': { id: 'ponta-podre', kind: 'result', symptomId: 'ponta-podre' },
  'nao-germina': { id: 'nao-germina', kind: 'result', symptomId: 'nao-germina' },
  'damping-off': { id: 'damping-off', kind: 'result', symptomId: 'damping-off' },
}
