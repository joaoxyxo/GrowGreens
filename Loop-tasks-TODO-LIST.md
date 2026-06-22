# Loop Tasks — TODO List
Ciclo: 11 · Atualizado: 2026-06-22 21:00

Estados: `[ ]` pendente · `[x]` concluída (+nota/commit) · `[!]` bloqueada (+motivo).
Stack: Vue 3 + TS + Vite (PWA), Pinia, Vue Router, Vue I18n, Dexie, Tailwind v4. Testes: Vitest (+@vue/test-utils, coverage v8) + Playwright. Lint: ESLint. Format: Prettier. npm. 59 plantas, 14 microgreens, 27 receitas, 65 glossário, 24 FAQ, 16 sintomas, 174 unit + 7 e2e.

## Conteúdo
- [ ] (P3) Adicionar 2 plantas novas ao catálogo (ex.: quiabo, alho-porro/chalota) com calendário — ficheiros: src/data/plants.ts, calendar.ts — validação: tests/data-integrity.test.ts.
- [ ] (P4) Adicionar 2 receitas para plantas ainda sem receita (ex.: morango, agrião) — ficheiros: src/data/recipes.ts — validação: data-integrity.
- [ ] (P4) Adicionar 5 termos ao glossário (65→70) — ficheiros: src/data/glossary.ts — validação: build + sem duplicados.
- [ ] (P4) Adicionar 3 perguntas à FAQ (24→27) — ficheiros: src/data/faq.ts — validação: build.
- [ ] (P4) Adicionar 1 lição nova a uma unidade existente do curso — ficheiros: src/data/course.ts — validação: build + lição referenciável.
- [ ] (P4) Adicionar 1 sintoma novo a troubleshoot com `related` válido (ex.: mosca-branca) — ficheiros: src/data/troubleshoot.ts — validação: data-integrity.
- [ ] (P4) Adicionar 1 microgreen novo (ex.: salsa) — ficheiros: src/data/microgreens.ts — validação: build.
- [ ] (P5) Rever 2 plantas com `feedingNotes`/`wateringNotes` mais úteis — ficheiros: src/data/plants.ts — validação: build.
- [ ] (P5) Enriquecer 2 dicas mensais (MONTHLY_TIPS) que estejam vagas — ficheiros: src/data/calendar.ts — validação: build.
- [ ] (P5) Adicionar 1 receita de microgreens (uso em prato) — ficheiros: src/data/recipes.ts — validação: data-integrity.

## Regras de Negócio
- [ ] (P2) E2E: diagnóstico por sintomas abre e mostra "o que fazer" — ficheiros: tests/e2e/diagnosis-glossary.spec.ts (novo) — validação: playwright.
- [ ] (P2) E2E: glossário filtra termos pela pesquisa — ficheiros: tests/e2e/diagnosis-glossary.spec.ts — validação: playwright.
- [ ] (P3) Teste: `data-integrity` garante que toda a receita tem `steps`/`ingredients` não vazios — ficheiros: tests/data-integrity.test.ts — validação: vitest.
- [ ] (P3) Teste: `data-integrity` garante grupos de saúde com `whyGood`/`nutrients` não vazios — ficheiros: tests/data-integrity.test.ts — validação: vitest.
- [ ] (P3) Teste: cada planta do catálogo pertence a um `nutrientGroup` que a lista (consistência inversa) — ficheiros: tests/data-integrity.test.ts — validação: vitest.
- [ ] (P3) Teste: `estimateStage` nunca devolve `index` fora de [0, total-1] — ficheiros: tests/growth.test.ts — validação: vitest.
- [ ] (P3) Teste: `challengeDayState` no dia 7 com tudo feito → done — ficheiros: tests/challenge.test.ts — validação: vitest.
- [ ] (P4) Teste: `FAQ` e `GLOSSARY` têm emoji em todas as entradas — ficheiros: tests/data-integrity.test.ts — validação: vitest.
- [ ] (P4) Teste: lições com passos `choice`/`truefalse` têm `correctIndex` dentro do nº de opções — ficheiros: tests/data-integrity.test.ts — validação: vitest.
- [ ] (P4) Teste: nenhuma planta lista a si própria como companheira/antagonista — ficheiros: tests/data-integrity.test.ts — validação: vitest.

## Performance
- [ ] (P4) Confirmar que o ecrã de diagnóstico não importa `compressImage` no arranque (lazy) — ficheiros: features/diagnosis — validação: revisão.
- [ ] (P4) Verificar que o catálogo filtra sem recriar funções por item (estável) — ficheiros: features/catalog — validação: revisão.
- [ ] (P4) Confirmar que o `glossary` chunk não cresce desproporcionalmente — ficheiros: build — validação: revisão.
- [ ] (P4) Verificar gzip do chunk de entrada após novas plantas (< ~120 KB) — ficheiros: build — validação: revisão.
- [ ] (P5) Avaliar se `troubleshoot`/`faq` deviam partilhar chunk com a view — ficheiros: build — validação: revisão.
- [ ] (P4) Confirmar que o número de live queries Dexie é mínimo (partilha) — ficheiros: composables/features — validação: revisão.
- [ ] (P4) Verificar que imagens do utilizador são comprimidas antes de gravar — ficheiros: utils/image, features — validação: revisão.
- [ ] (P5) Confirmar que não há watchers `deep` desnecessários em listas grandes — ficheiros: features — validação: revisão.
- [ ] (P4) Verificar que o vendor chunk continua estável (~294 KB) — ficheiros: build — validação: revisão.
- [ ] (P4) Confirmar que o build não emite avisos de chunk acima do limite — ficheiros: build — validação: revisão.

## Organização
- [ ] (P3) Atualizar CLAUDE.md com contagens (59 plantas, 27 receitas, 14 microgreens, 65 glossário, 24 FAQ) — ficheiros: CLAUDE.md — validação: coerente.
- [ ] (P3) CHANGELOG: entrada para o Ciclo 11 — ficheiros: CHANGELOG.md — validação: presente.
- [ ] (P4) README: contagem do catálogo (59 culturas) e nº de testes — ficheiros: README.md — validação: coerente.
- [ ] (P4) docs/ARQUITETURA: nota sobre cobertura E2E (ecrãs cobertos) — ficheiros: docs/ARQUITETURA.md — validação: coerente.
- [ ] (P4) Confirmar que `src/features` não importam diretamente de `src/lib/db` (passam por repositórios) — ficheiros: src/features — validação: revisão.
- [ ] (P5) Adicionar JSDoc curto às funções públicas de `streak.ts`/`challenge.ts` sem doc — ficheiros: src/utils — validação: typecheck.
- [ ] (P4) Verificar que não há `TODO`/`FIXME` por resolver no código — ficheiros: src — validação: grep.
- [ ] (P5) Confirmar que todos os componentes `ui/` têm props tipadas (sem implicit any) — ficheiros: src/components/ui — validação: typecheck.
- [ ] (P4) Verificar que os ficheiros de dados não excedem um tamanho razoável (split se preciso) — ficheiros: src/data — validação: revisão.
- [ ] (P5) Confirmar consistência de fim-de-linha/sem espaços finais (lint/format) — ficheiros: src — validação: format check.

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
