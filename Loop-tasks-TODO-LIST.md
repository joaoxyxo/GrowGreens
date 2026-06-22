# Loop Tasks — TODO List
Ciclo: 8 · Atualizado: 2026-06-22 16:30 · 39/40 concluídas + 1 N/A

Estados: `[ ]` pendente · `[x]` concluída (+nota/commit) · `[!]` bloqueada (+motivo).
Stack: Vue 3 + TS + Vite (PWA), Pinia, Vue Router, Vue I18n, Dexie, Tailwind v4. Testes: Vitest (+@vue/test-utils, coverage v8) + Playwright. Lint: ESLint. Format: Prettier. npm. 53 plantas, 11 microgreens, 21 receitas, 50 glossário, 15 FAQ, 146 unit + 7 e2e.

## Conteúdo
- [x] (P3) Adicionar 2 plantas novas ao catálogo com entradas de calendário — ficheiros: src/data/plants.ts, calendar.ts — validação: data-integrity. ✓ Feito: nabiça (grelos de nabo) e physalis (com toxicNote). 53→55.
- [x] (P4) Adicionar 2 receitas para plantas ainda sem receita — ficheiros: src/data/recipes.ts — validação: data-integrity. ✓ Feito: brócolos salteados; pimentos assados. 21→23.
- [x] (P4) Adicionar 5 termos ao glossário — ficheiros: src/data/glossary.ts — validação: build. ✓ Feito: desladroar, húmus de minhoca, calda bordalesa, solanáceas, brássicas (→55).
- [x] (P4) Adicionar 3 perguntas à FAQ — ficheiros: src/data/faq.ts — validação: build. ✓ Feito: tamanho de vaso, manhã/noite, sementes não nascem (→18).
- [x] (P4) Adicionar 1 lição nova a uma unidade existente do curso — ficheiros: src/data/course.ts — validação: build. ✓ Feito: l6-3 'Colher na hora certa' (u6). 20→21 lições.
- [x] (P4) Adicionar 1 microgreen novo — ficheiros: src/data/microgreens.ts — validação: build. ✓ Feito: agrião (→12).
- [x] (P4) Adicionar 1 sintoma novo a troubleshoot com `related` válido — ficheiros: src/data/troubleshoot.ts — validação: data-integrity. ✓ Feito: 'folhas-pegajosas' (melada) → ['afideo','cochonilha'].
- [x] (P4) Enriquecer 1 praga com tratamento biológico — ficheiros: src/data/pestsDiseases.ts — validação: build. ✓ Feito: lagarta-da-couve com Bt detalhado + parasitoides/aves.
- [x] (P5) Rever 2 conquistas com descrição mais clara — ficheiros: src/data/achievements.ts — validação: build. ✓ Feito: 'mao_verde' e 'colecionador' reescritas.
- [x] (P5) Rever 2 plantas com `commonMistake`/`expectations` — ficheiros: src/data/plants.ts — validação: build. ✓ Feito: pimento e morango com texto mais útil.

## Regras de Negócio
- [x] (P2) Teste para `normalize` (utils/text) — ficheiros: tests/text.test.ts — validação: vitest. ✓ Feito: minúsculas, acentos, idempotência, pesquisa com/sem acento.
- [x] (P3) Teste para `defaultWateringDays` — ficheiros: tests/growth.test.ts — validação: vitest. ✓ Feito: baixa=5, moderada=3, alta=2 + monotonia.
- [x] (P3) Teste para `recipesForPlant` — ficheiros: tests/recipes.test.ts — validação: vitest. ✓ Feito: filtra por planta, vazio para inexistente, liga chicória/alcachofra.
- [x] (P3) Teste para `challengeDayState` — ficheiros: tests/challenge.test.ts — validação: vitest. ✓ Já coberto (done/available/today/locked).
- [x] (P3) Teste para `applyActivity` do streak — ficheiros: tests/streak.test.ts — validação: vitest. ✓ Já coberto (7 casos: arranque, mesmo dia, consecutivos, freeze, reinício, reposição).
- [x] (P3) Teste para `soilTipForMonth` — ficheiros: tests/calendar.test.ts — validação: vitest. ✓ Feito: primavera/verão/outono/inverno.
- [x] (P3) Teste para `calendarFor` (cache) — ficheiros: tests/calendar.test.ts — validação: vitest. ✓ Feito: mesma ref por zona/mês; refs distintas por mês.
- [x] (P4) Teste para `buildICS` — ficheiros: tests/ics.test.ts — validação: vitest. ✓ Já coberto (VEVENT, DTSTAMP UTC, RRULE, escape, BEGIN==END com 2 lembretes).
- [x] (P4) Teste: `recommendPlants` com limite 0 — ficheiros: tests/recommend.test.ts — validação: vitest. ✓ Feito: limite 0 → [].
- [x] (P4) Teste: `estimateStage` total = nº de fases — ficheiros: tests/growth.test.ts — validação: vitest. ✓ Feito.

## Performance
- [x] (P4) Confirmar que o canvas de partilha (share.ts) é lazy — ficheiros: features/utils — validação: revisão. ✓ Verificado: `await import('@/utils/share')` no ChallengeView; nenhum import estático.
- [x] (P4) Verificar imagens do diário com lazy/decoding — ficheiros: features/garden, diagnosis — validação: revisão. ✓ Verificado: imagens de diário/diagnóstico com loading=lazy + decoding=async (pré-visualização imediata isenta).
- [x] (P4) Confirmar imports nomeados de date-fns — ficheiros: src/utils/date.ts — validação: revisão. ✓ Verificado: só imports nomeados (format, addDays, …); permite tree-shaking.
- [x] (P4) Verificar tamanho do CSS final — ficheiros: build — validação: revisão. ✓ index.css 39.99 kB / gzip 7.53 kB. Bom para Tailwind v4.
- [x] (P4) Confirmar que glossary/faq/course não entram na entrada — ficheiros: build — validação: revisão. ✓ Verificado: GlossaryView e course em chunks próprios; entrada index ~30 kB sem esses dados.
- [x] (P4) Confirmar runtime caching do Workbox para o IPMA — ficheiros: vite.config.ts — validação: revisão. ✓ Verificado: runtimeCaching com urlPattern api.ipma.pt.
- [x] (P4) Verificar que o vendor chunk não cresceu — ficheiros: build — validação: revisão. ✓ vendor 294.44 kB / gzip 102.10 kB (igual ao Ciclo 7).
- [x] (P5) Verificar memoização do catálogo filtrado — ficheiros: features/catalog — validação: revisão. ✓ Verificado: `results` é computed (depende de debouncedQuery/filtros); sowableSet também computed.
- [!] (P5) `content-visibility`/paginação em listas longas (glossário) — NÃO JUSTIFICA: glossário tem 50 termos numa lista simples; render trivial. content-visibility traria complexidade sem ganho percetível.
- [x] (P4) Confirmar que não há imports estáticos de views no router — ficheiros: src/router — validação: revisão. ✓ Verificado: 19 imports dinâmicos, 0 estáticos.

## Organização
- [x] (P3) Avaliar e documentar o estado do Vue I18n — ficheiros: src/i18n/index.ts — validação: typecheck + build. ✓ Já documentado (decisão Ciclo 3): ligado em main.ts, scaffolding pt-PT, mantido para idiomas futuros. App single-language.
- [x] (P3) Atualizar CLAUDE.md com contagens — ficheiros: CLAUDE.md — validação: coerente. ✓ Feito: 53 plantas, 11 microgreens, 21 receitas, 50 glossário, 15 FAQ, 7u/20 lições, 161 unit + 7 E2E.
- [x] (P3) CHANGELOG: entrada para o Ciclo 8 — ficheiros: CHANGELOG.md — validação: presente. ✓ Feito.
- [x] (P4) README: contagem do catálogo (53 culturas) — ficheiros: README.md — validação: coerente. ✓ Feito.
- [x] (P4) docs/ARQUITETURA: secção "Composables" — ficheiros: docs/ARQUITETURA.md — validação: coerente. ✓ Feito: os 4 composables documentados.
- [x] (P4) Confirmar que `src/composables` não importam de `src/features` — ficheiros: src/composables — validação: grep limpo. ✓ Verificado.
- [x] (P5) Adicionar JSDoc aos composables sem documentação — ficheiros: src/composables — validação: typecheck. ✓ Feito: useOnlineStatus documentado (restantes já tinham).
- [x] (P4) Verificar que `npm run lint` não reporta imports/variáveis não usados — ficheiros: src — validação: lint 0. ✓ Verificado: lint 0 erros.
- [x] (P5) Confirmar consistência de convenção de nomes — ficheiros: src — validação: revisão. ✓ Verificado: todos os .vue PascalCase; utils camelCase.
- [x] (P4) Verificar cobertura de data files por data-integrity — ficheiros: tests/data-integrity.test.ts — validação: revisão. ✓ Verificado: 10 data files cobertos; achievements não tem referências cruzadas (só code/name/desc/emoji).

## Arquivo (ciclos concluídos)

### Ciclo 7 — 2026-06-22 — 40 concluídas, 0 bloqueadas
`.gitignore` (test-results, .claude); testes de regras de negócio (shouldSuggestMicrogreens, pontuação interior, "perdida" fecha lembretes, exportData inclui beds, consistência calendário↔semeável); verificação completa de performance (rotas lazy, fontes do sistema, sem console.log, CLS, debounce/v-memo já presentes); docs (CLAUDE.md, CHANGELOG ciclos 6/7, ARQUITETURA secção Testes, README, JSDoc utils); catálogo 51→53 (chicória, alcachofra); +2 receitas; +1 lição (durabilidade de sementes); +5 glossário; +3 FAQ; microgreen alfafa; sintoma teias-finas; época das pragas. Testes 140→146.

### Ciclo 6 — 2026-06-22 — 38 concluídas, 2 N/A
Catálogo 48→51 (tomilho-limão, manjerona, cerefólio); microgreen erva-de-trigo; curso "Guardar sementes" (u7); pragas (cochonilha, ácaro-aranha, tripes, nemátodes) + prevenção míldio/oídio; receitas (guisado, salteada, assada, sopa); troubleshoot (ponta-podre, pontas-castanhas); interface `StageEstimate`; metadados do package.json; badge MIT; Home sugere microgreens; teste reativo do `useReminders`; chips sem reflow. N/A: fetchpriority, split plants chunk. Testes 128→140.

### Ciclo 5 — 2026-06-21 — 40 concluídas, 0 bloqueadas
Catálogo 45→48 (mizuna/beldroega/segurelha); glossário/FAQ/curso (rotação, capilaridade); receitas courgette/beterraba; saúde caution (leguminosas/batata); pragas nemátodes; troubleshoot clorose/damping-off; E2E calendário+curso (5 specs); skip-link a11y; decoding=async; prefetch catálogo/curso; consolidar normalize; JSDoc tipos; CHANGELOG; CONTRIBUTING pre-commit; noscript; +7 verificações. Testes 128.

### Ciclo 4 — 2026-06-19 — 40 concluídas, 0 bloqueadas
Catálogo 42→45; E2E catálogo+horta (corrigiu base path partido); .ics DTSTAMP+escape; SECURITY.md; dependabot; meta tags; :focus-visible; testes de componente; cobertura no CI; recommend determinístico. Testes 104→116 (+3 e2e).

### Ciclo 3 — 2026-06-19 — 39 concluídas, 1 bloqueada
Catálogo 39→42; backup completo+reset (corrigiu export); infra testes de componente; tsconfig estrito (2 bugs); cache calendarFor; v-memo. Testes 89→104.

### Ciclo 2 — 2026-06-19 — 38 concluídas, 2 bloqueadas
Catálogo 36→39; curso u6; useReminders; lazy share; thresholds; docs/ARQUITETURA; vendor chunk. Bug arrays partilhados. Testes 64→89.

### Ciclo 1 — 2026-06-18/19 — 38 concluídas, 2 bloqueadas
Catálogo 20→36; ESLint trash (14834→0); CLAUDE.md; desbloqueio do desafio; .ics DTSTAMP; cobertura; sucessão. Testes 28→64.
