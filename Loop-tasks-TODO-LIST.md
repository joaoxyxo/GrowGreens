# Loop Tasks — TODO List
Ciclo: 5 · Atualizado: 2026-06-19 09:41

Estados: `[ ]` pendente · `[x]` concluída (+nota/commit) · `[!]` bloqueada (+motivo).
Stack: Vue 3 + TS + Vite (PWA), Pinia, Vue Router, Vue I18n, Dexie, Tailwind v4. Testes: Vitest (+@vue/test-utils, coverage v8) + Playwright. Lint: ESLint. Format: Prettier. npm. 45 plantas, 116 testes (+3 e2e).

## Conteúdo
- [x] (P3) Adicionar 2-3 culturas (mizuna, beldroega/portulaca, segurelha) com schema + calendário — ficheiros: src/data/plants.ts, calendar.ts — validação: data-integrity; PLANTS.length aumenta. ✓ Feito: +3 (mizuna, beldroega, segurelha) + calendário → 48 plantas. data-integrity verde.
- [x] (P4) Glossário: +termos ("estaca", "estratificação", "rega de fundo") — ficheiros: src/data/glossary.ts — validação: build. ✓ Feito: +3 termos (estaca, estratificação, rega de fundo).
- [x] (P4) FAQ: +3 dúvidas (interior vs exterior, quando colher, pragas em casa) — ficheiros: src/data/faq.ts — validação: build. ✓ Feito: +3 dúvidas (interior/exterior, ponto de colheita, pragas em casa).
- [x] (P4) Curso: lição sobre rotação de culturas e famílias — ficheiros: src/data/course.ts — validação: data-integrity. ✓ Feito: lição l4-3 'Rotação de culturas' (famílias, leguminosas que repõem azoto). data-integrity verde.
- [x] (P4) Receitas: ligar receita a plantas sem nenhuma (beterraba, courgette) — ficheiros: src/data/recipes.ts — validação: data-integrity. ✓ Feito: courgette-salteada (courgette não tinha nenhuma) + beterraba-assada (dedicada). 128 testes.
- [ ] (P5) Saúde: enriquecer grupo das leguminosas (proteína, ferro) — ficheiros: src/data/health.ts — validação: build.
- [ ] (P5) Pragas: +ficha (caracol vs lesma, ou nemátodes) — ficheiros: src/data/pestsDiseases.ts — validação: build.
- [ ] (P5) Troubleshoot: +sintoma "clorose (amarelo entre nervuras)" — ficheiros: src/data/troubleshoot.ts — validação: build.
- [ ] (P5) Microgreens: dica de luz pós-blackout (texto) — ficheiros: src/data/microgreens.ts — validação: build.
- [ ] (P5) Calendário: dica de preparação de solo por estação — ficheiros: src/data/calendar.ts — validação: build.

## Regras de Negócio
- [x] (P4) Teste de componente: EmptyState — ficheiros: tests/ — validação: mount passa. ✓ Feito: emoji/título/descrição.
- [x] (P4) Teste de componente: StatChip — ficheiros: tests/ — validação: mount passa. ✓ Feito: valor/ícone visíveis; label no title.
- [x] (P4) Teste de componente: DifficultyDots — ficheiros: tests/ — validação: mount passa. ✓ Feito: nº de pontos preenchidos por dificuldade + label.
- [x] (P4) Teste: buildICS escapa vírgulas/; em SUMMARY (RFC) — ficheiros: tests/ics.test.ts — validação: teste. ✓ Feito: escapeICS() (\, \; \\ \n) no SUMMARY + teste.
- [x] (P4) `remindersRepo.complete` de não-recorrente marca done=true — ficheiros: tests/ — validação: teste. ✓ Feito: teste em repositories.test.
- [x] (P5) `plantingsRepo.all` exclui 'perdida' (teste do filtro) — ficheiros: tests/ — validação: teste. ✓ Feito: teste confirma exclusão.
- [x] (P5) `safe()` util: devolve undefined e loga em erro — ficheiros: tests/ — validação: teste. ✓ Feito: tests/safe.test.ts (sucesso + erro).
- [x] (P5) `estimateStage` clamp de daysOld negativo — ficheiros: src/utils/growth.ts, tests/ — validação: teste. ✓ Feito: Math.max(0, daysOld) + teste.
- [x] (P5) Teste: calendarFor desloca litoral_sul (-1) — ficheiros: tests/calendar.test.ts — validação: teste. ✓ Feito: teste do shift -1.
- [x] (P5) Clamp de `wateringEveryDays` também no update — ficheiros: src/repositories/index.ts — validação: teste. ✓ Feito: clamp ≥1 no update + teste. 128 testes.

## Performance
- [ ] (P4) E2E: percorrer uma lição do curso — ficheiros: tests/e2e/ — validação: spec passa.
- [ ] (P4) E2E: navegar o calendário (mês anterior/seguinte) — ficheiros: tests/e2e/ — validação: spec passa.
- [ ] (P5) `decoding="async"` nas imagens de foto — ficheiros: features/* — validação: build.
- [ ] (P5) Pré-carregar rota do curso a partir do Home — ficheiros: features/home — validação: build.
- [ ] (P5) Confirmar `prefers-reduced-motion` desativa transições de rota — ficheiros: main.css/App — validação: revisão.
- [ ] (P5) Confirmar que o CSS de produção é razoável (< 50KB) — ficheiros: build — validação: build.
- [ ] (P5) Verificar que useLiveQuery cancela subscrição no unmount — ficheiros: composables — validação: revisão.
- [ ] (P5) Confirmar DiagnosisView em chunk próprio — ficheiros: build — validação: build.
- [ ] (P5) Evitar recomputar `sowableSet` por scroll (já computed) — ficheiros: catalog — validação: revisão.
- [ ] (P5) Revisão: `key` estável em todas as listas v-for — ficheiros: features — validação: revisão.

## Organização
- [x] (P4) A11y: skip-link "saltar para o conteúdo" + landmark main — ficheiros: App.vue — validação: revisão. ✓ Feito: skip-link (sr-only, visível ao focar) → #conteudo; <main id="conteudo">. Build OK.
- [x] (P4) Teste de componente: PageHeader — ficheiros: tests/ — validação: mount passa. ✓ Feito: título/subtítulo (router em memória). 120 testes.
- [x] (P4) README: secção de instalação da PWA / capturas — ficheiros: README.md — validação: secção presente. ✓ Feito: secção 'Instalar como app (PWA)' (Android/iOS/Desktop + link).
- [ ] (P5) `<noscript>` informativo no index.html — ficheiros: index.html — validação: build.
- [ ] (P5) Consolidar `normalize` (acentos) num util partilhado — ficheiros: src/utils — validação: typecheck; sem duplicação.
- [ ] (P5) JSDoc curto nas uniões públicas — ficheiros: src/types — validação: typecheck.
- [ ] (P5) Documentar pre-commit sugerido no CONTRIBUTING — ficheiros: CONTRIBUTING.md — validação: doc.
- [ ] (P5) Adicionar `CHANGELOG.md` (resumo dos ciclos) — ficheiros: raiz — validação: ficheiro existe.
- [ ] (P5) Atualizar CLAUDE.md (45 plantas, 116+ testes, e2e) — ficheiros: CLAUDE.md — validação: coerente.
- [ ] (P5) Confirmar `.editorconfig` aplicado (indent consistente) — ficheiros: revisão — validação: revisão.

## Arquivo (ciclos concluídos)

### Ciclo 4 — 2026-06-19 — 40 concluídas, 0 bloqueadas
Catálogo 42→45 (couve-de-bruxelas/canónigos/cebolinho-chinês); glossário +rotação/adubo verde/pH; ProgressBar/Badge/AppCard testados; SECURITY.md; FAQ na GlossaryView; receitas cenoura/beterraba; CI cobertura; dependabot; meta tags; **E2E catálogo+horta** (corrigiu base path partido); saúde caution batata; damping-off; recommend determinístico; microgreens demolha; calendário geada; bundle no README; prefetch catálogo; content-visibility; :focus-visible global; width/height; curso l5-4; compressImage doc; a11y planeador. Testes 104→116 (+3 e2e).

### Ciclo 3 — 2026-06-19 — 39 concluídas, 1 bloqueada
Catálogo 39→42; sopa-da-horta + microgreens; backup COMPLETO + reset (corrigiu export); ui/settings testados; infra testes de componente; tsconfig estrito (2 bugs); cache calendarFor; v-memo; troubleshoot related. Testes 89→104. Bloqueada: defineAsyncComponent.

### Ciclo 2 — 2026-06-19 — 38 concluídas, 2 bloqueadas
Catálogo 36→39; curso u6; useReminders; lazy share; cache sowable; thresholds; docs/ARQUITETURA; vendor chunk. Testes 64→89. Bug: arrays partilhados (progress).

### Ciclo 1 — 2026-06-18/19 — 38 concluídas, 2 bloqueadas
Catálogo 20→36; ESLint trash (14834→0); CLAUDE.md; desbloqueio do desafio; .ics DTSTAMP; testes utils; vendor; sucessão; prefetch. Testes 28→64.
