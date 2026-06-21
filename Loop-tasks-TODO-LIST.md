# Loop Tasks — TODO List
Ciclo: 7 · Atualizado: 2026-06-22 12:00

Estados: `[ ]` pendente · `[x]` concluída (+nota/commit) · `[!]` bloqueada (+motivo).
Stack: Vue 3 + TS + Vite (PWA), Pinia, Vue Router, Vue I18n, Dexie, Tailwind v4. Testes: Vitest (+@vue/test-utils, coverage v8) + Playwright. Lint: ESLint. Format: Prettier. npm. 51 plantas, 10 microgreens, 19 receitas, 140 unit + 7 e2e.

## Conteúdo
- [ ] (P3) Adicionar 2 plantas novas ao catálogo (ex.: funcho, aipo) respeitando o tipo `Plant` e referências — ficheiros: src/data/plants.ts — validação: tests/data-integrity.test.ts.
- [ ] (P3) Adicionar 2 receitas novas ligadas a plantas existentes — ficheiros: src/data/recipes.ts — validação: data-integrity (recipes apontam para slugs válidos).
- [ ] (P4) Adicionar 5 termos ao glossário (atualmente 45) — ficheiros: src/data/glossary.ts — validação: build + sem duplicados.
- [ ] (P4) Adicionar 3 perguntas à FAQ (atualmente 12) — ficheiros: src/data/faq.ts — validação: build.
- [ ] (P4) Adicionar 1 lição nova a uma unidade existente do curso — ficheiros: src/data/course.ts — validação: build + lição referenciável.
- [ ] (P4) Adicionar 1 sintoma novo a troubleshoot com `related` válido — ficheiros: src/data/troubleshoot.ts — validação: data-integrity.
- [ ] (P4) Enriquecer 3 pragas/doenças com a época do ano em que surgem — ficheiros: src/data/pestsDiseases.ts — validação: build.
- [ ] (P4) Adicionar 1 microgreen novo (ex.: alfafa) — ficheiros: src/data/microgreens.ts — validação: build.
- [ ] (P5) Rever 1 conquista/achievement com descrição mais clara em pt-PT — ficheiros: src/data/achievements.ts — validação: build.
- [ ] (P5) Adicionar dica mensal em falta (MONTHLY_TIPS) se algum mês estiver pobre — ficheiros: src/data/calendar.ts — validação: build.

## Regras de Negócio
- [x] (P2) Teste para `shouldSuggestMicrogreens` — ficheiros: tests/recommend.test.ts — validação: vitest. ✓ Feito: exterior=false; interior==parapeito (mesmo critério).
- [x] (P2) Teste de pontuação `recommendPlants` em espaço interior — ficheiros: tests/recommend.test.ts — validação: vitest. ✓ Feito: só-interior só recomenda interior/ambos.
- [ ] (P3) Teste: `estimateStage` faz clamp de `daysOld` negativo e futuro — ficheiros: tests/growth.test.ts — validação: vitest.
- [ ] (P3) Teste: `successionDays` devolve valores coerentes — ficheiros: tests/growth.test.ts — validação: vitest.
- [ ] (P2) Teste: marcar planta como colhida/perdida fecha lembretes abertos — ficheiros: tests/repositories.test.ts — validação: vitest.
- [ ] (P3) Teste: `areCompanions`/`areAntagonists` são simétricos — ficheiros: tests/companions.test.ts — validação: vitest.
- [ ] (P3) Teste: `computeUnlockedDay` respeita limites (0..7) — ficheiros: tests/challenge.test.ts — validação: vitest.
- [ ] (P3) Teste: `exportData` inclui os canteiros (beds) — ficheiros: tests/backup.test.ts — validação: vitest.
- [ ] (P3) Teste: `plantingsRepo.create` faz clamp de `wateringEveryDays` ≥ 1 — ficheiros: tests/repositories.test.ts — validação: vitest.
- [ ] (P4) Teste: `calendarForPlant` consistente com `plantSowableThisMonth` — ficheiros: tests/calendar.test.ts — validação: vitest.

## Performance
- [ ] (P3) Confirmar que todas as rotas/views são lazy (import dinâmico) — ficheiros: src/router/index.ts — validação: revisão + chunks separados no build.
- [ ] (P4) Confirmar ausência de `console.log` em código de produção — ficheiros: src — validação: grep limpo.
- [ ] (P4) Verificar tamanho do chunk `plants` (raw + gzip) e registar — ficheiros: build — validação: revisão do output.
- [ ] (P4) Confirmar que o precache do PWA não inclui sourcemaps/mapas — ficheiros: build/dist — validação: revisão.
- [ ] (P4) Confirmar que imagens do utilizador têm width/height (evita CLS) — ficheiros: features (garden/diagnosis) — validação: revisão.
- [ ] (P4) Confirmar uso de fontes do sistema (sem webfonts externas a carregar) — ficheiros: css/index — validação: revisão.
- [ ] (P5) Avaliar debounce na pesquisa do catálogo (se aplicável) — ficheiros: src/features/catalog — validação: revisão.
- [ ] (P4) Verificar `manualChunks` ainda separa vendor de forma eficaz — ficheiros: vite.config.ts — validação: revisão do build.
- [ ] (P4) Confirmar prefetch do Home não bloqueia o arranque — ficheiros: src/features/home/HomeView.vue — validação: revisão.
- [ ] (P5) Verificar listas grandes (catálogo) usam `:key` estável e v-memo onde útil — ficheiros: src/features/catalog — validação: revisão.

## Organização
- [x] (P2) `.gitignore`: ignorar `.claude/` e `test-results/` — ficheiros: .gitignore — validação: `git status` limpo desses caminhos. ✓ Feito: + test-results, playwright-report, .claude.
- [ ] (P3) Atualizar CLAUDE.md com contagens de conteúdo (45 glossário, 12 FAQ, 7 unidades/19 lições) — ficheiros: CLAUDE.md — validação: coerente.
- [ ] (P3) CHANGELOG: entrada para as alterações dos ciclos 6/7 — ficheiros: CHANGELOG.md — validação: presente.
- [ ] (P4) docs/ARQUITETURA: adicionar secção "Testes" (Vitest + Playwright, padrões) — ficheiros: docs/ARQUITETURA.md — validação: coerente.
- [ ] (P4) Confirmar que `src/stores` não importam de `src/features` (camadas) — ficheiros: src/stores — validação: grep limpo.
- [ ] (P4) Confirmar que `src/repositories` não importam de `src/features` — ficheiros: src/repositories — validação: grep limpo.
- [ ] (P4) Verificar ausência de imports circulares óbvios entre data files — ficheiros: src/data — validação: revisão.
- [ ] (P5) Adicionar JSDoc curto a funções públicas de utils sem documentação — ficheiros: src/utils — validação: typecheck.
- [ ] (P4) README: secção de funcionalidades alinhada com o estado atual — ficheiros: README.md — validação: coerente.
- [ ] (P5) Verificar consistência de ordem `<script setup>` antes de `<template>` nos .vue — ficheiros: src — validação: revisão.

## Arquivo (ciclos concluídos)

### Ciclo 6 — 2026-06-22 — 38 concluídas, 2 N/A
Catálogo 48→51 (tomilho-limão/manjerona/cerefólio); microgreen trigo (wheatgrass); curso u7 (guardar sementes); pragas cochonilha/ácaro/tripes/nemátodes + prevenção míldio/oídio; receitas guisado/salteada/assada/sopa; troubleshoot ponta-podre/pontas-castanhas; `StageEstimate` interface; package.json metadata; README badge MIT; Home sugere microgreens (`shouldSuggestMicrogreens`); teste reativo useReminders; docs Utilitários; chips whitespace-nowrap; CLAUDE.md contagens; +6 verificações de build. N/A: fetchpriority (UI emoji), split plants chunk. Testes 128→140.

### Ciclo 5 — 2026-06-21 — 40 concluídas, 0 bloqueadas
Catálogo 45→48 (mizuna/beldroega/segurelha); glossário/FAQ/curso (rotação, capilaridade); receitas courgette/beterraba; saúde caution (leguminosas/batata); pragas nemátodes; troubleshoot clorose/damping-off; **E2E calendário+curso** (5 specs); skip-link a11y; decoding=async; prefetch catálogo/curso; consolidar normalize; JSDoc tipos; CHANGELOG; CONTRIBUTING pre-commit; noscript; +7 verificações. Testes 128.

### Ciclo 4 — 2026-06-19 — 40 concluídas, 0 bloqueadas
Catálogo 42→45; E2E catálogo+horta (corrigiu base path partido); .ics DTSTAMP+escape; SECURITY.md; dependabot; meta tags; :focus-visible; testes de componente; cobertura no CI; recommend determinístico. Testes 104→116 (+3 e2e).

### Ciclo 3 — 2026-06-19 — 39 concluídas, 1 bloqueada
Catálogo 39→42; backup completo+reset (corrigiu export); infra testes de componente; tsconfig estrito (2 bugs); cache calendarFor; v-memo. Testes 89→104.

### Ciclo 2 — 2026-06-19 — 38 concluídas, 2 bloqueadas
Catálogo 36→39; curso u6; useReminders; lazy share; thresholds; docs/ARQUITETURA; vendor chunk. Bug arrays partilhados. Testes 64→89.

### Ciclo 1 — 2026-06-18/19 — 38 concluídas, 2 bloqueadas
Catálogo 20→36; ESLint trash (14834→0); CLAUDE.md; desbloqueio do desafio; .ics DTSTAMP; cobertura; sucessão. Testes 28→64.
