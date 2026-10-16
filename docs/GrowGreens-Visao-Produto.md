# GrowGreens — Documento de Visão de Produto

> App web (PWA) que ensina qualquer pessoa a cultivar plantas, legumes e vegetais, da semente à colheita — com acompanhamento prático, camada de saúde/nutrição e um desafio real de microgreens em 7 dias.
>
> **Estado:** rascunho v1 · **Autor:** Jonita (+ assistência Claude) · **Local:** Ovar, Aveiro · **Data:** junho 2026

---

## 1. Visão

Pegar numa pessoa que **nunca cultivou nada** e levá-la, passo a passo, da primeira semente à primeira colheita — provando-lhe valor em 7 dias com microgreens reais e, a partir daí, ensinando-a a cultivar praticamente tudo o que existe, de forma simples, prática e adaptada ao clima onde vive.

A app responde a três perguntas em cada momento: **o que plantar**, **como plantar e cuidar** (fase a fase), e **o que isto faz bem ao corpo**.

### O problema que resolve
O principiante absoluto desiste cedo porque (1) recebe conselhos genéricos, soltos e muitas vezes errados, (2) não tem feedback rápido — uma horta demora meses a dar algo —, e (3) as apps existentes ou são bases de dados de cuidados (assumem que já tens a planta) ou planeadores para quem já sabe planear uma horta. **Ninguém ensina de raiz, em formato de percurso, localizado para Portugal.**

### Porque é que isto pode resultar
- O **desafio dos microgreens** dá uma vitória real em 5–8 dias — combate diretamente a desistência precoce.
- O ângulo **saúde/nutrição** está subexplorado pelos concorrentes e tem base científica forte.
- O mercado *gardening-tech* cresce ~12–14%/ano e não há equivalente "Duolingo da horticultura" em português europeu.

---

## 2. Público-alvo e posicionamento

**Utilizador-tipo:** principiante absoluto, urbano ou semi-urbano, com varanda/peitoril/pequeno quintal, motivado por comer melhor, poupar, sustentabilidade e bem-estar. Mercado inicial: **Portugal** (a app nasce calibrada para o clima de Ovar/Aveiro e generaliza por região).

**Posicionamento:** *educação + saúde*, não "mais uma ferramenta de jardinagem". Esta categoria gera mais valor por utilizador e diferencia das líderes.

**Concorrentes e o espaço vazio:**

| App | O que é | O que lhe falta (a nossa oportunidade) |
|---|---|---|
| Planta, PictureThis, Blossom | Cuidados + identificação por foto | Assumem que já tens a planta; sem percurso de aprendizagem; foco em plantas de interior decorativas |
| Seed to Spoon | Cultivo de comida, personalizado | Centrado nos EUA (calendário/variedades), com anúncios |
| Seedtime, GrowVeg | Planeadores de horta | Para quem já sabe planear; complexos para o principiante |
| PlantNet | Identificação científica grátis | Só identifica — não ensina nem acompanha |

Nenhuma combina **principiante absoluto + percurso semente-à-colheita + formato curso/gamificado + localização PT + camada de saúde**. É esse o nosso lugar.

---

## 3. Os quatro pilares do produto

1. **Curso guiado (estilo Duolingo)** — percurso de lições curtas e progressivas, vitórias fáceis primeiro, conceitos repetidos com espaçamento. Cria hábito diário.
2. **Acompanhamento prático** — diário com fotos, lembretes de rega/luz, calendário de plantação **localizado para Portugal/Ovar**, progresso por cultura e por fase de crescimento.
3. **Camada de saúde/nutrição** — para cada planta, o que ganhas (vitaminas, antioxidantes, efeitos no corpo) com base em evidência; sugestões do que plantar por objetivo nutricional; ligação a receitas.
4. **Desafio dos microgreens** — onboarding de 7 dias com resultado real à mesa. O gancho que prova valor antes de pedir qualquer compromisso.

---

## 4. O desafio dos microgreens (onboarding de 7 dias)

A primeira experiência da app. Objetivo: o utilizador semeia no Dia 0 e colhe ao Dia ~7, ganhando confiança imediata.

**Variedades recomendadas para o teste (taxa de sucesso alta, ~5–8 dias):** rabanete (a mais à prova de falha), mostarda, brócolos.

**Equipamento mínimo (arranque por menos de 20€):** dois recipientes (um com furos de drenagem, outro por baixo), substrato fino esterilizado ou fibra de coco, sementes, borrifador e uma **janela soalheira** (a luz LED é opcional no início).

**Fluxo dia a dia, com notificações:**

| Dia | Fase | O que a app pede |
|---|---|---|
| 0 | Sementeira + peso/blackout | Encher, nivelar, humedecer, espalhar sementes densas e uniformes, tapar (escuro) e pôr peso leve |
| 1–3 | Blackout | Borrifar 1–2x/dia; manter às escuras; tirar o peso ao fim de ~3 dias |
| 3–4 | Saída para a luz | Quando ~90% germinou e os caules levantam o tabuleiro: começar com luz suave |
| 4–6 | Crescimento | 12–16h de luz/janela; regar **pela base**; garantir circulação de ar |
| 7 | Colheita | Cortar acima do substrato; provar; registar foto e resultado |

**Problemas a antecipar na app (avisos contextuais):** bolor (não confundir com pelos radiculares), *damping off*, excesso de água. Regra-mestra ensinada: controlar humidade e arejamento resolve quase tudo.

**Gancho de saúde:** os microgreens têm 4–40x mais densidade de certos nutrientes que a planta adulta — mensagem perfeita para fechar o desafio e abrir o resto da app.

---

## 5. Catálogo de plantas — "conseguir pesquisar tudo o que existe"

O catálogo é o coração de dados da app: pesquisável, filtrável, e o mais completo possível. Crescemos por fases, mas o **modelo de dados é desenhado para escalar para centenas de plantas** desde o início.

### Modelo de dados (ficha de planta)
```
Planta
├─ nome_comum, nome_cientifico, fotos[]
├─ categoria            (folhas | raízes | frutos | leguminosas | brássicas | aromáticas | bolbos)
├─ dificuldade          (fácil | médio | difícil)
├─ local                (interior | exterior | ambos)
├─ dias_colheita_min/max
├─ metodo               (sementeira direta | transplante)
├─ epoca_sementeira[]   (por mês, ajustável por região/zona climática)
├─ sol_horas_min, ph_min/max, volume_vaso_litros
├─ rega, substrato, espacamento   (instruções práticas)
├─ companheiras[], incompativeis[]   (companion planting)
├─ pragas_comuns[], doencas_comuns[]
├─ beneficios_saude     (ligado ao grupo nutricional)
└─ receitas[]           (ligação à camada de cozinha)

FaseDeCrescimento (tabela própria, reutilizável)
└─ germinação · plântula · vegetativo · floração · frutificação · colheita
   cada uma com: o que fazer (rega, luz, nutrientes, transplante)
```

As **6 fases universais de crescimento** são uma tabela partilhada por todas as plantas — escreve-se uma vez e o curso/acompanhamento reutiliza-as, parametrizando por planta.

### Filtros de pesquisa (o "pesquisar tudo")
Por categoria, dificuldade, interior/exterior, época atual ("o que posso semear este mês em Ovar"), tempo até colheita, espaço disponível (vaso/varanda/quintal), e objetivo nutricional.

### Localização inteligente
Ovar fica entre **Zona 1 (litoral, invernos suaves, muita humidade)** e **Zona 2 (interior, risco de geada até meados de abril)**. A app deteta a região do utilizador e ajusta calendário e alertas. Aviso transversal para este clima atlântico: **o maior risco não é o frio, é o fungo** (míldio/oídio) — incluir dicas de prevenção (espaçamento, rega de manhã e na base, ventilação).

---

## 6. Funcionalidades

### Núcleo (MVP)
- Desafio dos microgreens (onboarding de 7 dias)
- Catálogo de plantas pesquisável + fichas detalhadas
- Calendário de plantação localizado ("o que semear este mês")
- "As minhas plantas": acompanhamento por fase, diário com fotos, lembretes de rega/luz
- Lições do curso guiado (conteúdo base)
- Camada de saúde por planta/grupo

### Nice-to-haves escolhidos (fases seguintes)
- **Diagnóstico por foto (IA):** o utilizador fotografa a planta; a IA avalia saúde e deteta fungos/pragas. *Nota técnica:* a precisão cai muito do laboratório para o mundo real — usar **fotos guiadas** (boa luz, enquadramento) e tratar a IA como assistente, não oráculo.
- **Integração meteorologia (IPMA):** ajustar lembretes de rega e janelas de plantação ao tempo real de Ovar.
- **Receitas e cozinha:** ligar a colheita a receitas que aproveitam o que cultivaste.

### Gamificação (transversal, leve)
*Streaks* de rega/cuidado, XP e níveis, conquistas por colheita. São das ferramentas de retenção mais eficazes — mas ao serviço do hábito, sem ruído.

---

## 7. Conteúdo educativo

Produzido por mim (Claude), em **português europeu, prático e simples**, com base na pesquisa já reunida. Estrutura:

- **Lições do curso:** módulos curtos (poucos minutos), do básico ("o que é uma semente precisa para germinar") ao específico por cultura. Linguagem do dia a dia, zero jargão desnecessário.
- **Fichas de planta:** uma por cultura, seguindo o modelo de dados — escritas progressivamente (começamos pelas culturas do MVP e expandimos).
- **Guias de fase:** as 6 fases de crescimento explicadas uma vez, com o que fazer em cada uma.
- **Fichas de saúde por grupo:** folhas verdes, brássicas, frutos/tomate, leguminosas, aromáticas — benefícios com base em evidência.

Fluxo de produção sugerido: eu rascunho → tu revês e ajustas ao teu tom e à experiência real que vais ganhando (ex.: o teu próprio teste de microgreens vira conteúdo autêntico).

---

## 8. Arquitetura técnica (recomendação)

Pensada para tirar partido do teu Vue, ser boa peça de portfólio full-stack e suportar as funcionalidades escolhidas.

**Frontend:** Vue 3 + Vite, configurado como **PWA** (instalável, funciona offline). Pinia (estado), Vue Router, e uma camada local (IndexedDB) para *local-first* — a app funciona sem rede e sincroniza quando há login.

**Backend:** **Supabase** — Postgres (catálogo + dados do utilizador), Auth (contas), Storage (fotos do diário e do diagnóstico). Tier grátis generoso, ótimo para portfólio e rápido de montar.

**Funções serverless (Supabase Edge Functions):** *proxy* para a API de **IA de diagnóstico** e para a **meteorologia (IPMA)** — mantém as chaves fora do cliente.

**Estratégia de dados:** *local-first* por omissão (usável sem login); contas + sincronização na cloud como passo seguinte. Isto dá o melhor dos dois mundos: arranque simples e crescimento natural para full-stack.

```
[ Vue 3 PWA ] ──(offline cache: IndexedDB)
      │
      ├── Supabase Auth / Postgres / Storage
      └── Edge Functions ──► IA diagnóstico foto
                           └► IPMA meteorologia
```

---

## 9. Roadmap por fases

**Fase 0 — Fundação**
Modelo de dados do catálogo, scaffolding Vue+PWA, design system básico, conteúdo das primeiras culturas e das 6 fases.

**Fase 1 — MVP "primeira colheita"**
Desafio dos microgreens completo (7 dias, notificações), catálogo pesquisável inicial (~15–20 culturas fáceis para Ovar), calendário localizado, "as minhas plantas" com diário e lembretes. *Local-first, sem login obrigatório.*

**Fase 2 — Curso + saúde**
Percurso de lições guiadas, camada de nutrição completa, gamificação (streaks/XP/conquistas), contas + sincronização cloud.

**Fase 3 — Inteligente**
Diagnóstico por foto (IA), integração IPMA, expansão do catálogo (rumo a "tudo o que existe"), receitas.

**Fase 4 (opcional) — Comunidade e/ou comercial**
Partilha social, e — se quiseres explorar a via comercial — freemium com o desafio grátis como prova de valor e subscrição para o percurso completo.

---

## 10. Decisões em aberto / próximos passos

- **Conteúdo:** começar a escrever as fichas e lições das culturas do MVP.
- **Design:** definir identidade visual e *design system* (nome "GrowGreens" a confirmar).
- **Técnico:** montar o scaffolding Vue+PWA e o esquema Postgres do catálogo.
- **Validação do teste real:** quando quiseres, planeamos o teu próprio cultivo de microgreens em casa, em paralelo com o desenvolvimento — vira conteúdo e testa o produto na prática.

---

### Anexo — Calendário de sementeira para Ovar (resumo)
Duas grandes janelas: **primavera (mar–mai)** e **outono (ago–out)**. Fáceis para começar no litoral: alface, rúcula, rabanete, espinafre, feijão-verde, ervilha, couves, morangos e aromáticas (salsa, coentros, cebolinho, hortelã em vaso, alecrim, tomilho). Manjericão e tomate só após o risco de geada (a partir de maio). *Calendário completo mês a mês será incorporado na base de dados.*
