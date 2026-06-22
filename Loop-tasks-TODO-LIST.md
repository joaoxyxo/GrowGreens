# Loop Tasks — TODO List
Ciclo: 10 · Atualizado: 2026-06-22 20:30 · 40/40 concluídas

Estados: `[ ]` pendente · `[x]` concluída (+nota/commit) · `[!]` bloqueada (+motivo).
Stack: Vue 3 + TS + Vite (PWA), Pinia, Vue Router, Vue I18n, Dexie, Tailwind v4. Testes: Vitest (+@vue/test-utils, coverage v8) + Playwright. Lint: ESLint. Format: Prettier. npm. 57 plantas, 13 microgreens, 25 receitas, 60 glossário, 21 FAQ, 15 sintomas, 169 unit + 7 e2e.

## Conteúdo
- [x] (P3) Adicionar 2 plantas novas com entradas de calendário — ficheiros: src/data/plants.ts, calendar.ts — validação: data-integrity. ✓ Feito: lentilha (leguminosa) e ruibarbo (perene, folhas tóxicas/toxicNote). 57→59.
- [x] (P4) Adicionar 2 receitas para plantas ainda sem receita — ficheiros: src/data/recipes.ts — validação: data-integrity. ✓ Feito: nabos salteados (nabo); salada de melão com hortelã. 25→27.
- [x] (P4) Adicionar 5 termos ao glossário — ficheiros: src/data/glossary.ts — validação: build. ✓ Feito: pecíolo, ácido oxálico, perene, anual, sequeiro (→65).
- [x] (P4) Adicionar 3 perguntas à FAQ — ficheiros: src/data/faq.ts — validação: build. ✓ Feito: bichos/inseticida, adubar, plantas perenes (→24).
- [x] (P4) Adicionar 1 lição nova ao curso — ficheiros: src/data/course.ts — validação: build. ✓ Feito: l4-4 'Fazer o teu composto' (u4). 22→23 lições.
- [x] (P4) Adicionar 1 sintoma novo a troubleshoot — ficheiros: src/data/troubleshoot.ts — validação: data-integrity. ✓ Feito: 'folhas-crivadas' → ['altica'].
- [x] (P4) Adicionar 1 microgreen novo — ficheiros: src/data/microgreens.ts — validação: build. ✓ Feito: feno-grego/fenacho (→14).
- [x] (P4) Enriquecer 1 grupo de saúde com info adicional — ficheiros: src/data/health.ts — validação: build. ✓ Feito: folhas_verdes com vitamina C (nutriente + benefício de frescura). (Todos os grupos já tinham caution.)
- [x] (P5) Rever 2 plantas com `portugalNotes` do litoral — ficheiros: src/data/plants.ts — validação: build. ✓ Feito: rabanete (intercalar/verão) e espinafre (outono-inverno Ovar/Aveiro, drenagem).
- [x] (P5) Enriquecer 1 dica mensal vaga — ficheiros: src/data/calendar.ts — validação: build. ✓ Feito: abril (o que semear/transplantar + geada tardia no interior).

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
- [x] (P4) Confirmar que `recipes` é lazy — ficheiros: build — validação: revisão. ✓ recipes.ts só é importado por PlantDetailView → entra no chunk lazy dessa view (fora da entrada).
- [x] (P4) Verificar que `PlantDetailView` não importa o catálogo inteiro — ficheiros: features/catalog — validação: revisão. ✓ Usa `getPlant(slug)` (lookup), não itera/importa PLANTS na UI.
- [x] (P4) Confirmar que `GardenView` usa `useReminders` partilhado — ficheiros: features/garden — validação: revisão. ✓ Verificado: importa useReminders (subscrição única).
- [x] (P4) Verificar que o nº de assets se mantém estável — ficheiros: build — validação: revisão. ✓ 40 assets JS (~1 por view + data + vendor); sem explosão.
- [x] (P5) Avaliar `will-change`/transições — ficheiros: features — validação: revisão. ✓ Verificado: não há `will-change` global; transições são pontuais (transition em chips/botões). Sem custo de composição global.
- [x] (P4) Confirmar que imagens de diário usam dimensões fixas — ficheiros: features/garden — validação: revisão. ✓ Verificado: miniaturas com width/height; pré-visualizações com altura CSS fixa (h-32/max-h-60).
- [x] (P4) Verificar que o vendor chunk não cresceu — ficheiros: build — validação: revisão. ✓ vendor 294.44 kB / 102.10 kB gz (inalterado; plantas vão para o chunk `plants`).
- [x] (P5) Confirmar que `normalize` não corre em loop quente sem cache — ficheiros: features/catalog — validação: revisão. ✓ searchBlob pré-computado uma vez; por pesquisa só normaliza a query (1×).
- [x] (P4) Confirmar que `plants` cresce linearmente — ficheiros: build — validação: revisão. ✓ 116 kB / 26.25 kB gz para 57 plantas (~só dados; sem deps extra).
- [x] (P4) Verificar que `course` chunk é isolado — ficheiros: build — validação: revisão. ✓ course 21.26 kB separado; HealthView/health em chunks próprios.

## Organização
- [x] (P3) Atualizar CLAUDE.md com contagens — ficheiros: CLAUDE.md — validação: coerente. ✓ Feito: 57 plantas, 13 microgreens, 25 receitas, 60 glossário, 21 FAQ, 7u/22 lições, 174 unit + 7 E2E.
- [x] (P3) CHANGELOG: entrada para o Ciclo 10 — ficheiros: CHANGELOG.md — validação: presente. ✓ Feito.
- [x] (P4) README: contagem do catálogo (57 culturas) — ficheiros: README.md — validação: coerente. ✓ Feito.
- [x] (P4) docs/ARQUITETURA: "Dados estáticos" lista os 11 ficheiros — ficheiros: docs/ARQUITETURA.md — validação: coerente. ✓ Feito: faltava faq.ts; agora lista os 11 com descrição.
- [x] (P4) Confirmar que `src/types` não importa de runtime — ficheiros: src/types — validação: grep limpo. ✓ Verificado: só `import type`.
- [x] (P5) JSDoc nas funções públicas de `growth.ts` — ficheiros: src/utils — validação: typecheck. ✓ Já documentadas (defaultWateringDays, areCompanions, areAntagonists, successionDays, estimateStage/StageEstimate).
- [x] (P4) Verificar ficheiros órfãos em src — ficheiros: src — validação: revisão. ✓ Verificado: nenhum .vue órfão (heurística de referências).
- [x] (P5) Confirmar `slug` kebab-case em todos os data files — ficheiros: src/data — validação: revisão. ✓ Verificado: todos os slugs em kebab-case.
- [x] (P4) Verificar cobertura E2E dos fluxos críticos — ficheiros: tests/e2e — validação: revisão. ✓ Verificado: 4 specs com completeOnboarding (desafio, catálogo→horta, calendário/curso, perfil/planeador).
- [x] (P5) Confirmar uso consistente do alias `@/` — ficheiros: src — validação: revisão. ✓ Verificado: 0 imports relativos `../` em src.

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
