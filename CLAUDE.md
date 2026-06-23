# CLAUDE.md — GrowGreens

PWA local-first que ensina horticultura a principiantes, da semente à colheita, calibrada para o clima de Portugal (litoral atlântico). Funciona offline e instala-se como app. Interface em **pt-PT**.

> Escala atual (referência): **61 plantas** no catálogo · **15 microgreens** · **30 receitas** · **70 termos** de glossário · **27 FAQ** · curso com **7 unidades / 24 lições** · **226 testes** unitários (Vitest) + **11 E2E** (Playwright) verdes · lint 0.
>
> Funcionalidades pedagógicas (agrónomo/professor): 🌡️ relógio térmico (graus-dia, `utils/phenology.ts` + `data/climate.ts`), 🔄 rotação de culturas (`utils/rotation.ts`), 🔑 chave de diagnóstico dicotómica (`data/diagnosisKey.ts`), 🤝 otimizador de consociação no canteiro (`utils/companionBed.ts`), 🌍 painel de impacto da horta (`utils/impact.ts`).

## Stack

- **Vue 3** (`<script setup>`, Composition API) + **TypeScript**
- **Vite 6** (build/dev) + **vite-plugin-pwa** (offline + instalável)
- **Pinia** (estado), **Vue Router** (history mode, respeita `import.meta.env.BASE_URL`)
- **Dexie** (IndexedDB) — dados do utilizador, local-first
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- Gestor de pacotes: **npm**

## Scripts

```bash
npm run dev        # servidor de dev (porta 5390)
npm run build      # vue-tsc -b && vite build  → dist/
npm run preview    # pré-visualizar o build
npm run typecheck  # vue-tsc -b --noEmit
npm run lint       # eslint . --ext .ts,.vue
npm run test       # vitest run
npm run test:e2e   # playwright test
```

Antes de commitar, garante: `npm run typecheck`, `npm run test` e `npm run build` verdes. Nunca deixes a build partida.

## Arquitetura

- **Local-first:** todos os dados do utilizador (plantas, diário, fotos, progresso, lembretes) vivem no dispositivo via Dexie/IndexedDB. Sem conta nem internet obrigatórias.
- **Catálogo (dados estáticos, só leitura):** versionado em `src/data/` — `plants.ts` (catálogo agronómico), `microgreens.ts` (desafio 7 dias), `calendar.ts` (sementeira por zona/mês), `course.ts` (lições), `health.ts`, `recipes.ts`, `glossary.ts`, `pestsDiseases.ts`, `troubleshoot.ts`, `achievements.ts`.
- **Camadas:** UI (`src/features/`, `src/components/`) → stores (`src/stores/`) → repositórios (`src/repositories/`) → Dexie (`src/lib/db/`).
- **Tipos:** domínio do utilizador em `src/types/models.ts`; catálogo estático em `src/types/catalog.ts`.

```
src/
  data/         # núcleo agronómico estático (catálogo, calendário, curso, saúde…)
  features/     # ecrãs por funcionalidade (catalog, garden, planner, course, microgreens, calendar, health, diagnosis, glossary, home, onboarding, profile, legal)
  components/   # UI partilhada + design system (ui/)
  repositories/ # acesso a dados (Dexie)
  stores/       # Pinia (settings, progress, ui)
  composables/  # useLiveQuery, useWeather, useOnlineStatus
  lib/db/       # Dexie + meta
  utils/        # date, image, share, safe
  types/        # models (utilizador) + catalog (estático)
```

## Convenções

- Texto da UI e dados em **português de Portugal**.
- Dados do catálogo: ao adicionar/editar plantas, respeitar o tipo `Plant` em `src/types/catalog.ts`. As referências (`companions`, `antagonists`, `pests`, `diseases`, `nutrientGroup`, `recipes`) têm de apontar para slugs/códigos existentes — o teste `tests/data-integrity.test.ts` valida isto.
- Datas/cálculos via `src/utils/date.ts` (date-fns, locale `pt`).
- Componentes Vue: `<script setup lang="ts">`, alias `@` → `src/`.

## Deploy

- Hospedado em **GitHub Pages** (project site): `https://joaoxyxo.github.io/GrowGreens/`.
- `base` de produção `/GrowGreens/` (em dev é `/`). O router e o manifest PWA respeitam o base.
- Workflow `.github/workflows/deploy.yml` faz build + publica a cada push em `main` (com fallback `404.html` para deep-links SPA). `.github/workflows/ci.yml` corre lint/typecheck/test/build + e2e.

## Cloud opcional (desativado por defeito)

A app está pronta para Supabase (contas + sync) e diagnóstico por IA, mas desativados. Ver `.env.example` e `supabase/`. A meteorologia (IPMA) é gratuita e já funciona.
