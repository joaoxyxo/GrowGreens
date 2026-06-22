# Loop Tasks — TODO List
Ciclo: 9 · Atualizado: 2026-06-22 17:00

Estados: `[ ]` pendente · `[x]` concluída (+nota/commit) · `[!]` bloqueada (+motivo).
Stack: Vue 3 + TS + Vite (PWA), Pinia, Vue Router, Vue I18n, Dexie, Tailwind v4. Testes: Vitest (+@vue/test-utils, coverage v8) + Playwright. Lint: ESLint. Format: Prettier. npm. 55 plantas, 12 microgreens, 23 receitas, 55 glossário, 18 FAQ, 14 sintomas, 161 unit + 7 e2e.

## Conteúdo
- [ ] (P3) Adicionar 2 plantas novas ao catálogo (ex.: grão-de-bico, espargo) com entradas de calendário — ficheiros: src/data/plants.ts, calendar.ts — validação: tests/data-integrity.test.ts.
- [ ] (P4) Adicionar 2 receitas para plantas ainda sem receita (ex.: nabo, beringela, melão) — ficheiros: src/data/recipes.ts — validação: data-integrity.
- [ ] (P4) Adicionar 5 termos ao glossário (55→60) — ficheiros: src/data/glossary.ts — validação: build + sem duplicados.
- [ ] (P4) Adicionar 3 perguntas à FAQ (18→21) — ficheiros: src/data/faq.ts — validação: build.
- [ ] (P4) Adicionar 1 lição nova a uma unidade existente do curso — ficheiros: src/data/course.ts — validação: build + lição referenciável.
- [ ] (P4) Adicionar 1 sintoma novo a troubleshoot com `related` válido — ficheiros: src/data/troubleshoot.ts — validação: data-integrity.
- [ ] (P4) Adicionar 1 microgreen novo (ex.: linhaça) — ficheiros: src/data/microgreens.ts — validação: build.
- [ ] (P4) Enriquecer 1 grupo de saúde (health.ts) com benefícios/cautela adicionais — ficheiros: src/data/health.ts — validação: build.
- [ ] (P5) Enriquecer 2 microgreens com `note` mais útil — ficheiros: src/data/microgreens.ts — validação: build.
- [ ] (P5) Rever 2 plantas com `growingTips`/`harvestNotes` mais úteis — ficheiros: src/data/plants.ts — validação: build.

## Regras de Negócio
- [x] (P2) Teste: glossário sem termos duplicados — ficheiros: tests/data-integrity.test.ts — validação: vitest. ✓ Já coberto (Set(termos).size === length).
- [x] (P2) Teste: FAQ sem perguntas duplicadas — ficheiros: tests/data-integrity.test.ts — validação: vitest. ✓ Já coberto (Set(qs).size === length).
- [x] (P3) Teste: store `settings` alterna tema — ficheiros: tests/settings.test.ts — validação: vitest. ✓ Feito: dark/light aplica/remove classe no documento (persistência é exercida por load()).
- [x] (P3) Teste: store `ui` cap de toasts (MAX 3) — ficheiros: tests/ui.test.ts — validação: vitest. ✓ Já coberto ('limita os toasts visíveis a 3').
- [x] (P3) Teste: companions/antagonists com catálogo real — ficheiros: tests/companions.test.ts — validação: vitest. ✓ Feito: cenoura↔cebola companheiras; nabiça↔tomate antagonistas.
- [x] (P3) Teste: `challengeRepo.completeDay` idempotente — ficheiros: tests/repositories.test.ts — validação: vitest. ✓ Feito: completar o mesmo dia 2× não duplica.
- [x] (P3) Teste: `plantSowableThisMonth` não vazio em meses ativos — ficheiros: tests/calendar.test.ts — validação: vitest. ✓ Feito: abril e setembro > 0.
- [x] (P3) Teste: `recommendPlants` sem duplicados — ficheiros: tests/recommend.test.ts — validação: vitest. ✓ Feito: Set(slugs).size === length.
- [x] (P4) Teste: microgreens com `blackoutDays` válidos — ficheiros: tests/data-integrity.test.ts — validação: vitest. ✓ Feito: blackout 0≤min≤max<colheita, soakHours≥0 (daysToHarvest já coberto).
- [x] (P4) Teste: `successionDays` só culturas de corte rápido — ficheiros: tests/growth.test.ts — validação: vitest. ✓ Feito: folhas/rabanete >0; tomate/alcachofra/morango null.

## Performance
- [ ] (P4) Confirmar que `health`/`troubleshoot` ficam em chunks fora da entrada — ficheiros: build — validação: revisão.
- [ ] (P4) Verificar que a imagem de pré-visualização do diário liberta o objectURL — ficheiros: features/garden — validação: revisão.
- [ ] (P4) Confirmar que o catálogo não recalcula `searchBlob` a cada tecla — ficheiros: features/catalog — validação: revisão.
- [ ] (P4) Verificar que o número de chunks JS se mantém razoável (sem explosão) — ficheiros: build — validação: revisão.
- [ ] (P5) Avaliar `loading=lazy` em ícones/emojis pesados (n/a se só texto) — ficheiros: features — validação: revisão.
- [ ] (P4) Confirmar que o service worker não pré-carrega o `plants` chunk desnecessariamente — ficheiros: build — validação: revisão.
- [ ] (P4) Verificar que `useWeather` não dispara fetch sem zona definida — ficheiros: composables — validação: revisão.
- [ ] (P5) Confirmar que listas do catálogo não re-renderizam sem mudança (v-memo) — ficheiros: features/catalog — validação: revisão.
- [ ] (P4) Verificar gzip total dos assets de entrada (< ~120 KB) — ficheiros: build — validação: revisão.
- [ ] (P4) Confirmar que o CSS não inclui utilitários Tailwind não usados (purge) — ficheiros: build — validação: revisão.

## Organização
- [ ] (P3) Adicionar `aria-label` a botões-ícone sem rótulo (auditar features) — ficheiros: src/features — validação: revisão/lint.
- [ ] (P3) Atualizar CLAUDE.md com contagens (55 plantas, 23 receitas, 12 microgreens, 55 glossário, 18 FAQ) — ficheiros: CLAUDE.md — validação: coerente.
- [ ] (P3) CHANGELOG: entrada para o Ciclo 9 — ficheiros: CHANGELOG.md — validação: presente.
- [ ] (P4) README: contagem do catálogo (55 culturas) — ficheiros: README.md — validação: coerente.
- [ ] (P4) docs/ARQUITETURA: secção "Componentes UI" (design system em components/ui) — ficheiros: docs/ARQUITETURA.md — validação: coerente.
- [ ] (P4) Confirmar que `src/components` não importam de `src/features` — ficheiros: src/components — validação: grep limpo.
- [ ] (P5) Adicionar JSDoc curto às funções públicas de `health.ts`/`calendar.ts` sem doc — ficheiros: src/data — validação: typecheck.
- [ ] (P4) Verificar que não há `any` explícito novo em src (qualidade de tipos) — ficheiros: src — validação: grep/lint.
- [ ] (P5) Confirmar consistência de emojis nos dados (cada item tem emoji) — ficheiros: src/data — validação: revisão.
- [ ] (P4) Verificar que todos os ecrãs (features) têm rota no router — ficheiros: src/router — validação: revisão.

## Arquivo (ciclos concluídos)

### Ciclo 8 — 2026-06-22 — 39 concluídas, 1 N/A
Testes de regras de negócio (normalize, recipesForPlant, defaultWateringDays, soilTipForMonth, cache calendarFor, bordas recommend/estimateStage); verificação de performance (share lazy, CSS 40 KB, vendor estável, IPMA cache) e organização (composables sem deps de features, lint 0, PascalCase, Vue I18n documentado); secção Composables na ARQUITETURA; catálogo 53→55 (nabiça, physalis); +2 receitas (brócolos, pimentos); +1 lição (colher na hora certa); +5 glossário; +3 FAQ; microgreen agrião; sintoma melada; Bt detalhado. N/A: content-visibility no glossário. Testes 146→161.

### Ciclo 7 — 2026-06-22 — 40 concluídas, 0 bloqueadas
`.gitignore` (test-results, .claude); testes de regras de negócio (shouldSuggestMicrogreens, pontuação interior, "perdida" fecha lembretes, exportData inclui beds, consistência calendário↔semeável); verificação completa de performance; docs (CLAUDE.md, CHANGELOG, ARQUITETURA Testes, README, JSDoc utils); catálogo 51→53 (chicória, alcachofra); +2 receitas; +1 lição; +5 glossário; +3 FAQ; microgreen alfafa; sintoma teias-finas; época das pragas. Testes 140→146.

### Ciclo 6 — 2026-06-22 — 38 concluídas, 2 N/A
Catálogo 48→51 (tomilho-limão, manjerona, cerefólio); microgreen erva-de-trigo; curso u7; pragas (cochonilha, ácaro, tripes, nemátodes); receitas; troubleshoot; `StageEstimate`; package.json metadata; badge MIT; Home sugere microgreens; teste reativo useReminders; chips sem reflow. Testes 128→140.

### Ciclo 5 — 2026-06-21 — 40 concluídas, 0 bloqueadas
Catálogo 45→48; glossário/FAQ/curso; receitas; saúde caution; pragas nemátodes; troubleshoot; E2E calendário+curso; skip-link; decoding=async; prefetch; consolidar normalize; JSDoc; CHANGELOG; CONTRIBUTING; noscript. Testes 128.

### Ciclo 4 — 2026-06-19 — 40 concluídas, 0 bloqueadas
Catálogo 42→45; E2E catálogo+horta (base path); .ics DTSTAMP+escape; SECURITY.md; dependabot; meta tags; :focus-visible; testes de componente; cobertura no CI; recommend determinístico. Testes 104→116.

### Ciclo 3 — 2026-06-19 — 39 concluídas, 1 bloqueada
Catálogo 39→42; backup completo+reset; infra testes de componente; tsconfig estrito (2 bugs); cache calendarFor; v-memo. Testes 89→104.

### Ciclo 2 — 2026-06-19 — 38 concluídas, 2 bloqueadas
Catálogo 36→39; curso u6; useReminders; lazy share; thresholds; docs/ARQUITETURA; vendor chunk. Bug arrays partilhados. Testes 64→89.

### Ciclo 1 — 2026-06-18/19 — 38 concluídas, 2 bloqueadas
Catálogo 20→36; ESLint trash (14834→0); CLAUDE.md; desbloqueio do desafio; .ics DTSTAMP; cobertura; sucessão. Testes 28→64.
