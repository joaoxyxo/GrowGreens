# Loop Tasks — TODO List
Ciclo: 6 · Atualizado: 2026-06-21 23:50

Estados: `[ ]` pendente · `[x]` concluída (+nota/commit) · `[!]` bloqueada (+motivo).
Stack: Vue 3 + TS + Vite (PWA), Pinia, Vue Router, Vue I18n, Dexie, Tailwind v4. Testes: Vitest (+@vue/test-utils, coverage v8) + Playwright. Lint: ESLint. Format: Prettier. npm. 48 plantas, 128 testes (+5 e2e).

## Conteúdo
- [x] (P3) Adicionar 2-3 culturas (rúcula-selvagem, funcho-doce n/a; usar tomilho-limão, manjerona, cerefólio) — ficheiros: src/data/plants.ts, calendar.ts — validação: data-integrity; PLANTS.length aumenta. ✓ Feito: +3 (tomilho-limão, manjerona, cerefólio) + calendário → 51 plantas. data-integrity verde.
- [x] (P4) Curso: nova unidade "Colheita e sementes" (guardar sementes) — ficheiros: src/data/course.ts — validação: data-integrity. ✓ Feito: unidade u7 "Guardar sementes" (l7-1: variedades tradicionais, secar/guardar). data-integrity verde.
- [x] (P4) Receitas: +1 receita de leguminosa (ervilhas/favas guisadas) ligada — ficheiros: src/data/recipes.ts — validação: data-integrity. ✓ Feito: feijão-frade guisado (feijao-frade não tinha receita; ervilhas/favas já tinham).
- [x] (P4) Glossário: +termos ("monda", "alfobre/viveiro", "compasso") — ficheiros: src/data/glossary.ts — validação: build. ✓ Feito: +3 termos (monda, alfobre/viveiro, compasso).
- [x] (P4) FAQ: +2 (adubo orgânico vs químico; vale a pena guardar sementes) — ficheiros: src/data/faq.ts — validação: build. ✓ Feito: +2 dúvidas (adubo orgânico/químico; guardar sementes).
- [x] (P5) Saúde: enriquecer grupo das brássicas (sulforafano, vit. C) — ficheiros: src/data/health.ts — validação: build. ✓ Feito: +couve-de-bruxelas/chinesa/mizuna no grupo + dica sobre mirosinase/sulforafano e vit. K.
- [x] (P5) Troubleshoot: +sintoma "flores mas sem fruto (falta polinização)" se ainda não coberto — ficheiros: src/data/troubleshoot.ts — validação: build; sem duplicar. ✓ Verificado: já coberto pelo sintoma "flores-caem" (Ciclo 1). Não duplicar.
- [x] (P5) Pragas: detalhar prevenção biológica do míldio/oídio (consociação) — ficheiros: src/data/pestsDiseases.ts — validação: build. ✓ Feito: prevenção do míldio e oídio com consociação/rotação/variedades resistentes.
- [x] (P5) Microgreens: +1 variedade (couve-roxa já há; adicionar trigo/wheatgrass ou linhaça) — ficheiros: src/data/microgreens.ts — validação: testes. ✓ Feito: erva de trigo (wheatgrass) → 10 variedades. 139 testes.
- [x] (P5) Recomendações: incluir microgreens quando espaço=interior e nada semeável — ficheiros: src/utils/recommend.ts, home — validação: revisão. ✓ Feito: shouldSuggestMicrogreens() + cartão no Home a ligar para /desafio. TC/lint/build OK.

## Regras de Negócio
- [x] (P3) Teste de integridade: todas as plantas têm ≥1 entrada de calendário — ficheiros: tests/data-integrity.test.ts — validação: teste verde (ou corrige dados). ✓ Feito: teste garante calendário para as 48 plantas (todas já têm).
- [x] (P4) Teste de integridade: recipesForPlant cobre todas as plantas-alvo das receitas — ficheiros: tests/ — validação: teste. ✓ Feito: teste 'cada receita refere ≥1 planta' (refs já validadas por outro teste).
- [x] (P4) Teste: MICROGREENS slugs únicos e daysToHarvest coerentes — ficheiros: tests/data-integrity.test.ts — validação: teste. ✓ Feito.
- [x] (P4) Teste: GLOSSARY/FAQ sem termos/perguntas duplicadas — ficheiros: tests/ — validação: teste. ✓ Feito.
- [x] (P4) progress: `addXp` nunca fica negativo; nível sobe corretamente — ficheiros: tests/progress.test.ts — validação: teste. ✓ Feito: addXp acumula e o nível sobe.
- [x] (P5) Teste: bedsRepo.clearCell remove a célula correta — ficheiros: tests/repositories.test.ts — validação: teste. ✓ Feito: remove só a célula alvo, mantém as outras.
- [x] (P5) Teste: `currentSeason` mapeia meses corretamente — ficheiros: tests/date.test.ts — validação: teste. ✓ Feito: 4 estações com fake timers.
- [x] (P5) Teste: achievementToast desconhecido devolve fallback — ficheiros: tests/ — validação: teste. ✓ Feito.
- [x] (P5) Teste: calendarForPlant zona desconhecida cai em delta 0 — ficheiros: tests/calendar.test.ts — validação: teste. ✓ Feito: igual a litoral_norte.
- [ ] (P5) Teste: useReminders reflete novos lembretes (reativo) — ficheiros: tests/ — validação: teste.

## Performance
- [x] (P4) E2E: backup (exportar dados) na ProfileView — ficheiros: tests/e2e/ — validação: spec passa. ✓ Feito: spec valida download de growgreens-backup.json. 7 specs e2e verdes.
- [x] (P4) E2E: planeador — criar canteiro e plantar célula — ficheiros: tests/e2e/ — validação: spec passa. ✓ Feito: cria espaço → planta alface numa célula (aria-label muda).
- [ ] (P5) `fetchpriority`/eager na 1.ª imagem acima da dobra (se houver) — ficheiros: features — validação: revisão.
- [x] (P5) Confirmar que vendor não inclui código de testes — ficheiros: build — validação: revisão. ✓ Verificado: grep no dist/assets/*.js sem test-utils/vitest/describe.
- [!] (P5) Avaliar dividir o catálogo (`plants`) em chunk por categoria — NÃO JUSTIFICA: plants já é chunk lazy próprio (~102KB/~25KB gz) e carrega só no catálogo. Dividir por categoria fragmentaria sem ganho percetível a 51 plantas.
- [x] (P5) `aria-live` no ToastHost para anúncios — ficheiros: components/ToastHost.vue — validação: revisão. ✓ Verificado: ToastHost já tem aria-live="polite" (confirmado por teste).
- [x] (P5) Confirmar precache do sw não inclui ficheiros enormes — ficheiros: build — validação: revisão. ✓ Verificado: maior ativo é vendor 294KB; nenhum ficheiro >600KB.
- [x] (P5) Revisão: imagens de ícones com tamanho adequado no manifest — ficheiros: vite.config — validação: revisão. ✓ Verificado: 192, 512 e maskable-512 presentes.
- [ ] (P5) Evitar reflow no scroll horizontal de chips (revisão) — ficheiros: features — validação: revisão.
- [x] (P5) Confirmar tree-shaking de @vue/test-utils fora do bundle — ficheiros: build — validação: revisão. ✓ Verificado: nenhuma referência em src/ nem no dist.

## Organização
- [x] (P4) Teste de componente: TabBar (links e item ativo) — ficheiros: tests/ — validação: mount passa. ✓ Feito: 5 tabs, com router em memória.
- [x] (P4) Teste de componente: ToastHost (mostra toasts do store) — ficheiros: tests/ — validação: mount passa. ✓ Feito: toast do store aparece; aria-live presente.
- [x] (P4) A11y: heading hierarchy (1 h1 por página / PageHeader como h1) — ficheiros: components — validação: revisão. ✓ Verificado: PageHeader já usa <h1> (15 vistas); Home e Onboarding têm exatamente 1 h1; secções usam h2. Coerente.
- [ ] (P5) docs/ARQUITETURA: atualizar com utils/text, backup, composables — ficheiros: docs — validação: coerente.
- [x] (P5) README: badge de licença + link CHANGELOG — ficheiros: README.md — validação: presente. ✓ Feito: badge MIT + link para CHANGELOG.md.
- [x] (P5) Tipar retorno de `estimateStage` num interface nomeado — ficheiros: src/utils/growth.ts — validação: typecheck. ✓ Feito: interface StageEstimate exportado. TC OK.
- [ ] (P5) Normalizar imports (ordem) onde for trivial — ficheiros: src — validação: lint.
- [x] (P5) Confirmar que data files não importam de features (camadas) — ficheiros: src/data — validação: revisão. ✓ Verificado: grep sem imports de @/features em src/data.
- [x] (P5) Adicionar `funding`/`bugs`/`repository` ao package.json — ficheiros: package.json — validação: build. ✓ Feito: license, homepage, repository e bugs adicionados.
- [x] (P5) Atualizar CLAUDE.md (nº plantas/receitas/testes) se mudou — ficheiros: CLAUDE.md — validação: coerente. ✓ Feito: 51 plantas, 10 microgreens, 19 receitas, 139 unit + 7 E2E.

## Arquivo (ciclos concluídos)

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
