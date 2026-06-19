# Loop Tasks — TODO List
Ciclo: 3 · Atualizado: 2026-06-19 03:46

Estados: `[ ]` pendente · `[x]` concluída (+nota/commit) · `[!]` bloqueada (+motivo).
Stack: Vue 3 + TS + Vite (PWA), Pinia, Vue Router, Vue I18n, Dexie, Tailwind v4. Testes: Vitest (+@vue/test-utils, @vitest/coverage-v8) + Playwright. Lint: ESLint. Format: Prettier. npm. Ver CLAUDE.md / docs/ARQUITETURA.md. 39 plantas, 89 testes.

## Conteúdo
- [x] (P3) Adicionar 2-3 culturas ao catálogo (couve-chinesa/pak-choi, aipo, malagueta) com schema completo + calendário — ficheiros: src/data/plants.ts, calendar.ts — validação: data-integrity; PLANTS.length aumenta. ✓ Feito: +3 (couve-chinesa, aipo, malagueta com toxicNote) + calendário → 42 plantas. data-integrity + 97 testes.
- [x] (P3) Adicionar receita que combina várias colheitas (ex.: "sopa da horta") — ficheiros: src/data/recipes.ts — validação: data-integrity; plants[] válidos. ✓ Feito: receita 'sopa-da-horta' ligada a 7 culturas (cebola, alho-francês, batata, cenoura, couve, acelga, feijão-verde). data-integrity verde.
- [x] (P4) Glossário: +termos (rega por capilaridade, sacha, amontoa, tutoragem) — ficheiros: src/data/glossary.ts — validação: build; termos presentes. ✓ Feito: +4 termos (rega por capilaridade, sachar, amontoa, tutoragem).
- [x] (P4) Saúde: adicionar `caution` onde aplicável (oxalatos em espinafre/acelga; nitratos em folhas) — ficheiros: src/data/health.ts — validação: build; campo caution presente. ✓ Feito: caution nas folhas verdes (oxalatos/nitratos); HealthDetailView já o mostra.
- [x] (P4) Microgreens: nota de segurança (evitar microgreens de solanáceas/feijão — tóxicos) — ficheiros: src/data/microgreens.ts ou troubleshoot — validação: build; texto presente. ✓ Feito: aviso de segurança no ChallengeView (só variedades comestíveis; evitar solanáceas/feijão).
- [x] (P4) Curso: lição/quiz de revisão de planeamento da horta — ficheiros: src/data/course.ts — validação: data-integrity "curso coerente". ✓ Feito: lição l3-3 "Planear a horta" (conceitos + choice + order). data-integrity verde.
- [x] (P5) Pragas: detalhar tratamento biológico (auxiliares: joaninhas, crisopas) — ficheiros: src/data/pestsDiseases.ts — validação: build. ✓ Feito: tratamento do afídeo inclui controlo biológico (joaninhas/crisopas, flores que as atraem, evitar largo espetro).
- [ ] (P5) Troubleshoot: referência cruzada de sintomas para pragas/doenças por slug — ficheiros: src/data/troubleshoot.ts (+tipo) — validação: build; refs válidas.
- [ ] (P5) Recomendações: mensagem amigável quando nada é semeável no mês — ficheiros: src/features/home ou recommend — validação: build; estado tratado.
- [x] (P5) Adicionar 1-2 receitas de microgreens (sandes, batido) ligadas ao desafio — ficheiros: src/data/recipes.ts — validação: data-integrity. ✓ Feito: +2 receitas (sandes e batido verde de microgreens). data-integrity verde.

## Regras de Negócio
- [x] (P3) Testar o `ui` store (toast adiciona, dismiss remove, ids únicos) — ficheiros: tests/ui.test.ts — validação: novo teste verde. ✓ Feito: tests/ui.test.ts (adicionar, kind default, ids únicos, dismiss). 92 testes.
- [x] (P3) Limitar nº de toasts visíveis em simultâneo (ex.: máx. 3) + teste — ficheiros: src/stores/ui.ts, tests/ — validação: teste de limite. ✓ Feito: cap MAX_TOASTS=3 (descarta os mais antigos); teste confirma que ficam os 3 mais recentes.
- [x] (P3) Testar `settings` store: load aplica defaults e applyTheme não rebenta — ficheiros: tests/settings.test.ts — validação: teste verde. ✓ Feito: teste de load() (defaults, loaded=true) e applyTheme() (não lança). 98 testes.
- [x] (P4) Teste de componente BaseButton (disabled bloqueia click; emite click) — ficheiros: tests/ — validação: @vue/test-utils mount passa. ✓ Feito: tests/components.test.ts cobre slot, atributo disabled, reencaminhamento de click e classe da variante.
- [x] (P4) Teste de componente PlantCard (renderiza nome/emoji/badges) — ficheiros: tests/ — validação: mount passa. ✓ Feito: tests/components.test.ts monta PlantCard (RouterLink stubbed) e verifica nome + emoji.
- [x] (P4) Exportar dados do utilizador para JSON (backup local) — ficheiros: src/repositories ou utils, features/profile — validação: gera ficheiro com plantings/journal. ✓ Feito: utils/backup.ts exportData() (inclui plantings/journal/reminders/beds/meta) + tests; ProfileView passa a usar o backup COMPLETO (a export inline antiga perdia a horta).
- [x] (P4) Apagar todos os dados (reset) com confirmação — ficheiros: features/profile, lib/db — validação: limpa tabelas; teste de repo. ✓ Feito: clearAllData() (transação, todas as tabelas) + teste; botão 'Apagar todos os dados' na ProfileView com confirm.
- [ ] (P5) Marcar todos os lembretes de uma planta como feitos — ficheiros: src/repositories/index.ts — validação: teste.
- [x] (P5) `estimateStage` em planta sem durações nas fases (edge) — ficheiros: tests/growth.test.ts — validação: não rebenta; devolve fase válida. ✓ Feito: teste com fases sem durationDays — devolve índice/label válidos sem rebentar.
- [ ] (P5) Validar `setCell` do planeador ignora chaves fora da grelha — ficheiros: src/repositories/index.ts — validação: teste.

## Performance
- [x] (P4) `loading="lazy"` nas restantes imagens (DiagnosisView preview, timeline microgreens) — ficheiros: features/diagnosis, microgreens — validação: build; atributo presente. ✓ Feito: loading="lazy" na preview da DiagnosisView (microgreens não tem <img> de timeline). Build OK.
- [x] (P4) `v-memo` na lista de resultados do catálogo — ficheiros: src/features/catalog/CatalogView.vue — validação: build; lista não re-renderiza sem mudança. ✓ Feito: v-memo=[slug, sowable] nos PlantCard — saltam re-render quando nada muda. Build OK.
- [x] (P4) Memoizar `recommendPlants` num computed no Home (evitar recalcular por render) — ficheiros: src/features/home/HomeView.vue — validação: revisão. ✓ Verificado: já está num computed (recomputa só quando plantings/settings mudam). Nada a alterar.
- [ ] (P5) `width`/`height` (ou aspect-ratio) nas imagens para evitar layout shift — ficheiros: features/* — validação: build; sem CLS visível.
- [ ] (P5) Workbox: excluir sourcemaps/manifest do precache desnecessário — ficheiros: vite.config.ts — validação: build; precache não inclui .map.
- [ ] (P5) Evitar `new Date()` repetido em loops/format — usar valor único — ficheiros: utils/features — validação: revisão.
- [ ] (P5) `defineAsyncComponent` para vistas/modais pesados pontuais — ficheiros: features — validação: build; chunk separado.
- [ ] (P5) Confirmar que o catálogo não recalcula `searchBlob` (já fora do computed) — ficheiros: catalog — validação: revisão.
- [ ] (P5) Analisar deps não usadas (depcheck manual) e remover — ficheiros: package.json — validação: build após remoção.
- [x] (P5) Cache do `calendarFor` por zona+mês (à semelhança de plantSowable) — ficheiros: src/data/calendar.ts — validação: testes calendar verdes. ✓ Feito: cache por chave zona-mês (computeCalendarFor interno); resultado read-only nos callers. Testes calendar verdes.

## Organização
- [x] (P3) Infra de testes de componente (@vue/test-utils + jsdom já presentes) — primeiro teste a passar — ficheiros: tests/ — validação: mount de um componente passa. ✓ Feito: adicionado @vitejs/plugin-vue ao vitest.config (com cast para o conflito de tipos vite/vitest); mount() de componentes a funcionar. 97 testes.
- [x] (P4) Criar CONTRIBUTING.md (como correr, testar, convenções de commit) — ficheiros: raiz — validação: ficheiro existe e é coerente. ✓ Feito: CONTRIBUTING.md com arranque, checklist de PR, convenções e links.
- [x] (P4) Adicionar LICENSE (decidir licença; por defeito propor MIT) — ficheiros: raiz — validação: ficheiro existe. ✓ Feito: LICENSE MIT (2026 GrowGreens) — o dono pode trocar se preferir outra.
- [x] (P4) Tipar `Toast['kind']` e exportar o tipo do ui store — ficheiros: src/stores/ui.ts — validação: typecheck. ✓ Feito: tipo `ToastKind` exportado e usado em Toast/toast(). TC OK.
- [x] (P4) Templates de issue/PR em .github/ — ficheiros: .github/ — validação: ficheiros válidos. ✓ Feito: ISSUE_TEMPLATE (bug, feature) + pull_request_template.md com checklist de qualidade.
- [ ] (P5) Rever flags `strict` do tsconfig (noUnusedLocals, noImplicitReturns) — ficheiros: tsconfig*.json — validação: typecheck continua verde.
- [x] (P5) Garantir `.gitignore` cobre coverage/ e dist/ (confirmar) — ficheiros: .gitignore — validação: git status limpo após build/coverage. ✓ Verificado: .gitignore inclui dist e coverage; git status limpo após build/coverage.
- [ ] (P5) Documentar no README a estrutura de dados (link models/catalog) — ficheiros: README.md — validação: secção presente.
- [ ] (P5) Verificar/atualizar `description` e `keywords` no package.json — ficheiros: package.json — validação: campos coerentes.
- [ ] (P5) Adicionar verificação de i18n: confirmar se vue-i18n é usado ou remover da stack — ficheiros: src, package.json — validação: decisão documentada; build verde.

## Arquivo (ciclos concluídos)

### Ciclo 2 — 2026-06-19 — 38 concluídas, 2 bloqueadas
Principais: catálogo 36→39 (louro/funcho/melão); +receitas (couve-flor/beringela/ervilha/alho-francês, +pepino/abóbora/fava do c1); +pragas (cochonilha/ácaro/tripes); curso "Colher e conservar" (u6); saúde das aromáticas + novas culturas nos grupos; conquista Colecionador + Mão Verde; lembrete de adubação (frutos); marcar colhida→fecha lembretes+diário; debounce na pesquisa; useReminders() partilhado; lazy do canvas de partilha; cache de plantSowableThisMonth; helper achievementToast; thresholds de cobertura; docs/ARQUITETURA.md + badge CI; prettier + .nvmrc + engines; JSDoc em date.ts; loading=lazy diário; chunk vendor; variedades PT. Testes 64→89. Bug corrigido: arrays partilhados no progress store (DEFAULT→factory). Bloqueadas: virtualização do catálogo (desnecessária) e ícones PWA (sem tooling). Detalhe no git.

### Ciclo 1 — 2026-06-18/19 — 38 concluídas, 2 bloqueadas
Backlog inicial. Catálogo 20→36; ESLint ignora .nm_trash_5 (14834→0); CLAUDE.md; .editorconfig/.prettierrc; lint:fix; desbloqueio do desafio (avanço por conclusão); +microgreens/glossário/receitas/curso/sintomas; DTSTAMP no .ics; extração+testes (watering/streak/challenge/companions); validação zoneCode; cobertura v8; chunk vendor (index 313→25KB); sucessão de sementeira; compressImage 1280; prefetch /desafio; invariantes de dados (toxicNote, binomial). Testes 28→64. Bloqueadas: virtualização e runtimeCaching de imagens.
