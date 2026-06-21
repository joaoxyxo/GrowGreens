# Arquitetura — GrowGreens

App **local-first** (PWA): todos os dados do utilizador vivem no dispositivo (IndexedDB via Dexie). Sem conta nem internet obrigatórias. Conteúdo agronómico é estático e versionado no repositório.

## Camadas

```
UI (features/, components/)
        │  usa
        ▼
Stores (Pinia: settings, progress, ui)
        │  chama
        ▼
Repositories (src/repositories/) — única porta de escrita/leitura de dados do utilizador
        │  usa
        ▼
Dexie / IndexedDB (src/lib/db/)
```

- **UI** (`src/features/<feature>/*.vue`, `src/components/`): ecrãs e design system. Não fala diretamente com o IndexedDB — usa stores, repositórios ou `useLiveQuery`.
- **Stores** (`src/stores/`): estado de sessão e preferências (`settings`), progresso/conquistas (`progress`), UI/toasts (`ui`).
- **Repositories** (`src/repositories/index.ts`): toda a escrita de `plantings`, `journal`, `reminders`, `challengeRuns`, `beds`. Encapsula transações e regras (ex.: ao colher, fecha lembretes e regista marco no diário).
- **Dexie** (`src/lib/db/dexie.ts`): schema e índices das tabelas; `meta` para chave-valor (settings/progress).

## Dados estáticos (catálogo)

`src/data/` (só leitura, versionado): `plants.ts`, `microgreens.ts`, `calendar.ts`, `course.ts`, `health.ts`, `recipes.ts`, `glossary.ts`, `pestsDiseases.ts`, `troubleshoot.ts`, `achievements.ts`. Tipos em `src/types/catalog.ts`. As referências entre dados (companheiras, pragas, receitas…) são validadas por `tests/data-integrity.test.ts`.

## Fluxo de dados (exemplo: adicionar planta)

1. UI (`CatalogView`/`PlantDetailView`) chama `plantingsRepo.create(...)`.
2. O repositório saneia o input, grava a planta e cria o 1.º lembrete de rega.
3. As vistas reagem via `useLiveQuery` (subscrição reativa ao Dexie) — sem refrescar à mão.

## Reatividade

`src/composables/useLiveQuery.ts` liga consultas Dexie a refs reativas. `src/composables/useReminders.ts` mantém uma única subscrição `liveQuery` partilhada por toda a app (Home, Horta, Planeador) para evitar consultas duplicadas. Funções de domínio puras (em `src/utils/`) são testáveis isoladamente.

## Composables (`src/composables/`)

Pequenas peças de estado reativo reutilizável, sem dependências de `features/`:

- `useLiveQuery` — adapta uma `liveQuery` de Dexie a uma ref Vue, com limpeza automática da subscrição ao desmontar.
- `useReminders` — subscrição única partilhada de `db.reminders` (evita N live queries iguais entre ecrãs).
- `useWeather` — busca a previsão do IPMA (com `weatherTypeInfo` para mapear códigos a label/emoji); degrada graciosamente offline.
- `useOnlineStatus` — expõe `isOnline` reagindo aos eventos `online`/`offline` do browser.

## Utilitários (`src/utils/`)

Lógica de regras pura, sem dependências de Vue/Dexie, coberta por testes:

- `growth` — dias de rega por omissão, consociações/antagonismos, sucessão, `estimateStage` (interface `StageEstimate`).
- `challenge` — dia desbloqueado e estado de cada dia do desafio de microgreens.
- `recommend` — `recommendPlants` (pontuação por espaço/região/estação) e `shouldSuggestMicrogreens`.
- `text` — normalização de texto (remove acentos/maiúsculas) para pesquisa, reutilizada em catálogo e glossário.
- `backup` — `exportData`/`downloadBackup`/`clearAllData` (exportação completa: settings + progresso + dados Dexie).
- `date`, `ics`, `streak` — datas/lembretes, ficheiros de calendário (`.ics`) e cálculo de streak.

## Lógica pura testável

Sempre que possível, a lógica de regras vive em funções puras em `src/utils/` (ou `src/data/`) e é coberta por testes unitários, deixando os componentes `.vue` finos. Ver `tests/`.

## Testes

Duas camadas, ambas a correr no CI (`.github/workflows/ci.yml`):

- **Unitários — Vitest** (`tests/*.test.ts`): lógica pura (`growth`, `challenge`, `recommend`, `calendar`, `backup`…), repositórios Dexie (com `fake-indexeddb/auto` em `tests/setup.ts`), stores Pinia e componentes (`@vue/test-utils`). A integridade do catálogo é validada em `tests/data-integrity.test.ts` (todas as referências entre dados estáticos têm de apontar para slugs existentes). Cobertura via `@vitest/coverage-v8` (`npm run test:coverage`).
- **E2E — Playwright** (`tests/e2e/*.spec.ts`): fluxos reais sobre o build de produção. O `webServer` faz `BASE_PATH=/ npm run build && preview` para o `base` não partir as rotas. Padrão: helper `completeOnboarding(page)`, navegação SPA (sem reload), e `exact: true`/seletores `href*=` para desambiguar.

Antes de commitar: `npm run typecheck`, `npm run test` e `npm run build` verdes.
