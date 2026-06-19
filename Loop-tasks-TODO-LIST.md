# Loop Tasks — TODO List
Ciclo: 4 · Atualizado: 2026-06-19 08:17

Estados: `[ ]` pendente · `[x]` concluída (+nota/commit) · `[!]` bloqueada (+motivo).
Stack: Vue 3 + TS + Vite (PWA), Pinia, Vue Router, Vue I18n, Dexie, Tailwind v4. Testes: Vitest (+@vue/test-utils, coverage v8) + Playwright. Lint: ESLint. Format: Prettier. npm. Ver CLAUDE.md / docs/ARQUITETURA.md. 42 plantas, 104 testes.

## Conteúdo
- [ ] (P3) Adicionar 2-3 culturas (couve-de-bruxelas, alface-de-cordeiro/canónigos, cebolinho-chinês) com schema + calendário — ficheiros: src/data/plants.ts, calendar.ts — validação: data-integrity; PLANTS.length aumenta.
- [ ] (P4) Adicionar FAQ/dúvidas frequentes de principiante (rega, luz, vasos) — ficheiros: src/data/ (+vista) ou troubleshoot — validação: build; conteúdo acessível.
- [ ] (P4) Curso: 2.ª lição de rega/clima (capilaridade, drenagem) — ficheiros: src/data/course.ts — validação: data-integrity.
- [ ] (P4) Glossário: +termos ("rotação de culturas", "adubo verde", "pH") — ficheiros: src/data/glossary.ts — validação: build.
- [ ] (P4) Receitas: ligar receitas existentes a mais plantas (cenoura, beterraba) — ficheiros: src/data/recipes.ts — validação: data-integrity.
- [ ] (P5) Saúde: `caution` em frutos/raízes onde aplicável (ex.: batata verde) — ficheiros: src/data/health.ts — validação: build.
- [ ] (P5) Microgreens: mostrar demolha (soakHours) por variedade na vista — ficheiros: features/microgreens — validação: build.
- [ ] (P5) Calendário: nota de geada por zona (lastFrost/firstFrost) na vista — ficheiros: features/calendar — validação: build.
- [ ] (P5) Troubleshoot: +sintoma "plântulas tombam (damping-off)" — ficheiros: src/data/troubleshoot.ts — validação: build; SYMPTOMS aumenta.
- [ ] (P5) Recomendações: priorizar culturas semeáveis este mês — ficheiros: src/utils/recommend.ts — validação: teste.

## Regras de Negócio
- [ ] (P3) Testar `weatherTypeInfo` (useWeather) como função pura — ficheiros: tests/ — validação: novo teste verde.
- [ ] (P3) Testar `useOnlineStatus` (estado inicial + eventos) — ficheiros: tests/ — validação: novo teste verde.
- [ ] (P4) Testar `useReminders` devolve a mesma instância (singleton) — ficheiros: tests/ — validação: teste de identidade.
- [ ] (P4) Reminder: snooze (adiar X dias) — ficheiros: src/repositories/index.ts — validação: teste de nova dueAt.
- [ ] (P4) `journalRepo.add` valida que plantingId existe — ficheiros: src/repositories/index.ts — validação: teste.
- [ ] (P4) `compressImage`: documentar/bound de bytes máx — ficheiros: src/utils/image.ts — validação: revisão.
- [ ] (P5) Teste de componente: ProgressBar (clamping 0-100) — ficheiros: tests/ — validação: mount passa.
- [ ] (P5) Teste de componente: Badge/StatChip render — ficheiros: tests/ — validação: mount passa.
- [ ] (P5) `recommendPlants` determinístico (ordenação estável) — ficheiros: tests/recommend.test.ts — validação: teste.
- [ ] (P5) Marcar planta perdida cria evento de diário (à semelhança de colhida) — ficheiros: src/repositories/index.ts — validação: teste.

## Performance
- [ ] (P4) E2E: fluxo de pesquisa do catálogo (Playwright) — ficheiros: tests/e2e/ — validação: spec passa.
- [ ] (P4) E2E: adicionar planta à horta e ver lembrete — ficheiros: tests/e2e/ — validação: spec passa.
- [ ] (P5) Atributos `width`/`height` explícitos nas imagens de tamanho fixo — ficheiros: features/* — validação: build.
- [ ] (P5) `content-visibility: auto` em secções longas (catálogo) — ficheiros: features/catalog — validação: build.
- [ ] (P5) Pré-carregar rota do catálogo a partir do Home — ficheiros: features/home — validação: build.
- [ ] (P5) Confirmar manualChunks coerente com deps atuais — ficheiros: vite.config.ts — validação: build.
- [ ] (P5) Evitar watchers profundos desnecessários (stores) — ficheiros: stores — validação: revisão.
- [ ] (P5) Medir e registar tamanho do bundle no README — ficheiros: README.md — validação: números coerentes.
- [ ] (P5) Confirmar tree-shaking do vue-i18n (só o necessário) — ficheiros: i18n — validação: build.
- [ ] (P5) Revisão de transições/`will-change` só onde necessário — ficheiros: components/ui — validação: revisão.

## Organização
- [ ] (P3) A11y: `aria-label` em botões só-ícone (recomeçar, fechar, etc.) — ficheiros: components/features — validação: revisão; sem botões sem nome acessível.
- [ ] (P4) Teste de componente: AppCard e ProgressBar — ficheiros: tests/ — validação: mount passa.
- [ ] (P4) Adicionar `SECURITY.md` (como reportar problemas) — ficheiros: raiz — validação: ficheiro existe.
- [ ] (P4) CI: passo de cobertura (não bloqueia PR) — ficheiros: .github/workflows/ci.yml — validação: workflow válido.
- [ ] (P5) Dependabot (config de atualizações) — ficheiros: .github/dependabot.yml — validação: ficheiro válido.
- [ ] (P5) Meta tags básicas (description/robots) no index.html — ficheiros: index.html — validação: build; tags presentes.
- [ ] (P5) A11y: foco visível consistente (focus-visible) — ficheiros: components/ui — validação: revisão.
- [ ] (P5) Consolidar tipos de UI repetidos (tone/variant) — ficheiros: components/ui — validação: typecheck.
- [ ] (P5) Contraste das badges (revisão WCAG AA) — ficheiros: components/ui — validação: revisão.
- [ ] (P5) Atualizar CLAUDE.md com nº de plantas/testes atuais — ficheiros: CLAUDE.md — validação: coerente.

## Arquivo (ciclos concluídos)

### Ciclo 3 — 2026-06-19 — 39 concluídas, 1 bloqueada
Catálogo 39→42 (couve-chinesa/aipo/malagueta); receita sopa-da-horta + 2 microgreens; glossário +7; saúde caution; segurança microgreens; curso l3-3; backup COMPLETO + reset (corrigiu export que perdia a horta); ui store testado + cap 3 toasts; settings testado; infra de testes de componente (@vitejs/plugin-vue) + BaseButton/PlantCard; ToastKind; CONTRIBUTING + LICENSE MIT; completeAllForPlanting; setCell valida grelha; tsconfig estrito (apanhou 2 bugs); cache calendarFor; v-memo; templates .github; decisão i18n; keywords; troubleshoot related; README estrutura de dados. Testes 89→104. Bloqueada: defineAsyncComponent.

### Ciclo 2 — 2026-06-19 — 38 concluídas, 2 bloqueadas
Catálogo 36→39; receitas, pragas, curso u6, saúde, conquistas, lembrete adubação, debounce, useReminders, lazy share, cache sowable, achievementToast, thresholds, docs/ARQUITETURA, prettier/.nvmrc/engines, JSDoc, vendor chunk. Testes 64→89. Bug: arrays partilhados (progress). Bloqueadas: virtualização, ícones PWA.

### Ciclo 1 — 2026-06-18/19 — 38 concluídas, 2 bloqueadas
Catálogo 20→36; ESLint trash (14834→0); CLAUDE.md; desbloqueio do desafio; +conteúdo; .ics DTSTAMP; testes utils; zoneCode; cobertura; vendor; sucessão; compressImage; prefetch. Testes 28→64. Bloqueadas: virtualização, runtimeCaching imagens.
