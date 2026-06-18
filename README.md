# 🌱 GrowGreens

App web (PWA) que ensina horticultura a principiantes, **da semente à colheita**, calibrada para o clima de Portugal (litoral atlântico — Ovar/Aveiro). Funciona **100% offline** e instala-se como aplicação no telemóvel ou computador.

> Da semente à colheita — começa com microgreens prontos a comer em 7 dias.

## O que faz

- **Desafio dos microgreens** — onboarding de 7 dias com guião dia a dia (adaptado à variedade), diário com fotos e **cartão de colheita partilhável**. A primeira colheita real.
- **Catálogo de plantas** — fichas curadas (≈20 culturas) com valores agronómicos reais para o clima atlântico: quando semear, germinação, profundidade, espaçamento, pH, sol, rega, pragas/doenças, consociação, segurança/toxicidade e benefícios para a saúde. Pesquisa com tolerância a acentos e filtros.
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

## Arrancar

```bash
npm install
npm run dev      # http://localhost:5173
```

Outros comandos:

```bash
npm run build      # vue-tsc + build de produção (dist/)
npm run preview    # pré-visualizar o build
npm run test       # testes (Vitest)
npm run typecheck  # verificação de tipos
npm run lint       # ESLint
```

## Arquitetura

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
