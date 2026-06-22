# Changelog

Resumo da evolução do GrowGreens. O detalhe fino está no histórico git e em `Loop-tasks-TODO-LIST.md` (backlog por ciclos).

## Não lançado (em curso)

- **Ciclo 10** — `bedsRepo.update` passa a clampar dimensões da grelha (1-12), como o create; testes de integridade reforçados (textos de planta não vazios, summary nas lições, whatToDo nos sintomas, flavour/note nos microgreens); verificações de performance (recipes lazy, chunks isolados, vendor estável) e organização (slugs kebab, alias @/, sem órfãos); catálogo 57→59 (lentilha, ruibarbo); +2 receitas; +1 lição; +5 glossário; +3 FAQ; microgreen feno-grego; sintoma novo. Testes 169→174+.
- **Ciclo 9** — correção de fuga de memória (objectURL da pré-visualização de foto no diário); tipagem da resposta do IPMA (remove `any`); testes (tema, companions reais, `completeDay` idempotente, `blackoutDays` dos microgreens, sucessão, recommend sem duplicados); secção Componentes UI na ARQUITETURA; auditoria de `aria-label`; docs (CLAUDE.md, README). Testes 161→169.
- **Ciclo 8** — bateria de testes de regras de negócio (`normalize`, `recipesForPlant`, `defaultWateringDays`, `soilTipForMonth`, cache de `calendarFor`, bordas de `recommendPlants`/`estimateStage`); verificação de performance e organização (composables sem dependências de features, lint limpo, nomes PascalCase, estado do Vue I18n documentado); secção Composables na ARQUITETURA; docs (CLAUDE.md, README). Testes 146→161.
- **Ciclo 7** — `.gitignore` (test-results, .claude); testes de regras de negócio (shouldSuggestMicrogreens, pontuação interior do recommend, "perdida" fecha lembretes, `exportData` inclui canteiros, consistência calendário↔semeável); verificação do bloco de performance (rotas lazy, fontes do sistema, sem console.log, CLS controlado, debounce/v-memo já presentes); docs (CLAUDE.md contagens, secção Testes na ARQUITETURA). Testes 140→146.
- **Ciclo 6** — catálogo 48→51 (tomilho-limão, manjerona, cerefólio); microgreen erva-de-trigo; curso "Guardar sementes" (u7); pragas (cochonilha, ácaro-aranha, tripes, nemátodes) + prevenção de míldio/oídio; receitas (guisado, salteada, assada, sopa); troubleshoot (ponta-podre, pontas-castanhas); interface `StageEstimate`; metadados do package.json; badge MIT; Home sugere microgreens em interior sem nada semeável; teste reativo do `useReminders`; chips sem reflow. Testes 128→140.
- **Ciclo 5** — catálogo 45→48 (mizuna, beldroega, segurelha); glossário/FAQ/curso (rotação de culturas); receitas courgette/beterraba; saúde (caution leguminosas); pragas (nemátodes); troubleshoot (clorose, damping-off); E2E de calendário e curso (5 specs no total); skip-link de acessibilidade; `decoding=async`; prefetch de catálogo/curso; README de instalação PWA.
- **Ciclo 4** — catálogo 42→45 (couve-de-bruxelas, canónigos, cebolinho-chinês); E2E de catálogo e horta (corrigiu o base path que os tinha partido); `.ics` com DTSTAMP + escape RFC; SECURITY.md; dependabot; meta tags; `:focus-visible` global; testes de componente; cobertura no CI.
- **Ciclo 3** — catálogo 39→42; backup completo + reset (corrigiu export que perdia a horta); infra de testes de componente; tsconfig estrito (apanhou 2 bugs); cache de calendário; v-memo; CONTRIBUTING + LICENSE.
- **Ciclo 2** — catálogo 36→39; curso "Colher e conservar"; `useReminders` partilhado; lazy do canvas de partilha; thresholds de cobertura; docs/ARQUITETURA; chunk vendor; corrigiu arrays partilhados no progress store.
- **Ciclo 1** — catálogo 20→36; desbloqueio do desafio (avanço por conclusão); ESLint a ignorar lixo (14834→0 erros); CLAUDE.md; cobertura de testes; sucessão de sementeira.

## 0.1.0 — pré-lançamento

PWA local-first (Vue 3 + TS + Vite, Pinia, Dexie, Tailwind v4). Catálogo de plantas, desafio de microgreens (7 dias), horta, planeador, calendário (IPMA), curso, saúde, diagnóstico por sintomas. Online em https://joaoxyxo.github.io/GrowGreens/.
