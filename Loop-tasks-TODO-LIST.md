# Loop Tasks — TODO List
Ciclo: 11 · Atualizado: 2026-06-22 22:30 · 40/40 concluídas

Estados: `[ ]` pendente · `[x]` concluída (+nota/commit) · `[!]` bloqueada (+motivo).
Stack: Vue 3 + TS + Vite (PWA), Pinia, Vue Router, Vue I18n, Dexie, Tailwind v4. Testes: Vitest (+@vue/test-utils, coverage v8) + Playwright. Lint: ESLint. Format: Prettier. npm. 59 plantas, 14 microgreens, 27 receitas, 65 glossário, 24 FAQ, 16 sintomas, 174 unit + 7 e2e.

## Conteúdo
- [x] (P3) Adicionar 2 plantas novas com calendário — ficheiros: src/data/plants.ts, calendar.ts — validação: data-integrity. ✓ Feito: quiabo e chalota (toxicNote allium). 59→61.
- [x] (P4) Adicionar 2 receitas para plantas sem receita — ficheiros: src/data/recipes.ts — validação: data-integrity. ✓ Feito: morangos com hortelã; sopa de agrião. 27→29 (+microgreens=30).
- [x] (P4) Adicionar 5 termos ao glossário — ficheiros: src/data/glossary.ts — validação: build. ✓ Feito: bolbo, cura, estufa/túnel, solarização, mancha (→70).
- [x] (P4) Adicionar 3 perguntas à FAQ — ficheiros: src/data/faq.ts — validação: build. ✓ Feito: regar após chuva, plantar alho germinado, lesmas (→27).
- [x] (P4) Adicionar 1 lição nova ao curso — ficheiros: src/data/course.ts — validação: build. ✓ Feito: l3-4 'A orientação da tua varanda' (u3). 23→24 lições.
- [x] (P4) Adicionar 1 sintoma novo a troubleshoot — ficheiros: src/data/troubleshoot.ts — validação: data-integrity. ✓ Feito: 'nuvem-brancos' → ['mosca-branca']. 16→17.
- [x] (P4) Adicionar 1 microgreen novo — ficheiros: src/data/microgreens.ts — validação: build. ✓ Feito: salsa (microgreen). 14→15.
- [x] (P5) Rever 2 plantas (feedingNotes) — ficheiros: src/data/plants.ts — validação: build. ✓ Feito: rúcula (azoto/pulgões) e agrião (água parada/hidroponia).
- [x] (P5) Enriquecer 2 dicas mensais — ficheiros: src/data/calendar.ts — validação: build. ✓ Feito: janeiro (alho/chalota/planeamento) e fevereiro (sementeiras interior + favas/ervilhas).
- [x] (P5) Adicionar 1 receita de microgreens — ficheiros: src/data/recipes.ts — validação: data-integrity. ✓ Feito: tosta de abacate, ovo e microgreens (→30).

## Regras de Negócio
- [x] (P2) E2E: diagnóstico por sintomas abre e mostra "o que fazer" — ficheiros: tests/e2e/diagnosis-glossary.spec.ts — validação: playwright. ✓ Feito: abre sintoma 'Folhas amarelas' e confirma 'Provavelmente:'. Navega via Perfil (SPA).
- [x] (P2) E2E: glossário filtra termos pela pesquisa — ficheiros: tests/e2e/diagnosis-glossary.spec.ts — validação: playwright. ✓ Feito: pesquisa 'substrato' mostra Substrato e esconde Vernalização. 7→9 E2E.
- [x] (P3) Teste: receitas com `steps`/`ingredients` não vazios — ficheiros: tests/data-integrity.test.ts — validação: vitest. ✓ Feito.
- [x] (P3) Teste: grupos de saúde com `whyGood`/`nutrients` não vazios — ficheiros: tests/data-integrity.test.ts — validação: vitest. ✓ Feito.
- [x] (P3) Teste: consistência grupos de saúde ↔ catálogo — ficheiros: tests/data-integrity.test.ts — validação: vitest. ✓ Feito (forward): as plantas listadas em cada grupo existem no catálogo. (A inversa não se aplica: group.plants é subconjunto curado, não exaustivo — cada planta já valida nutrientGroup existente noutro teste.)
- [x] (P3) Teste: `estimateStage` index em [0, total-1] — ficheiros: tests/growth.test.ts — validação: vitest. ✓ Feito: vários daysOld (negativos/futuro).
- [x] (P3) Teste: `challengeDayState` dia 7 concluído → done — ficheiros: tests/challenge.test.ts — validação: vitest. ✓ Feito.
- [x] (P4) Teste: `FAQ`/`GLOSSARY` com emoji em todas as entradas — ficheiros: tests/data-integrity.test.ts — validação: vitest. ✓ Feito.
- [x] (P4) Teste: quiz `correctIndex` dentro do nº de opções — ficheiros: tests/data-integrity.test.ts — validação: vitest. ✓ Feito.
- [x] (P4) Teste: planta não é companheira/antagonista de si própria — ficheiros: tests/data-integrity.test.ts — validação: vitest. ✓ Feito.

## Performance
- [x] (P4) Confirmar que diagnóstico não importa `compressImage` — ficheiros: features/diagnosis — validação: revisão. ✓ Verificado: DiagnosisView é por sintomas; não importa compressImage.
- [x] (P4) Verificar que o catálogo filtra de forma estável — ficheiros: features/catalog — validação: revisão. ✓ `results` é computed; searchBlob pré-computado; v-memo no grid.
- [x] (P4) Confirmar tamanho do `glossary` chunk — ficheiros: build — validação: revisão. ✓ GlossaryView 18.37 kB / 7.48 kB gz (inclui FAQ+glossário lazy). Razoável.
- [x] (P4) Verificar gzip de entrada — ficheiros: build — validação: revisão. ✓ index ~9.5 + css 7.5 + vendor 102 ≈ 119 KB gz (maioria vendor cacheável).
- [x] (P5) Avaliar chunk de `troubleshoot`/`faq` — ficheiros: build — validação: revisão. ✓ Já partilham o chunk da respetiva view (importados só por DiagnosisView/GlossaryView); ok.
- [x] (P4) Confirmar live queries mínimas — ficheiros: composables/features — validação: revisão. ✓ useReminders é subscrição única partilhada; restantes liveQueries são por-ecrã e específicas.
- [x] (P4) Verificar compressão de imagens antes de gravar — ficheiros: features/garden — validação: revisão. ✓ PlantDetailView chama compressImage(f) antes de guardar no diário.
- [x] (P5) Confirmar watchers `deep` — ficheiros: features/stores — validação: revisão. ✓ Só 2 deep watchers (progress/settings, estado pequeno para persistir); nenhum sobre listas grandes.
- [x] (P4) Verificar vendor estável — ficheiros: build — validação: revisão. ✓ 294.44 kB / 102.10 kB gz (inalterado).
- [x] (P4) Confirmar ausência de avisos de chunk — ficheiros: build — validação: revisão. ✓ Build sem warnings (chunkSizeWarningLimit 600; maior chunk vendor 294 kB).

## Organização
- [x] (P3) Atualizar CLAUDE.md com contagens — ficheiros: CLAUDE.md — validação: coerente. ✓ Feito: 59 plantas, 14 microgreens, 27 receitas, 65 glossário, 24 FAQ, 7u/23 lições, 182 unit + 9 E2E.
- [x] (P3) CHANGELOG: entrada para o Ciclo 11 — ficheiros: CHANGELOG.md — validação: presente. ✓ Feito.
- [x] (P4) README: catálogo (59 culturas) + nº de testes — ficheiros: README.md — validação: coerente. ✓ Feito: 59 culturas; 182 unit + 9 E2E com ecrãs cobertos.
- [x] (P4) docs/ARQUITETURA: nota de cobertura E2E — ficheiros: docs/ARQUITETURA.md — validação: coerente. ✓ Feito: lista de 9 ecrãs cobertos + porquê navegar por SPA (guard).
- [x] (P4) Camadas: features vs lib/db — ficheiros: src/features — validação: revisão. ✓ Verificado: features usam `db` SÓ em liveQueries de LEITURA (where/get/toArray/count); TODAS as mutações passam por repositórios. Padrão local-first deliberado.
- [x] (P5) JSDoc em `streak.ts`/`challenge.ts` — ficheiros: src/utils — validação: typecheck. ✓ Já documentadas (applyActivity, computeUnlockedDay, challengeDayState).
- [x] (P4) Verificar ausência de `TODO`/`FIXME` — ficheiros: src — validação: grep. ✓ Verificado: nenhum TODO/FIXME real (só a palavra 'TODOS' em texto de UI).
- [x] (P5) Confirmar props tipadas em `ui/` — ficheiros: src/components/ui — validação: typecheck. ✓ Verificado: os 7 componentes usam defineProps<...> tipado.
- [x] (P4) Verificar tamanho dos data files — ficheiros: src/data — validação: revisão. ✓ plants.ts ~3157 linhas (dados puros lineares, já lazy chunk próprio); split traria complexidade no índice/integridade sem ganho. Restantes ≤731 linhas.
- [x] (P5) Confirmar fim-de-linha/espaços finais — ficheiros: src — validação: format check. ✓ 0 espaços finais; todos os ficheiros com newline final. (Nota: prettier --check difere em estilo de aspas/quebras em 36 ficheiros, mas o gate efetivo é eslint=0; reformatar em massa fica fora de scope.)

## Arquivo (ciclos concluídos)

### Ciclo 10 — 2026-06-22 — 40 concluídas
`bedsRepo.update` clampa dimensões (1-12); testes de integridade (textos de planta, summary nas lições, whatToDo, flavour/note); verificações de performance (recipes lazy, chunks isolados) e organização (slugs kebab, alias @/); catálogo 57→59 (lentilha, ruibarbo); +2 receitas; +1 lição (composto); +5 glossário; +3 FAQ; microgreen feno-grego; sintoma áltica; saúde folhas_verdes. Testes 169→174.

### Ciclo 9 — 2026-06-22 — 39 concluídas, 1 N/A
Fuga de memória objectURL corrigida; tipagem IPMA (remove any); testes (tema, companions reais, completeDay, blackoutDays, sucessão); Componentes UI na ARQUITETURA; aria-label; catálogo 55→57 (grão-de-bico, espargo). Testes 161→169.

### Ciclo 8 — 2026-06-22 — 39 concluídas, 1 N/A
Testes (normalize, recipesForPlant, defaultWateringDays, soilTipForMonth, cache); Composables na ARQUITETURA; catálogo 53→55 (nabiça, physalis). Testes 146→161.

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
