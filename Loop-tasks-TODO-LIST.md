# Loop Tasks — TODO List
Ciclo: 2 · Atualizado: 2026-06-19 01:46

Estados: `[ ]` pendente · `[x]` concluída (+nota/commit) · `[!]` bloqueada (+motivo).
Stack: Vue 3 + TS + Vite (PWA), Pinia, Vue Router, Vue I18n, Dexie, Tailwind v4. Testes: Vitest + Playwright. Lint: ESLint. npm. Ver CLAUDE.md.

## Conteúdo
- [x] (P3) Adicionar receitas para culturas sem receita ligada (couve-flor, beringela, ervilha, alho-francês) — ficheiros: src/data/recipes.ts — validação: data-integrity passa; recipesForPlant() devolve resultado para esses slugs. ✓ Feito: +4 receitas (couve-flor assada, beringela grelhada, ervilhas guisadas, alho-francês salteado). data-integrity + 76 testes verdes.
- [x] (P3) Adicionar unidade/lições de curso sobre colheita e conservação — ficheiros: src/data/course.ts — validação: data-integrity "curso coerente"; nº de lições aumenta. ✓ Feito: unidade u6 "Colher e conservar" com l6-1 (ponto de colheita) e l6-2 (conservação). data-integrity + 84 testes verdes.
- [x] (P3) Adicionar fichas de pragas em falta comuns no litoral (cochonilha, ácaro-aranha, tripes) — ficheiros: src/data/pestsDiseases.ts — validação: build; PESTS_BY_SLUG inclui novos; plantas podem referenciá-los. ✓ Feito: +3 fichas (cochonilha, acaro-aranha, tripes) com descrição/sintomas/prevenção/tratamento. Build + 84 testes.
- [ ] (P4) Adicionar 2-3 aromáticas/frutos ao catálogo (louro, funcho, melão) com schema completo — ficheiros: src/data/plants.ts, calendar.ts — validação: data-integrity; PLANTS.length aumenta.
- [x] (P4) Expandir glossário com termos em falta (vernalização, polinização cruzada, mulch/cobertura) — ficheiros: src/data/glossary.ts — validação: build; termos presentes. ✓ Feito: +3 termos (Mulch/cobertura, Polinização cruzada, Vernalização). Build OK.
- [ ] (P4) Adicionar conteúdo de saúde/nutrição para o grupo das aromáticas e novas culturas — ficheiros: src/data/health.ts — validação: data-integrity; NUTRIENT_GROUPS coerentes.
- [ ] (P4) Rever e preencher `companions`/`antagonists` vazios das plantas originais — ficheiros: src/data/plants.ts — validação: data-integrity (refs válidas); menos arrays vazios.
- [x] (P5) Adicionar mais sintomas ao diagnóstico (folhas com furos/lesmas vs lagartas; pontas castanhas por sal) — ficheiros: src/data/troubleshoot.ts — validação: build; SYMPTOMS aumenta. ✓ Feito: +sintoma 'pontas-castanhas' (excesso de sais/adubo, tip burn). (lesmas vs lagartas já no sintoma 'bichos'.) Build + 89 testes.
- [ ] (P5) Adicionar variedades recomendadas PT às fichas (ex.: alface 'Maravilha de Verão', couve 'Penca') no texto — ficheiros: src/data/plants.ts — validação: build; texto presente.
- [ ] (P5) Uniformizar `in30Seconds` (3 bullets) e tom de `commonMistake` nas plantas originais — ficheiros: src/data/plants.ts — validação: build; consistência por revisão.

## Regras de Negócio
- [x] (P3) Testar `estimateStage` (utils/growth) — fases por dias decorridos — ficheiros: tests/growth.test.ts — validação: novo teste verde. ✓ Feito: tests/growth.test.ts cobre estimateStage (germinação→colheita). 76 testes.
- [x] (P3) Testar `recommendPlants` (utils/recommend) — respeita espaço/zona/limite — ficheiros: tests/recommend.test.ts — validação: novo teste verde. ✓ Feito: tests/recommend.test.ts (limite, objetos válidos, só-interior sem exterior no topo).
- [x] (P3) Testar `plantSowableThisMonth` e `calendarForPlant` — ficheiros: tests/calendar.test.ts — validação: novo teste verde. ✓ Feito: tests/calendar.test.ts (filtro por planta, shift de zona, sementeira do mês).
- [x] (P3) Testar `wateringAdvice` (composables/useWeather) como função pura — ficheiros: tests/ — validação: novo teste verde. ✓ Feito: tests/weather.test.ts (chuva hoje/amanhã, calor, dia ameno, vazio).
- [x] (P4) Garantir que concluir a mesma lição não duplica XP nem o registo — ficheiros: src/features/course/LessonView.vue, stores/progress.ts — validação: teste de idempotência. ✓ Feito: completeLesson já guarda includes(); teste de idempotência em tests/progress.test.ts. BÓNUS: corrigido bug de arrays partilhados (DEFAULT → factory defaultProgress()) que o teste expôs. 88 testes.
- [x] (P4) Lembrete de adubação opcional ao criar planta (com base em feedingNotes/categoria) — ficheiros: src/repositories/index.ts — validação: teste cria lembrete 'aduba'. ✓ Feito: plantas de categoria 'fruto' (gulosas) ganham lembrete 'aduba' recorrente (~21 dias) ao criar; teste confirma fruto sim / folha não. 89 testes.
- [x] (P4) Validar `nickname` não vazio e `wateringEveryDays > 0` ao criar/editar planta — ficheiros: src/repositories/index.ts, features/garden — validação: teste de limites. ✓ Feito: create saneia nickname (fallback p/ slug) e clampa wateringEveryDays≥1; teste em repositories.test.ts.
- [x] (P4) Testar `challengeRepo.reset` limpa run e fotos — ficheiros: tests/repositories.test.ts — validação: após reset, current() não devolve o run. ✓ Feito: teste confirma que após reset, get() e current() devolvem undefined.
- [x] (P5) Conquista 'estudioso'/'constante' — confirmar trigger e cobrir com teste de progress store — ficheiros: tests/ — validação: teste de unlock por contagem/streak. ✓ Feito: triggers já ligados no LessonView (≥10 lições / streak≥7); tests/progress.test.ts cobre unlock (uma vez, código desconhecido) e a condição das 10 lições.
- [x] (P5) Marcar planta colhida cria entrada de diário 'colheita' automática — ficheiros: src/repositories/index.ts — validação: teste; diário tem evento de colheita. ✓ Feito: update regista um marco 'colheita' no diário (na mesma transação); teste verde.

## Performance
- [x] (P4) `loading="lazy"` em imagens de diário/linha do tempo de fotos — ficheiros: features/garden, microgreens — validação: build; atributo presente. ✓ Feito: loading="lazy" nas miniaturas e foto da timeline do diário (PlantingDetailView). Build OK.
- [x] (P4) Debounce ligeiro na pesquisa do catálogo (input) — ficheiros: src/features/catalog/CatalogView.vue — validação: revisão; filtro não corre a cada tecla imediatamente. ✓ Feito: debouncedQuery atualiza 150ms após parar de escrever; o computed de resultados passa a depender dele. TC/lint/build OK.
- [x] (P4) Confirmar que todas as rotas são lazy (import dinâmico) no router — ficheiros: src/router/index.ts — validação: build; cada view em chunk próprio. ✓ Verificado: as 19 rotas com componente usam `() => import(...)`; a 20.ª é um catch-all redirect sem componente. Sem imports estáticos de views. Nada a fazer.
- [ ] (P4) Partilhar a live query de `reminders` (evitar múltiplas subscrições idênticas) — ficheiros: features/garden, composables — validação: revisão de código.
- [ ] (P5) `v-once`/keys estáveis em listas estáticas (categorias, filtros) — ficheiros: features/* — validação: revisão; sem re-render desnecessário.
- [ ] (P5) Reduzir trabalho do `sowableSet` recomputado por mês (memo por zona+mês) — ficheiros: features/catalog/calendar — validação: revisão.
- [ ] (P5) Otimizar/pré-dimensionar ícones PWA (tamanho do precache) — ficheiros: public/icons — validação: build; precache não cresce.
- [x] (P5) Definir `chunkSizeWarningLimit` adequado e confirmar sem chunks gigantes — ficheiros: vite.config.ts — validação: build sem avisos de tamanho. ✓ Feito: chunkSizeWarningLimit 600 (vendor ~294KB); build sem avisos de tamanho.
- [ ] (P5) Lazy-load do `share`/`buildAchievementCard` (canvas) só quando usado — ficheiros: utils/share, microgreens — validação: build; share em chunk separado.
- [x] (P5) Evitar importar todo o date-fns/locale; confirmar import só do locale pt — ficheiros: utils/date.ts — validação: build; bundle não inclui locales extra. ✓ Verificado: date.ts importa só `{ pt } from 'date-fns/locale'` e funções nomeadas de date-fns — tree-shakeable, sem locales extra.

## Organização
- [x] (P3) Adicionar testes para `defaultWateringDays`/`areCompanions` já existem; cobrir `successionDays` — ficheiros: tests/ — validação: novo teste verde. ✓ Feito: successionDays coberto em tests/growth.test.ts (intervalo p/ culturas de corte; null caso contrário).
- [x] (P3) Definir thresholds de cobertura mínimos no vitest (ex.: utils 70%) — ficheiros: vitest.config.ts — validação: `npm run test:coverage` aplica thresholds. ✓ Feito: thresholds lines/statements/functions 55, branches 75 (abaixo do atual ~63/85 para travar regressões sem falhar). test:coverage exit 0. (70% partiria — utils está a 60%.)
- [x] (P4) Adicionar badge de CI e secção de testes/cobertura ao README — ficheiros: README.md — validação: README renderiza badge; comandos corretos. ✓ Feito: badge do workflow CI no topo + secção "Testes" (com test:coverage) + link para docs/ARQUITETURA.md.
- [x] (P4) Adicionar JSDoc curto às funções públicas dos utils (date, growth, challenge) — ficheiros: src/utils/* — validação: typecheck; doc presente. ✓ Feito: JSDoc em todas as funções de date.ts (growth/challenge/streak/ics já tinham). TC OK.
- [x] (P4) Adicionar `engines` (node) e `packageManager` ao package.json — ficheiros: package.json — validação: build; campos presentes. ✓ Feito: engines.node ">=20" + packageManager "npm@11.11.0". package.json válido, build OK.
- [x] (P4) Criar `docs/ARQUITETURA.md` curto (camadas, fluxo de dados) ligado no README — ficheiros: docs/ — validação: ficheiro existe e é referenciado. ✓ Feito: docs/ARQUITETURA.md (camadas UI→stores→repos→Dexie, dados estáticos, fluxo de exemplo) referenciado no README.
- [x] (P5) Adicionar `.nvmrc` com a versão de Node usada no CI (20) — ficheiros: raiz — validação: ficheiro existe. ✓ Feito: .nvmrc com "20" (alinhado com o CI).
- [ ] (P5) Normalizar mensagens de toast (um helper único de texto de conquista) — ficheiros: stores/ui, features — validação: revisão; sem strings duplicadas.
- [x] (P5) Adicionar script `format` (prettier --write) ao package.json — ficheiros: package.json — validação: `npm run format` corre (se prettier instalado) ou documentado. ✓ Feito: instalado prettier + scripts format/format:check + .prettierignore. prettier corre (date.ts já conforme ao .prettierrc).
- [x] (P5) Verificação de dados como teste: cada planta tem stages ordenadas e durações coerentes — ficheiros: tests/data-integrity.test.ts — validação: novo teste verde. ✓ Feito: teste garante durationDays com min ≤ max e ≥ 0 em todas as fases. 81 testes verdes.

## Arquivo (ciclos concluídos)

### Ciclo 1 — 2026-06-18/19 — 38 concluídas, 2 bloqueadas/sem objeto
Backlog inicial de 40 tarefas. Principais entregas: ESLint a ignorar .nm_trash_5 (14834→0 erros); CLAUDE.md; .editorconfig + .prettierrc; lint:fix; +16 plantas e +3 microgreens e +8 termos de glossário e +3 receitas; lição de curso de rega; sintomas de frutos de verão; DTSTAMP no .ics; extração+testes de watering/streak/challenge/companions; validação de zoneCode; cobertura de testes (v8); chunk vendor (index 313→25KB); conquista Colecionador + Mão Verde; sucessão de sementeira; compressImage 1280px; prefetch /desafio; concluir lembretes ao colher/perder planta; +invariantes de dados (toxicNote/petSafe, nome binomial). Subiu de 28→64 testes. Bloqueadas: virtualização do catálogo (desnecessária a 36 itens) e runtimeCaching de imagens (catálogo usa emojis). Detalhe completo no histórico git.
