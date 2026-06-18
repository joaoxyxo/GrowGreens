# GrowGreens — Especificação das Funcionalidades Inteligentes

Stack: PWA Vue 3 + Supabase (Postgres, Auth, Storage) com Edge Functions (Deno) como proxy seguro. Padrão comum às três funcionalidades: **o cliente nunca fala diretamente com APIs externas nem guarda chaves**; tudo passa por uma Edge Function que injeta a chave (`Deno.env`), faz cache, aplica rate-limit por utilizador e normaliza a resposta.

---

## 1. Diagnóstico de plantas por foto (IA)

### 1.1 Opções avaliadas

| Opção | O que faz | Precisão real | Custo aprox. | PT | Veredito |
|---|---|---|---|---|---|
| **Plant.health (Kindwise)** | ID de espécie + diagnóstico de saúde (fungos, bactérias, vírus, pragas, deficiências). Confiança, sintomas, severidade, tratamento. | Lab 88-98% (ID); **saúde ~73% top-3**. Cai em campo mas é o melhor especializado. | €0,05/crédito → €0,01 em volume. Health = 1-2 créditos. | Sim (`pt`/`pt-BR`) | **Motor primário** |
| **Pl@ntNet API** | Só identificação de espécie (excelente flora europeia). Não diagnostica doenças. | Boa para botânica | Grátis limitado; Pro ~€1.000/ano | Científico; PT parcial | Complemento/fallback de ID |
| **VLM generalista (GPT-4o-mini / Claude vision)** | Análise multimodal aberta: sintomas, causas, conselhos em PT-PT, follow-up. | F1 ~73% com exemplos; propenso a alucinação sem curadoria | GPT-4o-mini $0,15/1M tokens input; ~$0,002-0,01/foto | PT-PT nativo | **Camada de conselho**, não classificador |

### 1.2 Abordagem recomendada (híbrida)
1. **Plant.health (Kindwise)** classifica (espécie + condição + severidade + confiança) — fonte de verdade.
2. **GPT-4o-mini** recebe o JSON + a foto e produz o **conselho final em PT-PT** adaptado ao contexto (cultura, estação, clima IPMA de Ovar).
3. **Gate de confiança:** se < ~50%, mostrar "diagnóstico incerto" e pedir nova foto guiada, em vez de inventar.

Resultado: precisão de classificador especializado + conselho conversacional localizado, com custo previsível (1-2 créditos + ~$0,005/diagnóstico).

### 1.3 Edge Function (esboço)
```ts
// supabase/functions/diagnose-plant/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  // Rate limit: máx. 5 diagnósticos/dia por utilizador
  const { count } = await supabase.from("diagnoses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id).gte("created_at", new Date(Date.now() - 864e5).toISOString());
  if ((count ?? 0) >= 5) return new Response("Quota diária excedida", { status: 429 });

  const { imageBase64, plantContext } = await req.json();

  // 1) Plant.health
  const ph = await fetch("https://plant.id/api/v3/health_assessment?language=pt&details=local_name,description,treatment", {
    method: "POST",
    headers: { "Api-Key": Deno.env.get("KINDWISE_API_KEY")!, "Content-Type": "application/json" },
    body: JSON.stringify({ images: [imageBase64], similar_images: true }),
  }).then(r => r.json());
  const top = ph.result?.disease?.suggestions?.[0];
  if (!top || top.probability < 0.5)
    return Response.json({ status: "incerto", hint: "Tira nova foto da folha afetada, de perto e com boa luz." });

  // 2) GPT-4o-mini: conselho PT-PT contextualizado
  const advice = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-4o-mini", messages: [
      { role: "system", content: "És um horticultor português. Responde em PT europeu, prático e curto. NÃO inventes diagnósticos; baseia-te no resultado fornecido." },
      { role: "user", content: [
        { type: "text", text: `Diagnóstico: ${top.name} (${Math.round(top.probability*100)}%). Contexto: ${JSON.stringify(plantContext)}. Dá 3 passos de tratamento e prevenção para hortas em Portugal.` },
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
      ]}]}),
  }).then(r => r.json());

  const result = { status: "ok", disease: top.name, confidence: top.probability,
    severity: top.details?.severity ?? null, advice: advice.choices[0].message.content };
  await supabase.from("diagnoses").insert({ user_id: user.id, result });
  return Response.json(result);
});
```

### 1.4 UX — fotos guiadas
Captura assistida (moldura + dicas "aproxima da folha doente", "evita contraluz", "uma planta de cada vez"); detetar foto desfocada/escura no cliente (variância de Laplaciano) antes de gastar crédito; pedir 1-3 ângulos; mostrar confiança com cor (verde >80%, âmbar 50-80%, incerto <50%); loop de follow-up do Plant.health.

### 1.5 Gestão de custo
Rate-limit por utilizador (5/dia grátis); comprimir imagem no cliente (~1024px, JPEG q0.7); cache por hash da imagem; comprar créditos Kindwise em volume; passo VLM como opcional/assíncrono (degradação graciosa).

---

## 2. Integração com meteorologia IPMA

API `api.ipma.pt/open-data`: **gratuita, sem chave, JSON, ficheiros estáticos atualizados ~2x/dia.**

### 2.1 Endpoints

| Função | URL | Notas |
|---|---|---|
| Lista de locais | `https://api.ipma.pt/open-data/distrits-islands.json` | Mapeia `globalIdLocal` ↔ `local`, lat/lon, `idAreaAviso`. |
| Previsão diária (até 5 dias) | `https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/{globalIdLocal}.json` | `data[]`; `dataUpdate` = frescura. |
| Avisos | `https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json` | Filtrar por `idAreaAviso`. |
| Índice UV | `https://api.ipma.pt/open-data/forecast/meteorology/uv/uv.json` | `iUv` por local/data. |
| Tabelas auxiliares | `weather-type-classe.json`, `precipitation-classe.json`, `wind-speed-daily-classe.json` | Descodificar códigos para texto PT. |

### 2.2 Formato (exemplo — Aveiro, `1010500`)
```json
{ "globalIdLocal": 1010500, "dataUpdate": "2026-04-06T10:31:02",
  "data": [{ "forecastDate": "2026-04-06", "tMin": "12.6", "tMax": "27.2",
    "precipitaProb": "100.0", "classPrecInt": 2, "idWeatherType": 6,
    "predWindDir": "SE", "classWindSpeed": 2 }] }
```
Chave: `tMin`/`tMax` (°C strings), `precipitaProb` (%), `classPrecInt` (1-3), `idWeatherType` (→ texto), `classWindSpeed`. Avisos: `awarenessTypeName`, `awarenessLevelID` (green/yellow/orange/red), `startTime`/`endTime`, `idAreaAviso`.

### 2.3 Mapear Ovar / Aveiro
Ovar não é capital de distrito (sem `globalIdLocal` próprio). **Previsão/UV → Aveiro `globalIdLocal = 1010500`** (~25 km). **Avisos → `idAreaAviso = "AVR"`**. Guardar tabela `localidades` que mapeia concelho → `globalIdLocal` + `idAreaAviso` (expansível).

### 2.4 Uso agronómico
- **Rega:** `precipitaProb ≥ 70%` ou `classPrecInt ≥ 2` nas próximas 24-48h → adiar/cancelar lembrete ("Vai chover amanhã, podes saltar a rega"); `tMax ≥ ~30°C` sem chuva → antecipar rega para manhã + rega extra; aviso Tempo Quente → alerta de stress térmico + sombreamento.
- **Janelas de plantação:** bloquear transplante com aviso Tempo Frio / `tMin` baixa (geada); recomendar sementeira em solo húmido; aviso Vento → adiar transplante de mudas frágeis.
- **UV:** `iUv` alto → sombreamento de mudas, rega ao fim do dia.

### 2.5 Cache
Ficheiros atualizam ~2x/dia → **cache 6-12h**. Tabela `weather_cache (global_id_local, payload jsonb, fetched_at)` ou Deno KV. Um fetch serve todos os utilizadores da mesma zona. Ideal: **cron** (`pg_cron`) que pré-popula 2x/dia.

### 2.6 Edge Function (esboço)
```ts
const CACHE_TTL_MS = 6 * 3600 * 1000;
serve(async (req) => {
  const { globalIdLocal = 1010500, idAreaAviso = "AVR" } = await req.json().catch(() => ({}));
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: cached } = await supabase.from("weather_cache")
    .select("payload, fetched_at").eq("global_id_local", globalIdLocal).single();
  if (cached && Date.now() - new Date(cached.fetched_at).getTime() < CACHE_TTL_MS)
    return Response.json(cached.payload);
  const [daily, warnings, uv] = await Promise.all([
    fetch(`https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/${globalIdLocal}.json`).then(r => r.json()),
    fetch(`https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json`).then(r => r.json()),
    fetch(`https://api.ipma.pt/open-data/forecast/meteorology/uv/uv.json`).then(r => r.json()),
  ]);
  const payload = { forecast: daily.data, updatedAt: daily.dataUpdate,
    warnings: warnings.filter((w:any) => w.idAreaAviso === idAreaAviso),
    uv: uv.filter((u:any) => u.globalIdLocal === globalIdLocal) };
  await supabase.from("weather_cache").upsert({ global_id_local: globalIdLocal, payload, fetched_at: new Date().toISOString() });
  return Response.json(payload);
});
```

---

## 3. Camada de receitas

### 3.1 Opções
| Opção | Cozinha PT | Custo | Notas |
|---|---|---|---|
| Spoonacular | Fraca; inglês | Grátis ~50pts/dia; pago $10-149+/mês | Bom `findByIngredients`, mas não PT |
| Edamam | Residual; inglês | Grátis teste; pago $49-999+/mês | Forte em nutrição/dietas |
| TheMealDB | Muito limitada; inglês | Gratuito | Só protótipo |
| **Base própria/curada (Supabase)** | **Total** — receitas PT-PT ligadas ao catálogo | Tempo de curadoria; zero API recorrente | **Recomendada** |

### 3.2 Recomendação
**Base própria/curada no Postgres.** O público é português; o conjunto de espécies cultiváveis numa horta caseira é finito (~40-80) → receitas relevantes são curáveis; controlo total de qualidade/idioma/sazonalidade; coerente com a missão educativa. **Spoonacular como complemento opcional** pós-MVP ("tenho excedente de X → ideias extra").

### 3.3 Modelo e ligação planta → receita
```
plantas        (id, nome_pt, ...)
receitas       (id, titulo, descricao, passos, tempo_min, porcoes, sazonalidade, imagem_url)
receita_planta (receita_id, planta_id, quantidade, papel)   -- N:N
```
Ao **registar uma colheita**, mostrar "O que cozinhar com a tua colheita de [planta]". Ordenar por nº de ingredientes que o utilizador tem; filtrar por `sazonalidade` (e clima IPMA — "noite fria → sopa"). Edge Function `recipes-for-harvest` (ou simples query Postgres via RLS).

---

## Resumo
1. **Diagnóstico:** híbrido **Plant.health + GPT-4o-mini**; gate a 50%; fotos guiadas; rate-limit 5/dia + compressão + cache.
2. **Meteorologia:** **IPMA open-data** (grátis). Ovar → Aveiro `1010500`, avisos `"AVR"`. Cache 6-12h + cron 2x/dia. Ajusta rega e janelas de plantação.
3. **Receitas:** **base própria curada** PT-PT ligada ao catálogo (N:N), acionada pela colheita; Spoonacular extra opcional.

Todas via Edge Functions Deno com chaves em `Deno.env`, RLS e cache/rate-limit.

> **Nota:** preços de APIs comerciais mudam — confirmar nas páginas de pricing antes de fechar orçamento. `globalIdLocal` de Aveiro (1010500) e `idAreaAviso "AVR"` confirmados no `distrits-islands.json` em junho de 2026.

## Fontes
- Kindwise Plant.health — https://www.kindwise.com/plant-health · pricing — https://www.kindwise.com/pricing
- Plant.id API v3 — https://documenter.getpostman.com/view/24599534/2s93z5A4v2
- Pl@ntNet API pricing — https://my.plantnet.org/pricing
- OpenAI pricing — https://openai.com/api/pricing/
- Plant Disease Detection w/ Multimodal LLMs (arXiv 2504.20419) — https://arxiv.org/pdf/2504.20419
- IPMA API — https://api.ipma.pt/ · locais — https://api.ipma.pt/open-data/distrits-islands.json · Aveiro — https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/1010500.json · avisos — https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json · UV — https://api.ipma.pt/open-data/forecast/meteorology/uv/uv.json
- Spoonacular — https://spoonacular.com/food-api/pricing · Edamam — https://www.edamam.com/
