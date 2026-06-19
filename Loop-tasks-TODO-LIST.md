# Loop Tasks — TODO List
Ciclo: 4 · Atualizado: 2026-06-19 08:17

Estados: `[ ]` pendente · `[x]` concluída (+nota/commit) · `[!]` bloqueada (+motivo).
Stack: Vue 3 + TS + Vite (PWA), Pinia, Vue Router, Vue I18n, Dexie, Tailwind v4. Testes: Vitest (+@vue/test-utils, coverage v8) + Playwright. Lint: ESLint. Format: Prettier. npm. Ver CLAUDE.md / docs/ARQUITETURA.md. 42 plantas, 104 testes.

## Conteúdo
- [x] (P3) Adicionar 2-3 culturas (couve-de-bruxelas, alface-de-cordeiro/canónigos, cebolinho-chinês) com schema + calendário — ficheiros: src/data/plants.ts, calendar.ts — validação: data-integrity; PLANTS.length aumenta. ✓ Feito: +3 (couve-de-bruxelas, canónigos, cebolinho-chinês) + calendário → 45 plantas. data-integrity + 111 testes.
- [x] (P4) Adicionar FAQ/dúvidas frequentes de principiante (rega, luz, vasos) — ficheiros: src/data/ (+vista) ou troubleshoot — validação: build; conteúdo acessível. ✓ Feito: src/data/faq.ts (6 dúvidas: rega, luz, vasos, começar, adubo, pragas) mostradas na GlossaryView quando não há pesquisa.
- [x] (P4) Curso: 2.ª lição de rega/clima (capilaridade, drenagem) — ficheiros: src/data/course.ts — validação: data-integrity. ✓ Feito: lição l5-4 'Rega por capilaridade e drenagem' (u5). data-integrity verde.
- [x] (P4) Glossário: +termos ("rotação de culturas", "adubo verde", "pH") — ficheiros: src/data/glossary.ts — validação: build. ✓ Feito: +3 termos (rotação de culturas, adubo verde, pH).
- [x] (P4) Receitas: ligar receitas existentes a mais plantas (cenoura, beterraba) — ficheiros: src/data/recipes.ts — validação: data-integrity. ✓ Feito: cenoura no creme-abóbora; beterraba na sopa-da-horta (ingredientes + plants). cenoura/beterraba passam a ter receitas no detalhe. 115 testes.
- [x] (P5) Saúde: `caution` em frutos/raízes onde aplicável (ex.: batata verde) — ficheiros: src/data/health.ts — validação: build. ✓ Feito: caution no grupo frutos/raízes (solanina — batata verde/partes verdes).
- [ ] (P5) Microgreens: mostrar demolha (soakHours) por variedade na vista — ficheiros: features/microgreens — validação: build.
- [ ] (P5) Calendário: nota de geada por zona (lastFrost/firstFrost) na vista — ficheiros: features/calendar — validação: build.
- [x] (P5) Troubleshoot: +sintoma "plântulas tombam (damping-off)" — ficheiros: src/data/troubleshoot.ts — validação: build; SYMPTOMS aumenta. ✓ Feito: sintoma damping-off (excesso de água/fungos; related: mildio).
- [ ] (P5) Recomendações: priorizar culturas semeáveis este mês — ficheiros: src/utils/recommend.ts — validação: teste.

## Regras de Negócio
- [x] (P3) Testar `weatherTypeInfo` (useWeather) como função pura — ficheiros: tests/ — validação: novo teste verde. ✓ Feito: tests/composables.test.ts (tipo conhecido + fallback).
- [x] (P3) Testar `useOnlineStatus` (estado inicial + eventos) — ficheiros: tests/ — validação: novo teste verde. ✓ Feito: mount + simulação de evento offline (navigator.onLine mockado). 107 testes.
- [x] (P4) Testar `useReminders` devolve a mesma instância (singleton) — ficheiros: tests/ — validação: teste de identidade. ✓ Feito: teste confirma useReminders()===useReminders().
- [x] (P4) Reminder: snooze (adiar X dias) — ficheiros: src/repositories/index.ts — validação: teste de nova dueAt. ✓ Feito: remindersRepo.snooze(id, days) → dueAt=hoje+N, done=false; teste verde.
- [x] (P4) `journalRepo.add` valida que plantingId existe — ficheiros: src/repositories/index.ts — validação: teste. ✓ Feito: add() lança se a planta não existir; teste rejects.toThrow.
- [x] (P4) `compressImage`: documentar/bound de bytes máx — ficheiros: src/utils/image.ts — validação: revisão. ✓ Feito: JSDoc documenta o teto prático (~80-250KB a 1280px/q0.72, devolve o menor) e como apertar.
- [x] (P5) Teste de componente: ProgressBar (clamping 0-100) — ficheiros: tests/ — validação: mount passa. ✓ Feito: testa largura 50% e clamping 0/100.
- [x] (P5) Teste de componente: Badge/StatChip render — ficheiros: tests/ — validação: mount passa. ✓ Feito: Badge monta slot + ícone.
- [x] (P5) `recommendPlants` determinístico (ordenação estável) — ficheiros: tests/recommend.test.ts — validação: teste. ✓ Feito: desempate explícito por slug + teste de determinismo. 116 testes.
- [x] (P5) Marcar planta perdida cria evento de diário (à semelhança de colhida) — ficheiros: src/repositories/index.ts — validação: teste. ✓ Feito: status 'perdida' regista nota no diário; teste verde. 111 testes.

## Performance
- [x] (P4) E2E: fluxo de pesquisa do catálogo (Playwright) — ficheiros: tests/e2e/ — validação: spec passa. ✓ Feito: spec 'catálogo: a pesquisa filtra as plantas' (verde). BÓNUS: corrigido o base path do e2e (BASE_PATH=/) que tinha o preview/e2e a falhar — o spec pré-existente voltou a passar.
- [x] (P4) E2E: adicionar planta à horta e ver lembrete — ficheiros: tests/e2e/ — validação: spec passa. ✓ Feito: spec 'horta: adicionar uma planta e vê-la na horta' (onboarding→catálogo→adicionar→horta). 3 specs e2e verdes.
- [ ] (P5) Atributos `width`/`height` explícitos nas imagens de tamanho fixo — ficheiros: features/* — validação: build.
- [ ] (P5) `content-visibility: auto` em secções longas (catálogo) — ficheiros: features/catalog — validação: build.
- [ ] (P5) Pré-carregar rota do catálogo a partir do Home — ficheiros: features/home — validação: build.
- [ ] (P5) Confirmar manualChunks coerente com deps atuais — ficheiros: vite.config.ts — validação: build.
- [ ] (P5) Evitar watchers profundos desnecessários (stores) — ficheiros: stores — validação: revisão.
- [ ] (P5) Medir e registar tamanho do bundle no README — ficheiros: README.md — validação: números coerentes.
- [ ] (P5) Confirmar tree-shaking do vue-i18n (só o necessário) — ficheiros: i18n — validação: build.
- [ ] (P5) Revisão de transições/`will-change` só onde necessário — ficheiros: components/ui — validação: revisão.

## Organização
- [x] (P3) A11y: `aria-label` em botões só-ícone (recomeçar, fechar, etc.) — ficheiros: components/features — validação: revisão; sem botões sem nome acessível. ✓ Feito: ✕ de fechar e células da grelha do planeador ganharam aria-label (as restantes — sair, meses, concluir — já tinham).
- [x] (P4) Teste de componente: AppCard e ProgressBar — ficheiros: tests/ — validação: mount passa. ✓ Feito: AppCard renderiza slot; ProgressBar com clamping. 115 testes.
- [x] (P4) Adicionar `SECURITY.md` (como reportar problemas) — ficheiros: raiz — validação: ficheiro existe. ✓ Feito: SECURITY.md (reporte via GitHub Security Advisories; âmbito local-first/Supabase).
- [x] (P4) CI: passo de cobertura (não bloqueia PR) — ficheiros: .github/workflows/ci.yml — validação: workflow válido. ✓ Feito: passo `npm run test:coverage` com continue-on-error: true no job quality. YAML válido.
- [x] (P5) Dependabot (config de atualizações) — ficheiros: .github/dependabot.yml — validação: ficheiro válido. ✓ Feito: dependabot.yml (npm + github-actions, semanal, devDeps agrupadas).
- [x] (P5) Meta tags básicas (description/robots) no index.html — ficheiros: index.html — validação: build; tags presentes. ✓ Feito: +robots, apple-mobile-web-app-* e Open Graph (description já existia). Presentes no dist.
- [ ] (P5) A11y: foco visível consistente (focus-visible) — ficheiros: components/ui — validação: revisão.
- [ ] (P5) Consolidar tipos de UI repetidos (tone/variant) — ficheiros: components/ui — validação: typecheck.
- [ ] (P5) Contraste das badges (revisão WCAG AA) — ficheiros: components/ui — validação: revisão.
- [x] (P5) Atualizar CLAUDE.md com nº de plantas/testes atuais — ficheiros: CLAUDE.md — validação: coerente. ✓ Feito: linha de escala (45 plantas, 115 testes, lint 0).

## Arquivo (ciclos concluídos)

### Ciclo 3 — 2026-06-19 — 39 concluídas, 1 bloqueada
Catálogo 39→42 (couve-chinesa/aipo/malagueta); receita sopa-da-horta + 2 microgreens; glossário +7; saúde caution; segurança microgreens; curso l3-3; backup COMPLETO + reset (corrigiu export que perdia a horta); ui store testado + cap 3 toasts; settings testado; infra de testes de componente (@vitejs/plugin-vue) + BaseButton/PlantCard; ToastKind; CONTRIBUTING + LICENSE MIT; completeAllForPlanting; setCell valida grelha; tsconfig estrito (apanhou 2 bugs); cache calendarFor; v-memo; templates .github; decisão i18n; keywords; troubleshoot related; README estrutura de dados. Testes 89→104. Bloqueada: defineAsyncComponent.

### Ciclo 2 — 2026-06-19 — 38 concluídas, 2 bloqueadas
Catálogo 36→39; receitas, pragas, curso u6, saúde, conquistas, lembrete adubação, debounce, useReminders, lazy share, cache sowable, achievementToast, thresholds, docs/ARQUITETURA, prettier/.nvmrc/engines, JSDoc, vendor chunk. Testes 64→89. Bug: arrays partilhados (progress). Bloqueadas: virtualização, ícones PWA.

### Ciclo 1 — 2026-06-18/19 — 38 concluídas, 2 bloqueadas
Catálogo 20→36; ESLint trash (14834→0); CLAUDE.md; desbloqueio do desafio; +conteúdo; .ics DTSTAMP; testes utils; zoneCode; cobertura; vendor; sucessão; compressImage; prefetch. Testes 28→64. Bloqueadas: virtualização, runtimeCaching imagens.
