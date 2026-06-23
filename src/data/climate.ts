// Normais climáticas (média mensal da temperatura, °C) por zona — aproximações
// para o clima de Portugal, suficientes para estimar o calor acumulado (graus-dia)
// que governa o ritmo de desenvolvimento das plantas. Jan(1) … Dez(12).
//
// Fonte: médias mensais típicas (normais 1991–2020, IPMA, arredondadas) das
// estações de referência de cada zona.
export const ZONE_CLIMATE_NORMALS: Record<string, number[]> = {
  // Aveiro / Ovar — litoral atlântico, ameno e húmido.
  litoral_norte: [10.5, 11, 12.5, 14, 16, 18.5, 20, 20, 19, 16.5, 13, 11],
  // Viseu — interior, invernos frios e verões quentes.
  interior_norte: [6.5, 8, 10.5, 12, 15, 19, 22, 21.5, 19, 14, 10, 7],
  // Faro / Alentejo litoral — mais quente e seco.
  litoral_sul: [12, 13, 15, 17, 19.5, 23, 25, 25, 23, 19.5, 15.5, 13],
}

const FALLBACK_ZONE = 'litoral_norte'

/** Temperatura média (°C) de um mês (1-12) numa zona. Cai no litoral norte se a zona for desconhecida. */
export function monthlyMeanTemp(zone: string, month: number): number {
  const normals = ZONE_CLIMATE_NORMALS[zone] ?? ZONE_CLIMATE_NORMALS[FALLBACK_ZONE]
  const idx = Math.min(12, Math.max(1, Math.round(month))) - 1
  return normals[idx]
}
