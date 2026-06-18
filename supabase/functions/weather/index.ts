// Edge Function (Deno) — proxy + cache da meteorologia IPMA.
// Deploy: supabase functions deploy weather
// A app funciona sem isto (chama o IPMA diretamente); esta função adiciona cache/normalização.

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const { globalIdLocal = 1010500 } = await req.json().catch(() => ({}))
    const res = await fetch(
      `https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/${globalIdLocal}.json`,
    )
    const data = await res.json()
    const payload = {
      updatedAt: data.dataUpdate,
      forecast: (data.data ?? []).slice(0, 5).map((d: any) => ({
        date: d.forecastDate,
        tMin: parseFloat(d.tMin),
        tMax: parseFloat(d.tMax),
        precipProb: parseFloat(d.precipitaProb),
        weatherType: Number(d.idWeatherType),
      })),
    }
    return new Response(JSON.stringify(payload), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: cors })
  }
})
