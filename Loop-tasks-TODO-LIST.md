# Loop Tasks — TODO List
Ciclo: 1 · Atualizado: 2026-06-18 19:44

Estados: `[ ]` pendente · `[x]` concluída (+ nota/commit) · `[!]` bloqueada (+ motivo).
Stack detetado: Vue 3 + TypeScript + Vite (PWA), Pinia, Vue Router, Vue I18n, Dexie (IndexedDB), Tailwind v4. Testes: Vitest + Playwright. Lint: ESLint flat config. Gestor: npm. Scripts: dev, build, preview, typecheck, lint, test, test:e2e.

## Conteúdo
- [x] (P2) Adicionar lição de curso sobre rega e clima atlântico húmido (míldio/oídio) — ficheiros: src/data/course.ts — validação: `npm run test` (data-integrity "curso coerente") passa e LESSONS.length aumenta. ✓ Feito: lição l5-3 "Regar na medida certa" (teste do dedo, drenagem, excesso de água) na unidade u5. 32 testes verdes.
- [x] (P3) Adicionar 2-3 variedades de microgreens ao desafio (girassol, ervilha, couve-roxa) — ficheiros: src/data/microgreens.ts — validação: `npm run test` passa; MICROGREENS.length ≥ 7. ✓ Feito: girassol/ervilha já existiam; adicionadas beterraba, couve-roxa e coentros → 9 variedades. Tests verdes.
- [x] (P3) Adicionar receitas para as novas culturas (ex.: salada de pepino, creme de abóbora, favada) — ficheiros: src/data/recipes.ts — validação: data-integrity ("receitas referem plantas existentes") passa; RECIPES.length aumenta; atualizar campo `recipes` das plantas-alvo. ✓ Feito: +3 receitas (salada-pepino, creme-abobora, favada) → 9. Ligação automática via recipesForPlant (UI usa-o), sem editar plants.ts. 42 testes verdes.
- [x] (P3) Expandir glossário (apenas ~29 linhas) com termos usados na app: "espigar", "desbastar", "blackout", "corta-e-volta", "consociação" — ficheiros: src/data/glossary.ts — validação: build OK e cada termo presente em GLOSSARY. ✓ Feito: +8 termos (espigar, blackout, corta-e-volta, branquear, vivaz, pinçar, demolha, sucessão); 28 termos no total. (desbastar/consociação já existiam.)
- [ ] (P3) Adicionar entradas de troubleshooting por sintomas para frutos de verão (oídio em pepino/abóbora, flores que caem) — ficheiros: src/data/troubleshoot.ts — validação: build OK; ecrã Diagnóstico mostra novos sintomas.
- [ ] (P4) Rever consistência de `family`/`scientificName` em todas as plantas (acentos, nomenclatura binomial) — ficheiros: src/data/plants.ts — validação: script ad-hoc confirma todas as famílias num conjunto conhecido.
- [ ] (P3) Acrescentar dica sazonal por mês no calendário (texto curto) para meses sem destaque — ficheiros: src/data/calendar.ts, src/features/calendar — validação: build OK; cada mês tem dica.
- [ ] (P4) Adicionar conquistas (achievements) ligadas ao catálogo (ex.: "10 plantas diferentes na horta") — ficheiros: src/data/achievements.ts, src/stores/progress.ts — validação: build OK; conquista desbloqueável.
- [ ] (P4) Rever notas de toxicidade/petSafe em todas as plantas para coerência (Allium, Solanaceae) — ficheiros: src/data/plants.ts — validação: script confirma toxicNote presente onde petSafe=false.
- [ ] (P5) Adicionar prevenção específica de litoral atlântico (humidade) a cada doença fúngica — ficheiros: src/data/pestsDiseases.ts — validação: build OK; campo prevention menciona arejamento/rega de manhã.

## Regras de Negócio
- [x] (P2) Definir `wateringEveryDays` por defeito a partir de `waterNeed` da planta ao criar uma planta na horta — ficheiros: src/features/garden, src/repositories/index.ts — validação: teste unitário de mapeamento waterNeed→dias. ✓ Feito: extraído `defaultWateringDays()` em utils/growth.ts (DRY — eliminada duplicação em HomeView, BedView e PlantDetailView); teste tests/watering.test.ts (3 casos). 35 testes verdes.
- [x] (P2) Validar `zoneCode` no onboarding contra CLIMATE_ZONES antes de gravar — ficheiros: src/features/onboarding/OnboardingView.vue, src/stores/settings.ts — validação: teste/typecheck; zona inválida cai no default. ✓ Feito: `sanitizeZone()` no store (load + completeOnboarding); tests/settings.test.ts (4 casos) + polyfill matchMedia em setup.ts. 32 testes verdes.
- [ ] (P3) Impedir conclusão de dias do desafio fora de ordem (saltar dias trancados) — ficheiros: src/features/microgreens/ChallengeView.vue — validação: teste de `dayState`/markDone; dia trancado não completa.
- [x] (P2) Cobrir com testes a lógica de streak/freeze do progresso (perda, proteção, refill) — ficheiros: src/stores/progress.ts, tests/ — validação: novo teste passa em `npm run test`. ✓ Feito: tests/streak.test.ts (7 casos) cobre applyActivity — mesmo dia, consecutivo, freeze consumido, reset com/sem freeze, falha longa, refill. 42 testes verdes.
- [ ] (P3) Reagendar corretamente lembretes recorrentes a partir da data de conclusão, não de hoje — ficheiros: src/repositories/index.ts (remindersRepo.complete) — validação: teste de recorrência.
- [ ] (P3) Exportação .ics de lembretes com fuso/àncora corretos — ficheiros: src/features/profile, utils — validação: ficheiro .ics válido (VEVENT) num teste.
- [ ] (P3) Garantir que apagar uma planta remove lembretes e diário em transação (já existe — adicionar teste) — ficheiros: tests/repositories.test.ts — validação: teste cobre cascata.
- [ ] (P4) Marcar planta como "perdida"/"colhida" atualiza estado e remove lembretes pendentes — ficheiros: src/repositories/index.ts, src/features/garden — validação: teste de transição de estado.
- [ ] (P4) Avisos de boa/má vizinhança no planeador usam companions/antagonists corretamente — ficheiros: src/features/planner/BedView.vue — validação: teste de função de vizinhança.
- [ ] (P5) Sucessão de sementeira: sugerir próxima data para culturas de corte (alface, rúcula) — ficheiros: src/features/calendar ou recommendations — validação: build OK; sugestão aparece.

## Performance
- [ ] (P3) Garantir lazy-loading dos chunks de dados grandes (course.ts, health.ts) à semelhança de plants — ficheiros: src/features/*, imports — validação: `npm run build` mostra course/health em chunks separados.
- [ ] (P3) Reduzir o chunk index (304KB) movendo dados estáticos para imports dinâmicos onde aplicável — ficheiros: src/router, features — validação: build; index < 300KB gzip menor.
- [ ] (P4) Rever qualidade/limite de `compressImage` para fotos do diário (memória IndexedDB) — ficheiros: src/utils/image.ts — validação: blob resultante < 300KB num teste.
- [ ] (P4) Indexar consultas Dexie usadas (plantings por status, journal por plantingId) — ficheiros: src/lib/db/dexie.ts — validação: schema com índices; testes de repo passam.
- [ ] (P4) Virtualizar/paginação na lista do catálogo (36+ plantas) se houver jank — ficheiros: src/features/catalog/CatalogView.vue — validação: lista renderiza sem custo O(n) pesado; build OK.
- [ ] (P4) Memoizar pesquisa do catálogo (normalização de acentos) com computed/índice — ficheiros: src/features/catalog — validação: pesquisa não recalcula tudo a cada tecla (revisão de código).
- [ ] (P4) Pré-carregar (prefetch) a rota /desafio a partir do onboarding — ficheiros: router/onboarding — validação: build; chunk do desafio com modulepreload.
- [ ] (P5) Revisar runtimeCaching do PWA para o catálogo de imagens/ícones — ficheiros: vite.config.ts — validação: build; sw.js inclui regras.
- [ ] (P5) Evitar `db.challengeRuns.toArray()` repetido — cache via useLiveQuery único — ficheiros: src/features/microgreens/ChallengeView.vue — validação: revisão de código.
- [ ] (P5) Tree-shaking de date-fns (imports nomeados, não default) — ficheiros: src/utils/date.ts — validação: build; sem aumento do bundle.

## Organização
- [x] (P1) Adicionar `.nm_trash_5` (e quaisquer dirs de lixo) aos `ignores` do ESLint — ficheiros: eslint.config.js — validação: `npm run lint` deixa de reportar erros em `.nm_trash_5` (total de erros cai de >14000 para <100). ✓ Feito: lint passou de 14834 erros para 0 (restam 5 warnings de formatação em src). Commit nesta iteração.
- [x] (P2) Criar CLAUDE.md com stack, scripts, arquitetura e convenções — ficheiros: CLAUDE.md — validação: ficheiro existe e descreve build/test/lint. ✓ Feito: CLAUDE.md com stack, scripts, camadas, convenções de dados e deploy. Commit nesta iteração.
- [x] (P2) Adicionar script `lint:fix` ("eslint . --fix") ao package.json — ficheiros: package.json — validação: `npm run lint:fix` corre. ✓ Feito: script adicionado e a funcionar.
- [x] (P2) Corrigir os warnings reais de lint em ficheiros src/ (após ignorar trash) — ficheiros: src/features/**/*.vue — validação: `npm run lint` sem warnings em src/. ✓ Feito: `npm run lint:fix` corrigiu indentação em PlantDetailView, ReviewView, ChallengeView e BedView; lint 0 problemas.
- [ ] (P3) Adicionar teste para a lógica de desbloqueio de dias do desafio (unlockedDay) — ficheiros: tests/ — validação: `npm run test` com novo teste verde.
- [ ] (P3) Centralizar tipos de domínio repetidos e remover duplicação entre catalog.ts e models.ts — ficheiros: src/types/* — validação: typecheck OK; sem tipos duplicados.
- [ ] (P3) Adicionar `.editorconfig` e config Prettier alinhada com regras do ESLint — ficheiros: raiz — validação: formatação consistente; lint não conflitua.
- [ ] (P4) Adicionar workflow de PR preview/typecheck separado do deploy — ficheiros: .github/workflows — validação: workflow válido (`gh workflow view`).
- [ ] (P4) Documentar variáveis de ambiente e cloud opcional no README/.env.example coerentes — ficheiros: README.md, .env.example — validação: chaves coincidem.
- [ ] (P5) Adicionar cobertura de testes (vitest run --coverage) e badge/relatório — ficheiros: vitest.config.ts — validação: `npm run test -- --coverage` gera relatório.

## Arquivo (ciclos concluídos)
_(vazio — primeiro ciclo)_
