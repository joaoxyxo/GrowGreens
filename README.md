# 🌱 GrowGreens

[![CI](https://github.com/joaoxyxo/GrowGreens/actions/workflows/ci.yml/badge.svg)](https://github.com/joaoxyxo/GrowGreens/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

Histórico de alterações em [CHANGELOG.md](./CHANGELOG.md).

App web (PWA) que ensina horticultura a principiantes, **da semente à colheita**, calibrada para o clima de Portugal (litoral atlântico — Ovar/Aveiro). Funciona **100% offline** e instala-se como aplicação no telemóvel ou computador.

> Da semente à colheita — começa com microgreens prontos a comer em 7 dias.

## O que faz

- **Desafio dos microgreens** — onboarding de 7 dias com guião dia a dia (adaptado à variedade), diário com fotos e **cartão de colheita partilhável**. A primeira colheita real.
- **Catálogo de plantas** — fichas curadas (51 culturas) com valores agronómicos reais para o clima atlântico: quando semear, germinação, profundidade, espaçamento, pH, sol, rega, pragas/doenças, consociação, segurança/toxicidade e benefícios para a saúde. Pesquisa com tolerância a acentos e filtros.
- **A minha horta** — acompanha cada planta por fases (estimadas), com diário, **linha do tempo de fotos**, lembretes de rega, edição e histórico de colheitas.
- **Plano da horta (espelho digital)** — desenha canteiros, vasos, tabuleiros ou estufa numa grelha, marca o que plantaste em cada lugar, recebe avisos de **boa/má vizinhança** e gera uma **lista de compras**.
- **Curso** — lições curtas estilo Duolingo (conceitos + quizzes), com XP, sequências (streak com proteção), revisão espaçada e conquistas.
- **Saúde & Nutrição** — o que ganhas ao cultivar e comer cada grupo de plantas.
- **Calendário localizado** — "o que semear este mês" por região (todas as zonas), dica sazonal e previsão meteorológica do **IPMA**.
- **A minha planta não está bem** — resolução de problemas por sintomas, sem precisar de IA (diagnóstico por foto com IA fica pronto a ativar com chave).
- **Glossário** — palavras da horta explicadas em linguagem simples.
- **Recomendações** — sugestões de plantas para começar, conforme espaço, região e estação.
- **Lembretes** — notificações + exportação para o calendário do telemóvel (.ics).

## Stack

Vue 3 + TypeScript + Vite · Tailwind CSS v4 · Pinia · Vue Router · Vue I18n · **Dexie (IndexedDB)** para dados local-first · `vite-plugin-pwa` (offline + instalável) · Vitest.

## Instalar como app (PWA)

A app funciona offline e instala-se no dispositivo:

- **Android (Chrome):** menu ⋮ → "Instalar aplicação" / "Adicionar ao ecrã principal".
- **iOS (Safari):** botão Partilhar → "Adicionar ao ecrã principal".
- **Desktop (Chrome/Edge):** ícone de instalação na barra de endereço.

Depois de instalada, abre como uma app normal e funciona sem internet (os dados ficam no dispositivo). Experimenta em **https://joaoxyxo.github.io/GrowGreens/**.

## Arrancar

```bash
npm install
npm run dev      # http://localhost:5173
```

Outros comandos:

```bash
npm run build         # vue-tsc + build de produção (dist/)
npm run preview       # pré-visualizar o build
npm run test          # testes (Vitest)
npm run test:coverage # testes com relatório de cobertura
npm run typecheck     # verificação de tipos
npm run lint          # ESLint
```

## Testes

Lógica de domínio (utils, stores, repositórios) coberta por testes unitários (Vitest) e testes E2E (Playwright). A integridade dos dados do catálogo é validada em `tests/data-integrity.test.ts`. Corre `npm run test:coverage` para o relatório de cobertura (mínimos configurados em `vitest.config.ts`).

## Tamanho do bundle

Referência (build de produção, gzip): **vendor** (Vue/Pinia/Router/Dexie/i18n) ~102 KB · **app** (entrada) ~9 KB · catálogo (`plants`, lazy) ~23 KB. As dependências ficam num chunk `vendor` separado (cacheável entre deploys) via `manualChunks`; as rotas e os dados grandes são lazy-loaded.

## Arquitetura

Visão geral das camadas e do fluxo de dados em [`docs/ARQUITETURA.md`](./docs/ARQUITETURA.md).

- **Local-first:** todos os dados do utilizador (plantas, diário, fotos, progresso) vivem no dispositivo (Dexie/IndexedDB). Não é preciso conta nem internet.
- **Catálogo:** dados estáticos e versionados em `src/data/` (plantas, microgreens, calendário, pragas/doenças, saúde, receitas, curso).
- **Camadas:** UI (`features/`, `components/`) → stores (`stores/`) → repositórios (`repositories/`) → Dexie (`lib/db/`).

```
src/
  data/         # núcleo agronómico (catálogo, calendário, curso, saúde…)
  features/     # ecrãs por funcionalidade
  components/   # UI partilhada + design system (ui/)
  repositories/ # acesso a dados (Dexie)
  stores/       # Pinia (settings, progress, ui)
  composables/  # useLiveQuery, useWeather, useOnlineStatus
  lib/db/       # Dexie + meta
```

### Estrutura de dados

Dois grupos de tipos, ambos em `src/types/`:

- **Domínio do utilizador** (`models.ts`): `Planting`, `JournalEntry`, `Reminder`, `GardenBed`/`BedCell`, `ChallengeRun`, `ProgressState`, `SettingsState`. Guardado localmente em Dexie (`src/lib/db/dexie.ts`) — tabelas `plantings`, `journal`, `reminders`, `challengeRuns`, `beds` e `meta` (chave-valor para settings/progress).
- **Catálogo estático** (`catalog.ts`): `Plant`, `MicrogreenInfo`, `CalendarEntry`, `Recipe`, `Lesson`/`CourseUnit`, `Pest`/`Disease`, `NutrientGroup`, etc. Dados versionados em `src/data/`. As referências entre dados (companheiras, pragas, receitas, grupos) são validadas por `tests/data-integrity.test.ts`.

Backup/reposição: ver `src/utils/backup.ts` (exportar JSON / apagar tudo).

## Cloud (opcional, para mais tarde)

A app está pronta para sincronização na cloud, mas **desativada por defeito** — não precisas de nada disto para a usar.

Quando quiseres ativar contas + sincronização:

1. Cria um projeto em [supabase.com](https://supabase.com).
2. `supabase link` e `supabase db push` (aplica `supabase/migrations/`).
3. Preenche `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (ver `.env.example`).
4. (Opcional) Diagnóstico por IA: `supabase functions deploy diagnose-plant` e `supabase secrets set KINDWISE_API_KEY=... OPENAI_API_KEY=...`.

A meteorologia (IPMA) é gratuita e já funciona sem qualquer configuração.

## Planeamento

Toda a documentação de produto e técnica está em [`docs/`](./docs): visão, arquitetura, UX/UI, conteúdo/currículo, funcionalidades inteligentes, modelo de dados e condições de entrega.

## Privacidade

Local-first por design: sem recolha de dados pessoais, sem rastreadores. Detalhes em **Perfil → Privacidade e termos**.

---

GrowGreens · versão de pré-lançamento · feito com 🌿 para hortas portuguesas.
