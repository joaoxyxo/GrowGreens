# Loop Tasks — TODO List
Ciclo: 12 · Atualizado: 2026-06-22 23:00

Estados: `[ ]` pendente · `[x]` concluída (+nota/commit) · `[!]` bloqueada (+motivo).
Stack: Vue 3 + TS + Vite (PWA), Pinia, Vue Router, Vue I18n, Dexie, Tailwind v4. Testes: Vitest (+@vue/test-utils, coverage v8) + Playwright. Lint: ESLint. Format: Prettier. npm. 61 plantas, 15 microgreens, 30 receitas, 70 glossário, 27 FAQ, 17 sintomas, 182 unit + 9 e2e.

## Conteúdo
- [ ] (P3) Adicionar 2 plantas novas ao catálogo (ex.: aipo-rábano, batata-doce) com calendário — ficheiros: src/data/plants.ts, calendar.ts — validação: tests/data-integrity.test.ts.
- [ ] (P4) Adicionar 2 receitas para plantas ainda sem receita (ex.: cenoura, beterraba) — ficheiros: src/data/recipes.ts — validação: data-integrity.
- [ ] (P4) Adicionar 4 termos ao glossário (70→74) — ficheiros: src/data/glossary.ts — validação: build + sem duplicados.
- [ ] (P4) Adicionar 3 perguntas à FAQ (27→30) — ficheiros: src/data/faq.ts — validação: build.
- [ ] (P4) Adicionar 1 lição nova a uma unidade existente do curso — ficheiros: src/data/course.ts — validação: build + lição referenciável.
- [ ] (P4) Adicionar 1 sintoma novo a troubleshoot com `related` válido (ex.: lesma) — ficheiros: src/data/troubleshoot.ts — validação: data-integrity.
- [ ] (P4) Adicionar 1 microgreen novo (ex.: cebola) — ficheiros: src/data/microgreens.ts — validação: build.
- [ ] (P5) Rever 2 plantas com `in30Seconds` mais acionável — ficheiros: src/data/plants.ts — validação: build.
- [ ] (P5) Enriquecer 2 dicas mensais (MONTHLY_TIPS) restantes que estejam vagas — ficheiros: src/data/calendar.ts — validação: build.
- [ ] (P5) Adicionar 1 conquista (achievement) nova coerente — ficheiros: src/data/achievements.ts — validação: build + toast.

## Regras de Negócio
- [x] (P2) Título do documento por rota — ficheiros: src/router/index.ts — validação: typecheck + build. ✓ Feito: meta.title em todas as rotas + afterEach define `<título> · GrowGreens`.
- [x] (P3) Teste: cada rota nomeada tem `meta.title` — ficheiros: tests/router.test.ts — validação: vitest. ✓ Feito + allowAnon e hideTabBar. (Testes de navegação evitados por serem flaky com singleton+pinia; guard coberto por E2E.)
- [x] (P3) Guard de onboarding — ficheiros: tests/router.test.ts/e2e — validação: vitest+playwright. ✓ Coberto: E2E (completeOnboarding atravessa o guard) + unit confirma allowAnon na rota de onboarding. Navegação no guard não testada em unit por flakiness do router singleton.
- [x] (P3) Teste: planta com `portugalNotes`/`harvestNotes` não vazios — ficheiros: tests/data-integrity.test.ts — validação: vitest. ✓ Feito.
- [x] (P3) Teste: `toxicNote` quando petSafe=false — ficheiros: tests/data-integrity.test.ts — validação: vitest. ✓ Já coberto ('plantas não seguras para animais têm nota de toxicidade').
- [x] (P3) Teste: `recipesForPlant` sem duplicados — ficheiros: tests/recipes.test.ts — validação: vitest. ✓ Feito (tomate/alho/cebola).
- [x] (P3) Teste: `MONTHLY_TIPS` cobre os 12 meses — ficheiros: tests/calendar.test.ts — validação: vitest. ✓ Feito.
- [x] (P4) Teste: `soilTipForMonth` cobre 1-12 — ficheiros: tests/calendar.test.ts — validação: vitest. ✓ Feito.
- [x] (P4) Teste: `achievementToast` não vazio p/ todos os códigos — ficheiros: tests/progress.test.ts — validação: vitest. ✓ Feito (itera ACHIEVEMENTS, contém o nome).
- [x] (P4) Teste: catálogo com variedade de categorias — ficheiros: tests/data-integrity.test.ts — validação: vitest. ✓ Feito.

## Performance
- [x] (P4) Confirmar que `document.title` não causa re-render — ficheiros: src/router — validação: revisão. ✓ É um efeito DOM no afterEach do router, fora da reatividade do Vue; não re-renderiza componentes.
- [x] (P4) Verificar chunk de entrada após o título por rota — ficheiros: build — validação: revisão. ✓ index ~32 kB / 9.8 kB gz (estável; só meta estática + afterEach).
- [x] (P4) Confirmar render de `PlantDetailView` — ficheiros: features/catalog — validação: revisão. ✓ Usa getPlant(slug) + computed; sem iteração do catálogo no render.
- [x] (P4) Verificar grelha de `BedView` — ficheiros: features/planner — validação: revisão. ✓ Lê células de `bed.cells[key]` (mapa); v-for sobre rows/cols; selectedCell/pickerResults são computed.
- [!] (P5) Dividir `PlantingDetailView` em subcomponentes — NÃO JUSTIFICA: 318 linhas coesas (diário+foto+lembretes de uma planta); dividir agora aumentaria a complexidade de props/estado sem ganho claro.
- [x] (P4) Confirmar vendor estável — ficheiros: build — validação: revisão. ✓ 294.44 kB / 102.10 kB gz (inalterado).
- [x] (P4) Verificar chunk `plants` — ficheiros: build — validação: revisão. ✓ 125.89 kB / 28.32 kB gz, lazy (só no catálogo/detalhe). Razoável para 61 plantas.
- [x] (P5) Confirmar imports em componentes — ficheiros: src/components — validação: revisão. ✓ Nenhum componente importa de @/data/(plants|recipes|course|glossary).
- [x] (P4) Verificar ausência de avisos de tamanho — ficheiros: build — validação: revisão. ✓ Sem warnings (limite 600 kB; maior chunk vendor 294 kB).
- [x] (P4) Confirmar precache PWA — ficheiros: build — validação: revisão. ✓ Maior precache é vendor 294 kB; nada novo enorme (plants/course continuam lazy e moderados).

## Organização
- [ ] (P3) Atualizar CLAUDE.md com contagens finais do Ciclo 12 — ficheiros: CLAUDE.md — validação: coerente.
- [ ] (P3) CHANGELOG: entrada para o Ciclo 12 — ficheiros: CHANGELOG.md — validação: presente.
- [ ] (P4) README: mencionar títulos por rota / nº de testes atual — ficheiros: README.md — validação: coerente.
- [ ] (P4) docs/ARQUITETURA: nota sobre o router (guard + meta.title) — ficheiros: docs/ARQUITETURA.md — validação: coerente.
- [ ] (P4) Confirmar que `index.html` tem meta description e theme-color coerentes — ficheiros: index.html — validação: revisão.
- [ ] (P5) Adicionar JSDoc curto às funções de `src/lib/db/meta.ts` sem doc — ficheiros: src/lib/db — validação: typecheck.
- [ ] (P4) Verificar que não há imports não usados após mudanças do router — ficheiros: src — validação: lint.
- [ ] (P5) Confirmar que todos os ecrãs usam `PageHeader` (consistência de cabeçalho) — ficheiros: src/features — validação: revisão.
- [ ] (P4) Verificar que `tests/` continua sem ficheiros de teste vazios/skip — ficheiros: tests — validação: revisão.
- [ ] (P5) Confirmar que os emojis usados nos dados não quebram em build (encoding) — ficheiros: build — validação: revisão.

## Arquivo (ciclos concluídos)

### Ciclo 11 — 2026-06-22 — 40 concluídas
E2E de diagnóstico e glossário (via Perfil, sem reload); testes de integridade reforçados (receitas, saúde, emojis, quiz, auto-referência, bounds de estimateStage); verificações de performance e camadas (features só leem db, mutações via repos); catálogo 59→61 (quiabo, chalota); +3 receitas; +1 lição (orientação solar); +5 glossário; +3 FAQ; microgreen salsa; sintoma mosca-branca. Testes 174→182, E2E 7→9.

### Ciclo 10 — 2026-06-22 — 40 concluídas
`bedsRepo.update` clampa dimensões; testes de integridade; recipes lazy; catálogo 57→59 (lentilha, ruibarbo). Testes 169→174.

### Ciclo 9 — 2026-06-22 — 39 concluídas, 1 N/A
Fuga objectURL corrigida; tipagem IPMA (remove any); Componentes UI na ARQUITETURA; catálogo 55→57 (grão-de-bico, espargo). Testes 161→169.

### Ciclo 8 — 2026-06-22 — 39 concluídas, 1 N/A
Testes (normalize, recipesForPlant, soilTipForMonth, cache); Composables na ARQUITETURA; catálogo 53→55 (nabiça, physalis). Testes 146→161.

### Ciclo 7 — 2026-06-22 — 40 concluídas
`.gitignore`; testes; docs; catálogo 51→53 (chicória, alcachofra). Testes 140→146.

### Ciclo 6 — 2026-06-22 — 38 concluídas, 2 N/A
Catálogo 48→51; microgreen trigo; curso u7; `StageEstimate`; Home sugere microgreens. Testes 128→140.

### Ciclo 5 — 2026-06-21 — 40 concluídas
Catálogo 45→48; E2E calendário+curso; skip-link; prefetch. Testes 128.

### Ciclo 4 — 2026-06-19 — 40 concluídas
Catálogo 42→45; E2E catálogo+horta; .ics; SECURITY.md; cobertura CI. Testes 104→116.

### Ciclo 3 — 2026-06-19 — 39 concluídas, 1 bloqueada
Catálogo 39→42; backup+reset; tsconfig estrito (2 bugs). Testes 89→104.

### Ciclo 2 — 2026-06-19 — 38 concluídas, 2 bloqueadas
Catálogo 36→39; curso u6; useReminders; vendor chunk. Testes 64→89.

### Ciclo 1 — 2026-06-18/19 — 38 concluídas, 2 bloqueadas
Catálogo 20→36; ESLint (14834→0); desbloqueio do desafio. Testes 28→64.
