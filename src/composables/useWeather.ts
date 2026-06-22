import { ref } from 'vue'

// Meteorologia via IPMA open-data (gratuita, sem chave).
// Mapeamento de zona -> globalIdLocal (capital de distrito mais próxima) + área de aviso.
export const ZONE_TO_IPMA: Record<string, { globalIdLocal: number; areaAviso: string; place: string }> = {
  litoral_norte: { globalIdLocal: 1010500, areaAviso: 'AVR', place: 'Aveiro' },
  interior_norte: { globalIdLocal: 1070500, areaAviso: 'VIS', place: 'Viseu' },
  litoral_sul: { globalIdLocal: 1080500, areaAviso: 'FAR', place: 'Faro' },
}

export interface DayForecast {
  date: string
  tMin: number
  tMax: number
  precipProb: number
  weatherType: number
}

/** Forma (parcial) de cada dia na resposta da API do IPMA. */
interface IpmaDay {
  forecastDate: string
  tMin: string
  tMax: string
  precipitaProb: string
  idWeatherType: number | string
}

const WEATHER_TYPES: Record<number, { label: string; emoji: string }> = {
  1: { label: 'Céu limpo', emoji: '☀️' },
  2: { label: 'Céu pouco nublado', emoji: '🌤️' },
  3: { label: 'Céu parc. nublado', emoji: '⛅' },
  4: { label: 'Céu nublado', emoji: '☁️' },
  5: { label: 'Céu muito nublado', emoji: '☁️' },
  6: { label: 'Aguaceiros', emoji: '🌦️' },
  7: { label: 'Aguaceiros', emoji: '🌦️' },
  8: { label: 'Aguaceiros fortes', emoji: '🌧️' },
  9: { label: 'Chuva', emoji: '🌧️' },
  10: { label: 'Chuva fraca', emoji: '🌦️' },
  11: { label: 'Chuva forte', emoji: '🌧️' },
  13: { label: 'Aguaceiros', emoji: '🌦️' },
  14: { label: 'Chuva', emoji: '🌧️' },
  15: { label: 'Chuvisco', emoji: '🌦️' },
}

export function weatherTypeInfo(id: number) {
  return WEATHER_TYPES[id] ?? { label: '—', emoji: '🌡️' }
}

export function useWeather() {
  const forecast = ref<DayForecast[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchFor(zoneCode: string) {
    const map = ZONE_TO_IPMA[zoneCode] ?? ZONE_TO_IPMA.litoral_norte
    loading.value = true
    error.value = null
    try {
      const res = await fetch(
        `https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/${map.globalIdLocal}.json`,
      )
      if (!res.ok) throw new Error('IPMA indisponível')
      const data: { data?: IpmaDay[] } = await res.json()
      forecast.value = (data.data ?? []).slice(0, 5).map((d) => ({
        date: d.forecastDate,
        tMin: parseFloat(d.tMin),
        tMax: parseFloat(d.tMax),
        precipProb: parseFloat(d.precipitaProb),
        weatherType: Number(d.idWeatherType),
      }))
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return { forecast, loading, error, fetchFor }
}

// Conselho de rega a partir da previsão (regra agronómica simples)
export function wateringAdvice(forecast: DayForecast[]): string | null {
  if (!forecast.length) return null
  const today = forecast[0]
  const tomorrow = forecast[1]
  if ((tomorrow && tomorrow.precipProb >= 70) || today.precipProb >= 70) {
    return '🌧️ Vai chover em breve — podes saltar a rega de exterior.'
  }
  if (today.tMax >= 30) {
    return '🔥 Dia quente — rega de manhã cedo e vigia a sede das plantas.'
  }
  return null
}
