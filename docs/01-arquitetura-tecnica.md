# Especificação Técnica — GrowGreens (PWA Vue 3 + Supabase)

Versão 1.0 · Junho 2026 · Pronta a construir · Mercado: Portugal

---

## 0. Princípios de arquitetura

1. **Local-first real**: a app funciona 100% offline, sem login. A rede é melhoria, não requisito.
2. **Sem login obrigatório no arranque**: utilizador anónimo guarda tudo localmente; ao criar conta, faz-se *merge* dos dados locais para a cloud.
3. **Segredos nunca no cliente**: chaves de IA e qualquer credencial sensível vivem em Edge Functions (Deno). O frontend só conhece a `anon key` (pública por design, protegida por RLS).
4. **TypeScript estrito** em todo o lado, com tipos gerados a partir do schema Supabase.
5. **Camadas explícitas**: UI → stores (Pinia) → repositórios → (Dexie local | Supabase remoto). A UI nunca fala diretamente com Dexie ou Supabase.

---

## 1. Stack final (versões concretas + justificação)

| Camada | Escolha | Versão alvo | Porquê |
|---|---|---|---|
| Framework | **Vue 3** (`<script setup>` + Composition API) | `^3.5` | Já decidido; 5 anos de experiência do dono. |
| Build | **Vite** | `^6` (ou `^7` se estável) | HMR rápido, ecossistema PWA maduro. |
| Linguagem | **TypeScript** | `^5.6` | Tipagem ponta a ponta; gerar tipos do Supabase. |
| Estado | **Pinia** | `^2.2` | Store oficial Vue 3. DX excelente, tipado. |
| Routing | **Vue Router** | `^4.4` | Oficial. Lazy-loading por rota. |
| PWA | **vite-plugin-pwa** (Workbox) | `^0.21` | Standard de facto. Gera SW, manifest, precache. |
| UI/CSS | **Tailwind CSS v4** + `@tailwindcss/vite` | `^4.0` | Plugin Vite first-party, builds rápidos, config em CSS. |
| Componentes headless | **shadcn-vue** (Reka UI) | `^2` | Primitivos acessíveis + Tailwind no teu repo. |
| Formulários | **VeeValidate** + **Zod** | VeeValidate `^4.13`, Zod `^3.23` | Schemas reutilizáveis (validação + tipos TS + Edge Functions). |
| Datas | **date-fns** (+ `date-fns-tz`) | `^4.1` | Tree-shakeable, locale `pt`. |
| i18n | **Vue I18n** | `^10` | PT-PT agora, isolar strings para futuro. |
| BD local | **Dexie.js** | `^4.0` | Wrapper IndexedDB maduro, transações, migrations. |
| Cliente Supabase | **@supabase/supabase-js** | `^2.45` | Auth + Storage + Realtime + queries. |
| Testes unit | **Vitest** + **@vue/test-utils** + **@testing-library/vue** | — | Partilha config Vite. |
| Testes E2E | **Playwright** | `^1.48` | Multi-browser, testa fluxos offline e PWA. |
| Lint/Format | **ESLint 9** (flat) + `eslint-plugin-vue` + **Prettier** | — | Standard atual. |
| Git hooks | **simple-git-hooks** + **lint-staged** | — | Lint/format/typecheck no pre-commit. |
| CI/CD | **GitHub Actions** | — | Lint, typecheck, test, build, deploy. |
| Deploy | **Cloudflare Pages** (alt. Netlify) | — | CDN global, plano grátis generoso, ótimo para SPA + Supabase. |

**Notas:** para um dev solo a iterar rápido com identidade própria, Tailwind v4 + shadcn-vue é o ponto ideal (controlo, bundle enxuto, acessibilidade via Reka) — evitar UI kits pesados (Vuetify/PrimeVue). Considerar `@pinia/colada` para caching de queries remotas (catálogo, meteorologia) — opcional no MVP.

---

## 2. Estrutura de pastas (feature-based)

```
growgreens/
├─ public/
│  ├─ icons/                      # ícones PWA (192, 512, maskable, apple-touch)
│  └─ favicon.svg
├─ src/
│  ├─ main.ts                     # bootstrap: app, pinia, router, i18n, dexie init
│  ├─ App.vue
│  ├─ assets/styles/main.css      # @import "tailwindcss"; tokens (@theme)
│  ├─ router/
│  │  ├─ index.ts                 # createRouter, lazy routes, guards
│  │  └─ guards.ts                # auth guard "soft" (permite anónimo)
│  ├─ stores/                     # Pinia (estado transversal)
│  │  ├─ auth.ts · sync.ts · ui.ts · settings.ts
│  ├─ lib/                        # infra partilhada
│  │  ├─ supabase.ts
│  │  ├─ db/dexie.ts · db/migrations.ts
│  │  ├─ sync/engine.ts · sync/queue.ts · sync/conflict.ts
│  │  ├─ pwa.ts
│  │  └─ http/functions.ts
│  ├─ types/
│  │  ├─ database.types.ts        # GERADO: supabase gen types
│  │  ├─ models.ts · dto.ts
│  ├─ repositories/               # camada de acesso a dados (local+remoto)
│  │  ├─ base.repository.ts
│  │  ├─ gardens · plantings · journal · reminders · catalog
│  ├─ composables/
│  │  ├─ useOnlineStatus · useLiveQuery · usePushNotifications · useCamera · useGeolocation
│  ├─ features/                   # cada feature auto-contida
│  │  ├─ onboarding/ · course/ · garden/ · reminders/ · microgreens/
│  │  ├─ health/ · catalog/ · weather/ · diagnosis/ · recipes/
│  ├─ components/ui/              # shadcn-vue gerado
│  ├─ i18n/
│  │  ├─ index.ts · locales/pt.json · locales/en.json
│  └─ utils/ (date.ts · image.ts · result.ts)
├─ supabase/
│  ├─ config.toml
│  ├─ migrations/                 # SQL versionado (schema + RLS)
│  ├─ functions/                  # Edge Functions (Deno)
│  │  ├─ _shared/ (cors.ts · supabaseAdmin.ts)
│  │  ├─ ai-diagnosis/ · weather/ · recipes/
│  └─ seed.sql                    # catálogo inicial
├─ tests/ (unit/ · e2e/)
├─ .github/workflows/ci.yml
├─ vite.config.ts · vitest.config.ts · playwright.config.ts
├─ eslint.config.js · tsconfig.json · package.json
```

---

## 3. Estratégia PWA

### 3.1 vite.config.ts (excerto)

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',          // NÃO autoUpdate — ver 3.2
      injectRegister: 'auto',
      strategies: 'generateSW',
      manifest: {
        name: 'GrowGreens', short_name: 'GrowGreens',
        description: 'Da semente à colheita — cultiva em casa.',
        lang: 'pt-PT', theme_color: '#2e7d32', background_color: '#ffffff',
        display: 'standalone', start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        runtimeCaching: [
          { urlPattern: ({ url }) => url.href.includes('/rest/v1/'),
            handler: 'NetworkFirst',
            options: { cacheName: 'supabase-data', expiration: { maxEntries: 200, maxAgeSeconds: 86400 } } },
          { urlPattern: ({ url }) => url.href.includes('/storage/v1/object/'),
            handler: 'CacheFirst',
            options: { cacheName: 'images', expiration: { maxEntries: 300, maxAgeSeconds: 2592000 } } },
        ],
      },
      devOptions: { enabled: true },
    }),
  ],
})
```

### 3.2 Update — `prompt`, não `autoUpdate`
`autoUpdate` pode recarregar a página a meio de uma tarefa. Usa `prompt`: toast "Nova versão disponível → Recarregar" e o utilizador decide.

### 3.3 Estratégia de cache
- **App shell** (JS/CSS/HTML com hash): precache.
- **Dados Supabase REST** (catálogo, curso): `NetworkFirst`.
- **Imagens** (Storage/catálogo): `CacheFirst`, expiração longa.
- **Dados do utilizador** (jardim, diário, lembretes): vivem no IndexedDB via Dexie — fonte de verdade local, não dependem de runtime caching.

### 3.4 Notificações push — viabilidade e fallbacks

| Plataforma | Web Push | Condições |
|---|---|---|
| Android (Chrome) | Sim, completo | Funciona mesmo sem instalar. |
| Desktop (Chrome/Edge/Firefox) | Sim | — |
| **iOS/iPadOS (Safari)** | Sim, **desde iOS 16.4** | **Só** com a PWA **instalada no ecrã principal**. Sem rich media. Prompt só após interação. |
| iOS na **UE** | Risco | DMA degradou PWAs standalone na UE; **Portugal está na UE** — risco a monitorizar. |

Implementação Web Push: gerar par **VAPID** (privada como segredo de Edge Function); cliente pede permissão só após tap; guardar subscription em `push_subscriptions` (RLS por `user_id`); enviar via Edge Function agendada (`pg_cron`) com lib `web-push` em Deno.

**Fallbacks essenciais** (dado o risco iOS/UE): lembretes pendentes **in-app** ao abrir; Notifications API enquanto a app/SW está ativa; **export .ics** dos lembretes de rega (funciona em qualquer plataforma); onboarding a sugerir "Adicionar ao ecrã principal" no iOS.

---

## 4. Local-first + sync

### 4.1 Decisão: Dexie + sync próprio (MVP), porta aberta para PowerSync
Dados são **single-user** (cada utilizador só vê os seus) → não há colaboração concorrente → basta uma fila de escritas (outbox) + *last-write-wins*. **Não** são precisos CRDTs. Começar com Dexie + sync próprio; migrar para **PowerSync** só se o sync se tornar uma dor. A camada de repositórios isola esta decisão.

### 4.2 Schema Dexie

```ts
// lib/db/dexie.ts
import Dexie, { type Table } from 'dexie'
import type { Garden, Planting, JournalEntry, Reminder, OutboxItem } from '@/types/models'

export class GrowGreensDB extends Dexie {
  gardens!: Table<Garden, string>
  plantings!: Table<Planting, string>
  journal!: Table<JournalEntry, string>
  reminders!: Table<Reminder, string>
  outbox!: Table<OutboxItem, string>

  constructor() {
    super('growgreens')
    this.version(1).stores({
      gardens:  'id, updatedAt, syncStatus',
      plantings:'id, gardenId, status, updatedAt, syncStatus',
      journal:  'id, plantingId, createdAt, syncStatus',
      reminders:'id, plantingId, dueAt, done, syncStatus',
      outbox:   'id, entity, op, createdAt',
    })
  }
}
export const db = new GrowGreensDB()
```

Cada registo carrega metadados de sync: `id` (UUID gerado **no cliente**), `updatedAt`, `deletedAt` (soft delete), `syncStatus`, `userId`.

### 4.3 Reatividade Dexie → Vue

```ts
// composables/useLiveQuery.ts
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import { from } from 'rxjs'

export function useLiveQuery<T>(querier: () => Promise<T>) {
  return useObservable<T>(from(liveQuery(querier)) as any)
}
```

### 4.4 Modelo de sincronização
**Outbox (push):** toda a mutação escreve no Dexie **e** insere um `OutboxItem`. O motor de sync, quando online+autenticado, drena a outbox por ordem (`upsert`/`delete` no Supabase), com backoff em erro.
**Pull:** incremental por `updatedAt` (`lastPulledAt` por entidade); opcional **Supabase Realtime** para multi-dispositivo.
**Disparadores:** ao ficar online, ao login, periodicamente, e em `visibilitychange`. Background Sync API como bónus.

### 4.5 Resolução de conflitos
**Last-Write-Wins por `updatedAt`** como base. Regras específicas: diário/fotos são *append-only* (sem conflito); `done` de lembretes é monotónico (prefere `true`); deletes via soft delete propagado.

### 4.6 Anónimo → conta
Anónimo: `userId='local'`, tudo no Dexie, outbox não drena. Ao criar conta: remapear `userId` de todos os registos para o `auth.uid()` real e enfileirar tudo → primeira sync faz upload do histórico. (Mantém a BD limpa, vs. anonymous sign-in.)

---

## 5. Supabase

### 5.1 Auth
Email/password + Magic Link + OAuth Google (e Apple se houver app embrulhada). `persistSession: true`, `autoRefreshToken: true`, `detectSessionInUrl: true`.

```ts
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } },
)
```

### 5.2 Schema + RLS (exemplo)

```sql
create table gardens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);
create index on gardens (user_id);

alter table gardens enable row level security;

create policy "select own gardens" on gardens for select to authenticated
  using ( (select auth.uid()) = user_id );
create policy "insert own gardens" on gardens for insert to authenticated
  with check ( (select auth.uid()) = user_id );
create policy "update own gardens" on gardens for update to authenticated
  using ( (select auth.uid()) = user_id ) with check ( (select auth.uid()) = user_id );
create policy "delete own gardens" on gardens for delete to authenticated
  using ( (select auth.uid()) = user_id );
```

**Boas práticas RLS:** envolver `auth.uid()` em `(select auth.uid())` (cacheia, grande ganho de performance); **indexar sempre `user_id`**; especificar `TO authenticated`/`TO anon`; UPDATE precisa de policy SELECT; catálogo é read-only público (`for select to anon, authenticated using (true)`); nunca testar policies só no SQL Editor (faz bypass); garantir RLS ON em **todas** as tabelas de utilizador (cf. CVE-2025-48757).

### 5.3 Storage (fotos)
Bucket `journal-photos` privado; caminho `{user_id}/{planting_id}/{uuid}.webp`; policies por prefixo do `user_id`; **comprimir/redimensionar no cliente** (WebP, máx ~1600px) antes do upload; offline guarda Blob no Dexie e enfileira; servir via **signed URLs**.

### 5.4 Realtime
Útil mas **opcional** no MVP. Usar para sincronizar entre dispositivos do mesmo utilizador (`postgres_changes` filtrado por `user_id`). Atrás de uma flag para poupar custo.

### 5.5 Edge Functions (Deno) — proxy IA/IPMA
Padrão: validar JWT, validar input (Zod), ler segredo de `Deno.env`, chamar API externa, normalizar, CORS.

```ts
// supabase/functions/weather/index.ts (excerto)
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } },
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401, headers: corsHeaders })
  // ... fetch IPMA, normalizar, devolver
})
```

**Segredos:** `supabase secrets set OPENAI_API_KEY=... VAPID_PRIVATE_KEY=...` — nunca em `VITE_*`. **IPMA** open-data gratuito; a função cacheia/normaliza. **IA**: rate-limit por utilizador. **Push de lembretes**: Edge Function + `pg_cron`.

---

## 6. Camadas de aplicação

### 6.1 Pinia stores
- `useAuthStore`: `user`, `session`, `isAnonymous`, ações de auth + remapeamento de `userId`.
- `useSyncStore`: `isOnline`, `pendingCount`, `lastSyncedAt`, `status`, `syncNow()`.
- `useSettingsStore`: `locale`, `units`, `location` (concelho/coords para IPMA), `notificationsEnabled`.
- `useUiStore`: toasts, modais, `needsRefresh`, tema.

**Dados de domínio NÃO ficam em Pinia** — ficam no Dexie e chegam à UI via `useLiveQuery`. Pinia guarda estado de UI/sessão/derivado.

### 6.2 Repositórios

```ts
// repositories/base.repository.ts (excerto)
export class BaseRepository<T extends { id: string; updatedAt: string; userId: string }> {
  constructor(private table: Table<T, string>, private entity: string) {}
  async upsert(record: Omit<T, 'updatedAt' | 'syncStatus'>) {
    const now = new Date().toISOString()
    const full = { ...record, updatedAt: now, syncStatus: 'pending' } as T
    await db.transaction('rw', this.table, db.outbox, async () => {
      await this.table.put(full)
      await db.outbox.add({ id: crypto.randomUUID(), entity: this.entity, op: 'upsert', payload: full, createdAt: now })
    })
    return full
  }
  // remove(id) -> soft delete + outbox 'delete'
}
```

A UI e as stores só conhecem repositórios — nunca importam `supabase` nem `db` diretamente.

### 6.3 Tipos
- `database.types.ts`: gerado por `supabase gen types typescript --linked`.
- `models.ts`: tipos de domínio (com campos de sync).
- `dto.ts`: payloads das Edge Functions, partilhados via Zod (`z.infer`), validados no cliente **e** na função.

---

## 7. Qualidade, CI/CD e deploy

**ESLint 9 (flat) + Prettier**; `simple-git-hooks` + `lint-staged` no pre-commit (`eslint --fix`, `prettier --write`, `vue-tsc --noEmit`).

**Testes:** Vitest (utils de calendário/datas, resolução de conflitos, mappers, composables, componentes; mockar Dexie com `fake-indexeddb`). Playwright (onboarding anónimo, criar planting + diário offline → online → sync, instalar PWA, login + merge).

**CI (GitHub Actions):**
```yaml
name: CI
on: { push: { branches: [main] }, pull_request: {} }
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: corepack enable && pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test:unit
      - run: pnpm build
      - run: pnpm exec playwright install --with-deps && pnpm test:e2e
```

**Deploy:** **Cloudflare Pages** (recomendado — CDN, grátis generoso, headers fáceis, sem cold starts). Backend todo no Supabase; só se hospeda a SPA estática. Edge Functions correm no Supabase.

---

## 8. Performance e segurança

**Performance:** code-splitting por rota + prefetch; imagens WebP/AVIF, lazy, comprimidas no cliente, `srcset`; indexar campos de query no Dexie; RLS com `(select auth.uid())` + índices; Tailwind v4 (purge automático); analisar bundle com `rollup-plugin-visualizer`; Realtime só onde compensa; Lighthouse PWA como gate opcional no CI.

**Segurança:** `anon key` no cliente é OK — a segurança vem de **RLS rigorosa**; `service_role` nunca no cliente; segredos só em Edge Functions; **validação dupla** (Zod cliente + função/SQL); Storage privado + signed URLs; Edge Functions verificam JWT + rate-limit + CORS restrito; headers de segurança (CSP etc.) via `_headers`; auditar com o advisor do Supabase; ambientes dev/prod separados.

---

## Fontes

- [Building Local-First Apps with Vue and Dexie.js — alexop.dev](https://alexop.dev/posts/building-local-first-apps-vue-dexie/)
- [Get started with Dexie in Vue — Dexie.js Docs](https://dexie.org/docs/Tutorial/Vue)
- [Build Offline-First Vue 3 PWAs with Workbox & IndexedDB — Codez Up](https://codezup.com/vue3-pwa-workbox-indexeddb-guide/)
- [PWA on iOS — Current Status & Limitations 2025 — Brainhub](https://brainhub.eu/library/pwa-on-ios)
- [PWA iOS Limitations and Safari Support 2026 — MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)
- [Caching Strategies — vite-plugin-pwa](https://deepwiki.com/vite-pwa/vite-plugin-pwa/7-caching-strategies)
- [Row Level Security — Supabase Docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [RLS Performance and Best Practices — Supabase Docs](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv)
- [Supabase Security Best Practices & CVE-2025-48757 — VibeAppScanner](https://vibeappscanner.com/best-practices/supabase)
- [Edge Functions — Supabase Docs](https://supabase.com/docs/guides/functions)
- [Tailwind CSS v4.0 — Tailwind Blog](https://tailwindcss.com/blog/tailwindcss-v4)
- [Supabase + PowerSync Integration Guide — PowerSync Docs](https://docs.powersync.com/integration-guides/supabase-+-powersync)
- [Pinia — store oficial Vue](https://pinia.vuejs.org/)
