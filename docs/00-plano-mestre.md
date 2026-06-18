# GrowGreens — Plano-Mestre de Construção

> Documento que liga todas as áreas do produto e define o caminho até uma aplicação **funcional** (palpável e completa). Lê-se em conjunto com a [Visão de Produto](../GrowGreens-Visao-Produto.md) e as cinco especificações em `docs/`.
>
> **Versão:** 1.0 · **Data:** junho 2026

---

## 1. Como ler este planeamento

O planeamento está dividido em seis documentos:

| # | Documento | O que cobre |
|---|---|---|
| 00 | **Plano-Mestre** (este) | Visão integrada, roadmap, ordem de construção, definição de "funcional" |
| 01 | [Arquitetura Técnica](01-arquitetura-tecnica.md) | Stack, estrutura, PWA, local-first, Supabase, CI/CD, segurança |
| 02 | [UX/UI e Design System](02-ux-ui-design-system.md) | Ecrãs, fluxos, navegação, paleta, componentes |
| 03 | [Conteúdo e Currículo](03-conteudo-curriculo.md) | Curso estilo Duolingo, fichas, desafio microgreens, gamificação |
| 04 | [Funcionalidades Inteligentes](04-funcionalidades-inteligentes.md) | IA diagnóstico por foto, meteorologia IPMA, receitas |
| 05 | [Modelo de Dados do Catálogo](05-modelo-dados-catalogo.md) | Schema Postgres, taxonomia, pesquisa, povoamento |

---

## 2. Resumo integrado do produto

GrowGreens é uma **PWA (Vue 3 + Supabase)** que ensina principiantes absolutos a cultivar, da semente à colheita, calibrada para o clima de Ovar/Aveiro e generalizável por região. Quatro pilares: **curso guiado**, **acompanhamento prático**, **camada de saúde/nutrição** e o **desafio dos microgreens** (onboarding de 7 dias que prova valor com uma colheita real).

Decisões técnicas estruturantes já fechadas:

- **Frontend:** Vue 3 + Vite + TypeScript, PWA instalável, Tailwind v4 + shadcn-vue, Pinia, Vue Router, Vue I18n.
- **Backend:** Supabase (Postgres + Auth + Storage + Edge Functions Deno).
- **Dados:** local-first com Dexie (IndexedDB) + outbox pattern; funciona offline e sem login; sincroniza para a cloud ao criar conta.
- **Segurança:** RLS rigorosa em todas as tabelas de utilizador; segredos (IA, IPMA, VAPID) só em Edge Functions.
- **Deploy:** Cloudflare Pages (frontend) + Supabase (backend).

---

## 3. Definição de "funcional" (o que conta como palpável e completo)

Distinguimos três marcos. Só falamos de app "funcional" a partir do **Marco 1**.

### Marco 0 — Esqueleto navegável (não é "funcional")
App arranca, navega entre ecrãs com dados de exemplo, design system aplicado. Serve só para validar a base técnica. Não conta como funcional.

### Marco 1 — Primeira fatia vertical completa ✅ "FUNCIONAL"
A app faz uma coisa inteira, de ponta a ponta, sem buracos:

- O utilizador abre a app, passa pelo onboarding e **inicia o desafio dos microgreens**.
- Recebe os passos dia a dia (Dia 0 → Dia 7), marca tarefas como feitas, tira/guarda fotos no diário.
- Os dados persistem **offline** (Dexie); a app é instalável como PWA; os lembretes diários funcionam (in-app + .ics, push onde disponível).
- Ao fim de 7 dias, vê a celebração e desbloqueia a conquista "Primeira Colheita".
- Acede a um **catálogo inicial pesquisável** (20–30 plantas) e adiciona pelo menos uma planta à sua horta com acompanhamento.

Critérios objetivos do Marco 1:
1. Fluxo do desafio 100% funcional offline, com persistência real.
2. PWA instalável (manifest + service worker) e funcional sem rede.
3. Catálogo com pesquisa e filtros sobre dados reais no Postgres.
4. "As minhas plantas" com diário + fotos + lembretes a funcionar.
5. Pelo menos 5 fichas de planta e 8–10 lições curadas em PT-PT.
6. Testes automatizados a cobrir o fluxo crítico (Vitest + 1 E2E Playwright).
7. Implantada num URL real (Cloudflare Pages) e instalável no telemóvel.

### Marco 2 — Produto completo
Curso completo, contas + sincronização cloud, camada de saúde, calendário localizado completo, gamificação plena, e as funcionalidades inteligentes (IA, IPMA, receitas).

---

## 4. Roadmap por fases

**Fase 0 — Fundações** *(base técnica)*
Scaffold Vue+Vite+TS, Tailwind v4 + shadcn-vue, Pinia, Router, i18n, ESLint/Prettier, CI (GitHub Actions). Design system implementado como componentes-base. Camada local-first (Dexie + repositórios + outbox + `useLiveQuery`) a funcionar offline e anónima.

**Fase 1 — MVP "primeira colheita"** *(atingir o Marco 1)*
Desafio microgreens completo, catálogo inicial pesquisável (schema Postgres + seed de 20–30 plantas), "as minhas plantas" com diário/fotos/lembretes, primeiras lições do curso, PWA instalável. Conteúdo curado do MVP. Deploy real.

**Fase 2 — Curso + saúde + contas**
Percurso completo de lições, camada de nutrição, gamificação plena (streaks/XP/conquistas), Auth Supabase + motor de sincronização (push/pull) + merge de dados locais no signup. Calendário localizado completo (zonas climáticas PT).

**Fase 3 — Inteligente**
Edge Functions: meteorologia IPMA (ajuste de rega/janelas), diagnóstico por foto (Plant.health + GPT-4o-mini), receitas curadas ligadas à colheita. Expansão do catálogo via import CC0 (Wikidata/GBIF) rumo a "pesquisar tudo".

**Fase 4 — Comunidade / comercial (opcional)**
Partilha social, e — se quiseres — freemium com o desafio grátis como prova de valor.

---

## 5. Ordem de construção recomendada (build order)

A ordem é desenhada para chegar ao **Marco 1 (funcional)** o mais cedo possível, construindo uma fatia vertical em vez de camadas horizontais.

1. **Scaffold + qualidade**: projeto Vite/Vue/TS, ESLint/Prettier, CI, estrutura de pastas feature-based.
2. **Design system**: tokens Tailwind (paleta/tipografia do doc 02) + componentes-base (`BaseButton`, `PlantCard`, `ProgressBar`, `StreakChip`, `TabBar`, estados vazios).
3. **Local-first core**: Dexie + repositórios + outbox + `useLiveQuery`. Tudo offline e anónimo.
4. **Navegação + shell**: Vue Router, tab bar, rotas principais com ecrãs vazios.
5. **Desafio microgreens (fatia vertical)**: onboarding → hub do desafio → passos dia a dia → diário/fotos → celebração. Conteúdo dos 7 dias (doc 03).
6. **Lembretes**: locais + export .ics; push como melhoria.
7. **PWA**: vite-plugin-pwa, manifest, precache, prompt de update, instalação.
8. **Catálogo**: schema Postgres (doc 05) + seed de 20–30 plantas + pesquisa/filtros + ficha de planta + "adicionar à minha horta".
9. **Curso mínimo**: 8–10 lições das unidades iniciais (doc 03).
10. **Deploy**: Cloudflare Pages + projeto Supabase. → **Marco 1 atingido.**
11. **Fase 2+**: Auth + sync, gamificação plena, saúde, calendário completo, e depois funcionalidades inteligentes.

---

## 6. Pontos de atenção transversais (riscos conhecidos)

- **Push em iOS/UE:** Web Push em iOS só funciona com a PWA instalada no ecrã principal, e há risco regulatório (DMA) em PWAs standalone na UE. Mitigação já prevista: lembretes in-app + export .ics como fallback fiável. (Detalhe no doc 01.)
- **Clima atlântico = fungos:** o maior risco hortícola em Ovar não é o frio, é a humidade/fungos (míldio/oídio). Modelado de propósito (flag `is_fungal`, `portugal_notes_pt`) e ensinado no currículo (Unidade 9).
- **Precisão da IA de diagnóstico:** cai do laboratório para o campo. Mitigação: fotos guiadas, gate de confiança a 50%, e a IA como assistente, não oráculo.
- **Licenças de dados de plantas:** se a app for comercial, atenção a CC BY-SA (Permapeople) e CC BY-NC (Flora-On). Base segura de import em massa: CC0 (Wikidata/GBIF) e domínio público (USDA). (Detalhe no doc 05.)
- **Gamificação vs ritmo da natureza:** a streak tem de aceitar check-ins de 30s nos dias de espera, senão pune o utilizador por a planta estar simplesmente a crescer. (Detalhe no doc 03.)

---

## 7. Próximo passo

Com o planeamento completo, o passo natural é arrancar a **Fase 0 + início da Fase 1**: montar o scaffold do projeto e começar a fatia vertical do desafio dos microgreens. Quando quiseres, começo a escrever código.
