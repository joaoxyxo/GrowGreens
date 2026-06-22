# Loop Tasks — TODO List
Ciclo: 10 · Atualizado: 2026-06-22 19:00

Estados: `[ ]` pendente · `[x]` concluída (+nota/commit) · `[!]` bloqueada (+motivo).
Stack: Vue 3 + TS + Vite (PWA), Pinia, Vue Router, Vue I18n, Dexie, Tailwind v4. Testes: Vitest (+@vue/test-utils, coverage v8) + Playwright. Lint: ESLint. Format: Prettier. npm. 57 plantas, 13 microgreens, 25 receitas, 60 glossário, 21 FAQ, 15 sintomas, 169 unit + 7 e2e.

## Conteúdo
- [ ] (P3) Adicionar 2 plantas novas ao catálogo (ex.: lentilha, ruibarbo) com entradas de calendário — ficheiros: src/data/plants.ts, calendar.ts — validação: tests/data-integrity.test.ts.
- [ ] (P4) Adicionar 2 receitas para plantas ainda sem receita (ex.: nabo, melão, morango) — ficheiros: src/data/recipes.ts — validação: data-integrity.
- [ ] (P4) Adicionar 5 termos ao glossário (60→65) — ficheiros: src/data/glossary.ts — validação: build + sem duplicados.
- [ ] (P4) Adicionar 3 perguntas à FAQ (21→24) — ficheiros: src/data/faq.ts — validação: build.
- [ ] (P4) Adicionar 1 lição nova a uma unidade existente do curso — ficheiros: src/data/course.ts — validação: build + lição referenciável.
- [ ] (P4) Adicionar 1 sintoma novo a troubleshoot com `related` válido — ficheiros: src/data/troubleshoot.ts — validação: data-integrity.
- [ ] (P4) Adicionar 1 microgreen novo (ex.: feno-grego) — ficheiros: src/data/microgreens.ts — validação: build.
- [ ] (P4) Enriquecer 1 grupo de saúde (health.ts) sem caution com info adicional — ficheiros: src/data/health.ts — validação: build.
- [ ] (P5) Rever 2 plantas com `portugalNotes` mais específicas do litoral — ficheiros: src/data/plants.ts — validação: build.
- [ ] (P5) Enriquecer 1 dica mensal (MONTHLY_TIPS) que esteja vaga — ficheiros: src/data/calendar.ts — validação: build.

## Regras de Negócio
- [x] (P2) Teste: cada planta tem `in30Seconds`/`growingTips`/`shortDescription` não vazios — ficheiros: tests/data-integrity.test.ts — validação: vitest. ✓ Feito.
- [x] (P3) Teste: `wateringAdvice` por chuva/calor — ficheiros: tests/weather.test.ts — validação: vitest. ✓ Já coberto (chuva, calor, ameno, vazio).
- [x] (P3) Teste: `weatherTypeInfo` conhecido + fallback — ficheiros: tests/composables.test.ts — validação: vitest. ✓ Já coberto.
- [x] (P3) Teste: progress `addXp`/`unlock` não duplica — ficheiros: tests/progress.test.ts — validação: vitest. ✓ Já coberto ('unlock só desbloqueia uma vez', 'idempotente').
- [x] (P3) Teste: `calendarForPlant` desloca sementeira não colheita — ficheiros: tests/calendar.test.ts — validação: vitest. ✓ Já coberto (litoral_sul antecipa; colheita não desloca).
- [x] (P3) Teste: `bedsRepo.update` clampa dimensões — ficheiros: tests/repositories.test.ts — validação: vitest. ✓ CORRIGIDO: update não clampava; agora clampa rows/cols a 1-12 como create. +teste.
- [x] (P4) Teste: `recipesForPlant` consistente (plantas existem) — ficheiros: tests/recipes.test.ts — validação: vitest. ✓ Já coberto (recipes.test + data-integrity validam r.plants).
- [x] (P4) Teste: todas as lições têm passo `summary` — ficheiros: tests/data-integrity.test.ts — validação: vitest. ✓ Feito.
- [x] (P4) Teste: SYMPTOMS têm `whatToDo`/`likely` não vazios — ficheiros: tests/data-integrity.test.ts — validação: vitest. ✓ Feito.
- [x] (P4) Teste: `MICROGREENS` têm `flavour`/`note` não vazios — ficheiros: tests/data-integrity.test.ts — validação: vitest. ✓ Feito.

## Performance
- [ ] (P4) Confirmar que o `recipes` chunk fica separado e lazy — ficheiros: build — validação: revisão.
- [ ] (P4) Verificar que `PlantDetailView` não importa todo o catálogo só para 1 planta — ficheiros: features/catalog — validação: revisão.
- [ ] (P4) Confirmar que `GardenView` usa `useReminders` partilhado (não duplica liveQuery) — ficheiros: features/garden — validação: revisão.
- [ ] (P4) Verificar que o número total de assets gerados se mantém estável — ficheiros: build — validação: revisão.
- [ ] (P5) Avaliar `will-change`/transições só onde necessário (sem custo global) — ficheiros: features — validação: revisão.
- [ ] (P4) Confirmar que imagens de diário usam dimensões fixas (sem CLS) — ficheiros: features/garden — validação: revisão.
- [ ] (P4) Verificar que o vendor chunk não cresceu com novas plantas — ficheiros: build — validação: revisão (~294 KB).
- [ ] (P5) Confirmar que `normalize` não é chamado em loop quente sem cache — ficheiros: features/catalog — validação: revisão.
- [ ] (P4) Confirmar que o data chunk `plants` cresce linearmente (sem dependências extra) — ficheiros: build — validação: revisão.
- [ ] (P4) Verificar que `course` chunk não inclui dados de outras áreas — ficheiros: build — validação: revisão.

## Organização
- [ ] (P3) Atualizar CLAUDE.md com contagens (57 plantas, 25 receitas, 13 microgreens, 60 glossário, 21 FAQ) — ficheiros: CLAUDE.md — validação: coerente.
- [ ] (P3) CHANGELOG: entrada para o Ciclo 10 — ficheiros: CHANGELOG.md — validação: presente.
- [ ] (P4) README: contagem do catálogo (57 culturas) — ficheiros: README.md — validação: coerente.
- [ ] (P4) docs/ARQUITETURA: secção "Dados estáticos" lista todos os ficheiros de src/data — ficheiros: docs/ARQUITETURA.md — validação: coerente.
- [ ] (P4) Confirmar que `src/types` não importa de runtime (só tipos) — ficheiros: src/types — validação: grep limpo.
- [ ] (P5) Adicionar JSDoc curto às funções públicas de `growth.ts` sem doc — ficheiros: src/utils — validação: typecheck.
- [ ] (P4) Verificar que não há ficheiros órfãos óbvios (não importados) em src — ficheiros: src — validação: revisão.
- [ ] (P5) Confirmar consistência de `slug` (kebab-case) em todos os data files — ficheiros: src/data — validação: revisão.
- [ ] (P4) Verificar que `tests/e2e` cobre os fluxos críticos (onboarding→colheita) — ficheiros: tests/e2e — validação: revisão.
- [ ] (P5) Confirmar que os imports usam o alias `@/` consistentemente (não `../`) — ficheiros: src — validação: revisão.

## Arquivo (ciclos concluídos)

### Ciclo 9 — 2026-06-22 — 39 concluídas, 1 N/A
Correção de fuga de memória (objectURL da pré-visualização de foto); tipagem da resposta do IPMA (remove `any`); testes (tema, companions reais, completeDay idempotente, blackoutDays, sucessão, recommend sem duplicados); secção Componentes UI na ARQUITETURA; auditoria aria-label; catálogo 55→57 (grão-de-bico, espargo); +2 receitas; +1 lição; +5 glossário; +3 FAQ; microgreen linhaça; sintoma galhas; saúde aromáticas. N/A: loading=lazy em emojis. Testes 161→169.

### Ciclo 8 — 2026-06-22 — 39 concluídas, 1 N/A
Testes (normalize, recipesForPlant, defaultWateringDays, soilTipForMonth, cache calendarFor, bordas); verificações de performance/organização; secção Composables; catálogo 53→55 (nabiça, physalis); +2 receitas; +1 lição; +5 glossário; +3 FAQ; microgreen agrião; sintoma melada; Bt detalhado. N/A: content-visibility. Testes 146→161.

### Ciclo 7 — 2026-06-22 — 40 concluídas, 0 bloqueadas
`.gitignore`; testes de regras de negócio; performance; docs; catálogo 51→53 (chicória, alcachofra); +2 receitas; +1 lição; +5 glossário; +3 FAQ; microgreen alfafa; sintoma teias-finas. Testes 140→146.

### Ciclo 6 — 2026-06-22 — 38 concluídas, 2 N/A
Catálogo 48→51; microgreen trigo; curso u7; pragas; `StageEstimate`; package.json; badge MIT; Home sugere microgreens; teste reativo useReminders. Testes 128→140.

### Ciclo 5 — 2026-06-21 — 40 concluídas
Catálogo 45→48; glossário/FAQ/curso; E2E calendário+curso; skip-link; prefetch; JSDoc; CHANGELOG. Testes 128.

### Ciclo 4 — 2026-06-19 — 40 concluídas
Catálogo 42→45; E2E catálogo+horta; .ics; SECURITY.md; dependabot; :focus-visible; cobertura CI. Testes 104→116.

### Ciclo 3 — 2026-06-19 — 39 concluídas, 1 bloqueada
Catálogo 39→42; backup completo+reset; tsconfig estrito (2 bugs); cache calendarFor. Testes 89→104.

### Ciclo 2 — 2026-06-19 — 38 concluídas, 2 bloqueadas
Catálogo 36→39; curso u6; useReminders; vendor chunk. Bug arrays partilhados. Testes 64→89.

### Ciclo 1 — 2026-06-18/19 — 38 concluídas, 2 bloqueadas
Catálogo 20→36; ESLint (14834→0); desbloqueio do desafio; .ics DTSTAMP; sucessão. Testes 28→64.
