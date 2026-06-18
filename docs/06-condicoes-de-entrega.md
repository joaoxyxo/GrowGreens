# GrowGreens — Condições de Entrega (Contrato de Construção)

> Documento que fixa o âmbito, os critérios de aceitação e **todos os pressupostos** necessários para construir a aplicação **sem interrupções**. Uma vez dado o "avança", nada aqui exige decisão humana adicional.
>
> **Versão:** 1.0 · **Data:** junho 2026 · **Decisões do dono:** produto completo numa só entrega · local-first sem credenciais · receitas+IPMA ativas, IA em stub · nome **GrowGreens**

---

## 1. Reconciliação do âmbito

"Produto completo numa só entrega" + "local-first sem credenciais" + "IA em stub" traduz-se em:

**Construo uma app completa em funcionalidades, a correr 100% offline, instalável como PWA.** Tudo o que não depende de chaves/contas funciona de verdade. O que depende de credenciais fica escrito e pronto, mas inativo até deploy. Concretamente:

| Área | Estado na entrega |
|---|---|
| Onboarding + recomendação inicial | ✅ Funcional |
| Desafio dos microgreens (7 dias) | ✅ Funcional, offline, com persistência |
| Catálogo de plantas + pesquisa/filtros | ✅ Funcional, com **núcleo agronómico curado** (ver §5) |
| As minhas plantas (diário, fotos, lembretes) | ✅ Funcional, offline |
| Curso completo (currículo das 13 unidades) | ✅ Conteúdo das unidades-núcleo escrito; estrutura completa das 13 |
| Camada de saúde/nutrição | ✅ Funcional (5 grupos + fichas das culturas do núcleo) |
| Calendário localizado (Ovar/zonas) | ✅ Funcional |
| Receitas curadas (PT-PT) | ✅ Funcional, ligadas à colheita |
| Meteorologia IPMA | ✅ Funcional (gratuita, sem chave) |
| Diagnóstico por foto (IA) | 🟡 Ecrã e fluxo prontos, **inativo** (placeholder); ativa-se com chave |
| Contas + sincronização cloud (Supabase) | 🟡 Código + migrations + seed prontos; **app corre sem isto**; deploy quando quiseres |
| Gamificação (streak/XP/conquistas) | ✅ Funcional |

A app **nunca obriga a criar conta nem a estar online**. Criar conta (mais tarde, após deploy do backend) só acrescenta sincronização entre dispositivos.

---

## 2. Âmbito fixado (dentro / fora)

**Dentro:**
- PWA Vue 3 + TypeScript, instalável, offline-first (Dexie/IndexedDB).
- Todas as áreas marcadas ✅ acima, em PT-PT.
- Núcleo agronómico curado (§5) com correção verificada.
- Conteúdo legal/RGPD: política de privacidade, termos, *disclaimer* de saúde.
- Testes automatizados (unitários + 1 fluxo E2E crítico) e build de produção sem erros.
- Migrations Supabase + seed SQL + código de auth/sync prontos (desativados por *feature flag* até deploy).
- Edge Functions escritas (IPMA, receitas, diagnóstico) — IPMA/receitas operáveis localmente; diagnóstico em stub.

**Fora (fica para depois, requer ação tua):**
- Deploy real do Supabase e ativação de contas/sync (precisa das tuas credenciais).
- Ativação do diagnóstico por IA (precisa de chave Kindwise/OpenAI).
- Catálogo "enciclopédico" de milhares de plantas (a arquitetura suporta; o povoamento em massa via Wikidata/GBIF faz-se numa fase posterior).
- Publicação nas lojas / domínio próprio.
- Tradução para outros idiomas (a estrutura i18n fica pronta).

---

## 3. Defaults e pressupostos congelados (para não haver perguntas a meio)

- **Idioma:** PT-PT, tratamento por "tu". Strings isoladas via i18n.
- **Unidades:** métricas (cm, litros, °C, dias).
- **Tema:** claro e escuro, segue o sistema; alternável.
- **Zona climática por defeito:** Litoral Norte (Ovar/Aveiro); o utilizador pode mudar.
- **Microgreen por defeito do desafio:** rabanete (mais à prova de falha); rúcula/mostarda como alternativas.
- **Lembretes:** locais (in-app) + exportação .ics; push só onde a plataforma permite (Android/desktop; iOS só se instalada). Sem push obrigatório.
- **Fotos do utilizador:** guardadas localmente (IndexedDB) comprimidas para WebP; sincronizam para Storage após deploy.
- **Imagens do catálogo:** Wikimedia Commons (CC0/CC-BY com atribuição) e/ou ilustrações SVG próprias; cada imagem leva crédito/licença no campo respetivo. Sem imagens de licença duvidosa.
- **Tipografia:** Inter (corpo) + Plus Jakarta Sans (títulos), via fontes auto-alojadas.
- **Identidade:** nome **GrowGreens**; paleta e tokens conforme doc 02; logótipo SVG próprio gerado na construção.
- **Gestor de pacotes:** pnpm. **Node:** 20 LTS.
- **Repositório:** estrutura conforme doc 01; um único projeto na pasta atual.
- **Persistência de progresso do curso/gamificação:** local (Dexie), migrável para cloud.
- **Privacidade:** sem *tracking* de terceiros; analítica só local/anónima (ou nenhuma) por defeito.

Qualquer decisão menor não coberta aqui resolvo-a a favor da opção mais simples, segura e alinhada com estes documentos — sem interromper.

---

## 4. Definição de "Pronto" (critérios de aceitação)

A entrega considera-se completa quando **todos** estes pontos se verificam:

**Funcional**
1. A app instala como PWA e arranca sem erros (sem ligação à rede).
2. Desafio dos microgreens completo Dia 0→7, com marcação de tarefas, diário e fotos, a persistir offline e a sobreviver a recarregamento/reinício.
3. Catálogo pesquisável (nome com tolerância a acentos/erros) e filtrável por todas as facetas do doc 05, sobre os dados do núcleo agronómico.
4. Adicionar uma planta à horta, acompanhar por fases, registar rega/diário/fotos, receber lembretes.
5. Curso navegável com as unidades-núcleo jogáveis de ponta a ponta (lições, quizzes, checkpoints, XP, streak).
6. Camada de saúde, calendário localizado, receitas e meteorologia IPMA operacionais.
7. Diagnóstico por foto apresenta ecrã e fluxo, com mensagem clara de "disponível em breve".

**Qualidade**
8. TypeScript sem erros (`vue-tsc`), ESLint/Prettier limpos.
9. Testes unitários a passar (lógica de calendário, rega, datas, gamificação, repositórios) + 1 teste E2E do fluxo dos microgreens.
10. Build de produção (`pnpm build`) sem erros nem avisos críticos; Lighthouse PWA "installable".
11. Acessibilidade: contraste AA, navegação por teclado, labels, alt-text — conforme doc 02.

**Conteúdo e correção agronómica**
12. Núcleo agronómico (§5) preenchido, internamente coerente e **revisto contra a realidade do clima atlântico** (tempos, épocas, rega, fungos).
13. Avisos de segurança (toxicidade/partes comestíveis) presentes onde aplicável.
14. Conteúdo legal/RGPD e *disclaimer* de saúde presentes.

**Entregável**
15. Tudo na pasta do projeto, com README de arranque (`pnpm install && pnpm dev`) e instruções de deploy do Supabase para quando quiseres ativar a cloud.

---

## 5. Núcleo agronómico que vou produzir (o conteúdo real)

Como horticultor, comprometo-me a gerar e verificar os seguintes dados, calibrados para Portugal litoral atlântico (Ovar/Aveiro). Este é o "miolo" que torna isto um produto de horticultura e não uma casca.

**a) Catálogo curado — ~40 culturas** (as realisticamente cultiváveis em casa em PT), cada uma com ficha completa do doc 03 e todos os campos do doc 05: dificuldade, indoor/outdoor, dias até colheita (realistas para clima fresco), método, sol, pH, profundidade e densidade de sementeira, espaçamento, volume de vaso, rega, temperaturas de germinação, tolerância a geada. Inclui: folhas (alface, rúcula, espinafre, acelga, agrião, couve-galega), brássicas (brócolos, couve-flor, repolho, rabanete, nabo, mostarda), raízes/bolbos (cenoura, beterraba, batata, alho, cebola, cebolinho), frutos (tomate, pimento, malagueta, beringela, courgette, pepino, abóbora, morango), leguminosas (feijão-verde, ervilha, fava, grão), aromáticas (manjericão, salsa, coentros, hortelã, alecrim, tomilho, orégãos, cebolinho), e microgreens (rabanete, mostarda, brócolos, ervilha, girassol, rúcula).

**b) Parâmetros exatos dos microgreens** do desafio: tempo de demolha, densidade de sementeira, duração de blackout/peso e dias até colheita por variedade.

**c) Calendário de sementeira por mês** para a zona Litoral Norte (e estrutura para outras zonas PT), por cultura e ação (semear interior/direto, transplantar, colher).

**d) Matriz de consociação** (bons/maus vizinhos) entre as culturas do núcleo.

**e) Catálogo de pragas e doenças** do clima atlântico (míldio, oídio, afídeos, lesmas, mosca-mineira…) com sintomas, prevenção e tratamento biológico, ligadas às culturas afetadas.

**f) Fichas de saúde/nutrição** dos 5 grupos + ligação por cultura, com nota de evidência e *disclaimer*.

**g) Receitas** portuguesas simples ligadas às culturas (≥1–2 por cultura-chave).

### Adições ao schema (decorrentes da revisão de especialista)
Acrescento à tabela `plants` (e tabelas de apoio) os seguintes campos, que estavam em falta e são importantes para um produto correto e seguro:
- `indoor_viability_by_season` — viabilidade indoor por estação (resolve a luz fraca do inverno de Aveiro).
- `needs_supplemental_light` (bool) + nota — quando a luz natural não chega.
- `pollination_type` — autofértil / vento / insetos / manual — e nota prática (ex.: agitar o tomate, polinizar à mão as cucurbitáceas).
- `is_toxic` / `toxic_parts` / `edible_parts` / `pet_safe` — segurança (crianças/animais).
- `feeding_schedule_pt` — calendário de fertilização/adubação (reutiliza `nutrients_pt` por fase).
- `expectations_pt` — rendimento e tempos realistas, para gerir expectativas.

---

## 6. Como garanto qualidade sem intervenção humana

- **Verificação cruzada** dos dados agronómicos contra as fontes da pesquisa já feita (Hortas Biológicas, calendários PT, fontes de microgreens) antes de os fixar.
- **Testes automatizados** para a lógica crítica e um E2E do fluxo principal.
- **Auto-revisão** com um subagente de verificação no fim (correção de dados, *lint*, *typecheck*, build) — um passo de QA antes de declarar "pronto".
- **Coerência interna**: validações de BD (pH, datas, severidades) e regra de promoção de fichas a `curated`.

---

## 7. O que acontece a seguir

Ao dares "avança", executo a ordem de construção do plano-mestre (§5 do doc 00): fundações → design system → núcleo local-first → shell de navegação → desafio microgreens → lembretes → PWA → catálogo + dados → curso → saúde/receitas/IPMA → diagnóstico (stub) → camada cloud (desativada) → QA final. Trabalho de forma contínua e só volto a falar contigo para entregar (ou se surgir um bloqueio externo genuíno, ex.: necessidade de uma credencial que decidiste não fornecer).
