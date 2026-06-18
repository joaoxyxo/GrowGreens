// Edge Function (Deno) — diagnóstico de plantas por foto (DESATIVADO por defeito).
// Requer chaves: KINDWISE_API_KEY e OPENAI_API_KEY (supabase secrets set ...).
// Abordagem: Plant.health (classificação) + GPT-4o-mini (conselho PT-PT). Ver docs/04.
// Enquanto não houver chaves, devolve 503 e a app mostra o ecrã "em breve".

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const kindwise = Deno.env.get('KINDWISE_API_KEY')
  const openai = Deno.env.get('OPENAI_API_KEY')
  if (!kindwise || !openai) {
    return new Response(
      JSON.stringify({ status: 'desativado', message: 'Diagnóstico por IA ainda não configurado.' }),
      { status: 503, headers: { ...cors, 'Content-Type': 'application/json' } },
    )
  }

  try {
    const { imageBase64 } = await req.json()
    const ph = await fetch(
      'https://plant.id/api/v3/health_assessment?language=pt&details=local_name,description,treatment',
      {
        method: 'POST',
        headers: { 'Api-Key': kindwise, 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: [imageBase64], similar_images: true }),
      },
    ).then((r) => r.json())

    const top = ph?.result?.disease?.suggestions?.[0]
    if (!top || top.probability < 0.5) {
      return new Response(
        JSON.stringify({ status: 'incerto', hint: 'Tira nova foto da zona afetada, de perto e com boa luz.' }),
        { headers: { ...cors, 'Content-Type': 'application/json' } },
      )
    }

    const advice = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openai}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'És um horticultor português. Responde em português europeu, prático e curto. NÃO inventes diagnósticos; baseia-te no resultado fornecido.',
          },
          {
            role: 'user',
            content: `Diagnóstico do classificador: ${top.name} (${Math.round(top.probability * 100)}%). Dá 3 passos de tratamento e prevenção para hortas em Portugal (clima atlântico).`,
          },
        ],
      }),
    }).then((r) => r.json())

    return new Response(
      JSON.stringify({
        status: 'ok',
        disease: top.name,
        confidence: top.probability,
        advice: advice?.choices?.[0]?.message?.content ?? '',
      }),
      { headers: { ...cors, 'Content-Type': 'application/json' } },
    )
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: cors })
  }
})
