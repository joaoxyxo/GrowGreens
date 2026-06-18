# GrowGreens — Especificação de UX/UI

Documento pronto a implementar. Português europeu. Mobile-first (PWA). Stack-alvo: Vue 3 + Tailwind.

---

## 1. Princípios de design e tom

**Tom de voz**
- **Encorajador, nunca culpabilizador.** Planta morreu? "Acontece a toda a gente. Vamos tentar outra vez — desta vez com um lembrete extra." Nunca "Falhaste."
- **Prático e concreto.** "Rega quando os 2 cm de cima do solo estiverem secos", não "mantenha humidade adequada".
- **Linguagem de principiante.** Evitar jargão; termo técnico inevitável → tooltip "?".
- **Português europeu**, tratamento por "tu" (estilo Duolingo, próximo).

**Princípios visuais**
1. Simples antes de bonito — uma ação primária clara por ecrã.
2. Mobile-first, thumb-first — ações principais na metade inferior; tab bar fixa.
3. Hábito > funcionalidade — o ecrã de abertura responde a "o que faço hoje?".
4. Progresso sempre visível, gamificação discreta (no header, não banner).
5. Localizado para Portugal — calendário por clima/zona, variedades comuns em PT.
6. Acessível por defeito — contraste AA, alvos ≥44px, leitor de ecrã, redução de movimento.
7. Offline-friendly — diário e lembretes funcionam sem rede.

---

## 2. Mapa de ecrãs / rotas

### Grupo A — Onboarding (fullscreen, sem tab bar)

| Rota | Ecrã |
|---|---|
| `/welcome` | Boas-vindas / valor |
| `/onboarding/objetivo` | Qual é o teu objetivo? |
| `/onboarding/espaco` | Onde vais cultivar? |
| `/onboarding/experiencia` | Nível de experiência |
| `/onboarding/local` | Região de Portugal |
| `/onboarding/conta` | Criar conta (adiável) |
| `/desafio` | Hub do desafio microgreens |
| `/desafio/dia/[n]` | Passo do dia (1–7) |

**`/welcome`** — comunicar valor em 5s. Ilustração de microgreens, headline "Da semente à colheita em 7 dias", botão "Começar o desafio", link "Já tenho conta".

**`/onboarding/*`** — personalizar sem fricção (cards grandes, barra de progresso, "Continuar" só ativo após escolha). Objetivo (comer saudável / poupar / hobby / ensinar filhos); Espaço (varanda / parapeito / quintal / interior); Experiência; Local (distrito → zona climática PT).

**`/onboarding/conta`** — conta adiável; pede-se antes de perder progresso.

### Grupo B — Desafio Microgreens

**`/desafio`** — hub dos 7 dias.
```
┌──────────────────────────────┐
│  Desafio Microgreens   🔥 3   │
│  Dia 4 de 7   ▓▓▓▓░░░  57%    │
├──────────────────────────────┤
│ ●─●─●─◉─○─○─○   (caminho)     │
├──────────────────────────────┤
│  [ Tarefa de hoje → ]         │  ← CTA primário
├──────────────────────────────┤
│  Foto do teu cultivo (timeline)│
└──────────────────────────────┘
```

**`/desafio/dia/[n]`** — uma micro-tarefa: ilustração → título → 2-4 passos → caixa "Dica" → "Marcar como feito" (+ foto). Ao concluir: confete subtil + "+10 XP" + próximo desbloqueado.

### Grupo C — App principal (com tab bar)

| Rota | Ecrã |
|---|---|
| `/` | Home / Dashboard |
| `/catalogo` | Catálogo + pesquisa/filtros |
| `/planta/[slug]` | Ficha de planta |
| `/jardim` | As minhas plantas |
| `/jardim/[id]` | Detalhe + diário |
| `/jardim/[id]/diario/novo` | Nova entrada |
| `/curso` | Curso (mapa de lições) |
| `/curso/licao/[id]` | Lição |
| `/saude` · `/saude/[slug]` | Saúde & Nutrição |
| `/calendario` | Calendário "o que semear" |
| `/perfil` | Perfil / definições |

**`/` Home** — responde a "o que faço hoje?". Saudação + streak/XP discretos, **tarefas de hoje** (regar/luz/lições), atalho "continuar lição", carrossel de plantas, teaser do calendário do mês.

**`/catalogo`** — pesquisa pegajosa, chips de filtro (Dificuldade, Espaço, Época para semear AGORA, Tempo até colheita, tipo), grelha 2 colunas. Filtro "Bom para semear este mês" (cruza com a região).

**`/planta/[slug]`** — hero foto, badges (dificuldade/época), factos rápidos (época, sol, rega, dias), secções expansíveis de passos, link para Saúde, botão "Adicionar à minha horta".

**`/jardim`** — cards com estado de rega ("Regar hoje"/"OK"/"Atrasada", colorido), idade, progresso. FAB "+ Adicionar". Estado vazio com CTA.

**`/jardim/[id]`** — foto+nome+idade, próxima tarefa, botões rápidos (Reguei/Adubei/Foto/Nota), **timeline de diário**, barra de fases (Sementeira → Crescimento → Colheita).

**`/curso`** — mapa vertical de lições (trilho serpenteante), unidades, nós concluído/atual/bloqueado, header com unidade e progresso.

**`/curso/licao/[id]`** — micro-aprendizagem (3-6 min): explicação → escolha múltipla → V/F → caso prático; barra de progresso; "Verificar" → feedback verde/encarnado; fim com resumo + XP.

**`/saude`** — cards por cultura com benefícios, filtro "para o quê?" (energia, digestão, imunidade), destaque das culturas que o utilizador já tem. Disclaimer não-médico no rodapé.

**`/calendario`** — seletor de mês, badge de região, três secções (Semear / Plantar / Colher), grelha anual opcional.

**`/perfil`** — avatar/nome, resumo de progresso (streak, XP, lições, plantas, conquistas), definições (região, notificações, unidades, tema, idioma, conta), gestão de dados (exportar/apagar), sobre/feedback.

---

## 3. Fluxos de utilizador chave

### Fluxo 1 — Primeiro uso + desafio microgreens
```
/welcome → "Começar o desafio"
  → objetivo → espaço → experiência → local (5 toques)
  → "Vamos cultivar microgreens em 7 dias. Precisas de: sementes, tabuleiro, água."
  → /desafio (Dia 1 desbloqueado)
  → /desafio/dia/1 → marcar feito → +10 XP, confete, streak=1
  → pede notificações: "Lembramos-te amanhã?"
  → (conta adiada) prompt suave no Dia 2 → ... Dia 7: celebração + badge "Primeira colheita"
  → CTA "Explora o catálogo" → /catalogo
```

### Fluxo 2 — Adicionar uma planta e acompanhar
```
/catalogo → filtro "semear este mês" → "Alface" → /planta/alface
  → "+ Adicionar à minha horta" → modal (data, onde, lembrete pré-preenchido) → Guardar
  → /jardim (card "Alface · dia 0")
  ... Home mostra "Regar a alface" → swipe/check
  → diário/novo → foto + nota → +5 XP → timeline avança
```

### Fluxo 3 — Fazer uma lição
```
Home "Continuar lição" / tab Curso → /curso (nó atual pulsa)
  → /curso/licao/12: explicação → múltipla escolha → V/F → caso prático
  → fim: "+15 XP · streak 🔥8" → próximo nó desbloqueia
```

### Fluxo 4 — Calendário "o que semear este mês"
```
Tab Calendário → "Semear agora" (região do perfil) → "Rúcula" → /planta/rucula → adicionar
  OU mudar mês ◀▶ / editar 📍região recalcula listas (sem GPS; escolha manual PT)
```

---

## 4. Navegação e arquitetura de informação

**Tab bar inferior (5 itens, fixa, ≥48px):**
```
🏠 Início   🌱 Horta   📚 Curso   🗓 Calendário   👤 Perfil
```
- **Horta**: catálogo acessível via botão "+ / Descobrir" dentro do separador (catálogo é nível 2, para manter 5 tabs).
- **Saúde & Nutrição**: não é tab — camada transversal, acedida via Home, ficha de planta, e Perfil.
- **Desafio**: fora da tab bar no onboarding; depois acessível em Início e Perfil → Conquistas.
- Hierarquia 3 níveis: tabs → listas/catálogo/calendário → fichas/detalhe/lição.
- **Desktop (≥768px):** tab bar → sidebar vertical; conteúdo centrado máx. 720px; catálogo 3-4 colunas.

---

## 5. Design system

### 5.1 Paleta (contraste AA, modo claro + escuro)

| Token | Hex | Uso |
|---|---|---|
| `green-50` | `#F0F7F0` | Fundos suaves, hover |
| `green-100` | `#DCEEDD` | Chips, badges suaves |
| `green-500` | `#3FA34D` | **Primária** (marca, botões) |
| `green-600` | `#2F8A3C` | Primária hover/active |
| `green-700` | `#246B2F` | Texto em fundo claro, ênfase |
| `earth-500` | `#8B5E3C` | Acento "terra" (secundário) |
| `earth-100` | `#EFE3D8` | Fundos de secção "solo" |
| `sun-400` | `#F4B740` | **XP / amarelo** |
| `flame-500` | `#F2682C` | **Streak / laranja** |
| `sky-400` | `#4FB0E5` | Rega / água |
| `success` | `#3FA34D` | Confirmações |
| `error` | `#D64545` | Erros, planta atrasada |
| `warning` | `#E5A33D` | Avisos |
| `neutral-900` | `#1C2A1E` | Texto principal |
| `neutral-600` | `#5B6B5E` | Texto secundário |
| `neutral-200` | `#E3E8E3` | Bordas, divisórias |
| `neutral-50` | `#FAFBFA` | Fundo (claro) |
| `dark-bg` | `#10160F` | Fundo (escuro) |
| `dark-surface` | `#1A231A` | Cards (escuro) |

Significado fixo por cor: **verde=sucesso/marca, laranja=streak, amarelo=XP, azul=água/rega, encarnado=erro/atraso, terra=secundário/solo**.

### 5.2 Tipografia
- Corpo/UI: `Inter` (fallback system-ui). Display: `Plus Jakarta Sans` (opcional). Números tabulares para streaks/XP.

| Token | Tamanho | Uso |
|---|---|---|
| `text-display` | clamp(1.75rem, 5vw, 2.5rem) | Hero |
| `text-h1` | 1.5rem / 700 | Título de ecrã |
| `text-h2` | 1.25rem / 600 | Secções |
| `text-body` | 1rem / 400, lh 1.5 | Corpo (mín. 16px) |
| `text-sm` | 0.875rem | Secundário |
| `text-xs` | 0.75rem | Captions, tab labels |

### 5.3 Espaçamento e raio
Escala 4px. Margens de ecrã `px-4`. Gap entre cards `gap-3`. Raio: cards `rounded-2xl` (16px), botões `rounded-xl` (12px), chips `rounded-full`. Sombras subtis (`shadow-sm`), profundidade por cor de superfície.

### 5.4 Componentes-base
- **Botões** — Primário `bg-green-500 text-white rounded-xl py-3 px-5 font-semibold w-full`; Secundário `border border-green-500 text-green-700`; Ícone ≥44×44; estados hover/active/disabled/loading.
- **Card de planta** — foto `aspect-square rounded-t-2xl`, nome, badge dificuldade, linha de estado de rega colorida.
- **Progress/Streak** — barra `h-2 rounded-full`; streak `🔥 7` (flame-500); XP `⭐ 120` (sun-400) com animação.
- **Badges/Conquistas** — medalha circular, conquistado (cor) vs bloqueado (cinza); grelha 3 col. no perfil.
- **Formulários** — inputs `rounded-xl border focus:ring-2 focus:ring-green-500`; label sempre visível; chips de seleção; foto com preview; erro inline.
- **Estados** — Vazio (ilustração + frase + CTA); Loading (skeletons); Erro (mensagem amável + "Tentar de novo"; offline → banner "Sem ligação — guardamos e sincronizamos depois"); Sucesso (toast verde, micro-confete em marcos).
- **Tab bar** — `fixed bottom-0 bg-white/90 backdrop-blur border-t`, ativo `text-green-600`, `safe-area-inset-bottom`.

### 5.5 Tokens Tailwind
```js
theme: { extend: {
  colors: {
    green: { 50:'#F0F7F0',100:'#DCEEDD',500:'#3FA34D',600:'#2F8A3C',700:'#246B2F' },
    earth: { 100:'#EFE3D8',500:'#8B5E3C' }, sun:{400:'#F4B740'},
    flame:{500:'#F2682C'}, sky:{400:'#4FB0E5'},
    neutral:{50:'#FAFBFA',200:'#E3E8E3',600:'#5B6B5E',900:'#1C2A1E'},
    dark:{bg:'#10160F',surface:'#1A231A'},
    success:'#3FA34D', error:'#D64545', warning:'#E5A33D',
  },
  borderRadius:{ xl:'12px','2xl':'16px' },
  fontFamily:{ sans:['Inter','system-ui','sans-serif'], display:['Plus Jakarta Sans','serif'] },
}}
// darkMode: 'class'
```
Componentes Vue: `BaseButton`, `PlantCard`, `ProgressBar`, `StreakChip`, `XpCounter`, `Badge`, `Chip`, `EmptyState`, `LessonNode`, `DiaryEntry`, `TabBar`.

---

## 6. Gamificação no UI (discreta)

A gamificação **nunca rouba o lugar à tarefa real** (lição da crítica à Planta). Streak e XP no header, pequenos.
- **Streak 🔥** — dias seguidos com ≥1 ação. Streak freeze (1/semana grátis). Mensagem de perdão, nunca culpa.
- **XP ⭐** — recompensa variável (10-20) por lições/desafio/primeira foto/rega. Animação de incremento.
- **Conquistas** — marcos reais ("Primeira colheita", "7 dias de rega", "5 plantas vivas há 30 dias"). Grelha no Perfil.
- **Progresso** — barras de curso e de cultura. **Caminho/trilho** no Curso e Desafio.
- **Sem leaderboards** no MVP (jardinagem ≠ competição). Cada elemento de jogo mapeia a um comportamento desejado.

---

## 7. Acessibilidade e responsividade

**Acessibilidade:** contraste AA; nunca cor sozinha (estado de rega = cor + ícone + texto); alvos ≥44px; corpo ≥16px; `prefers-reduced-motion`; HTML semântico, `<button>` reais, labels, `aria-live` para toasts/XP, foco visível; teclado completo; alt-text nas fotos.

**Responsividade:** base (mobile, coluna única, tab bar, catálogo 2 col.) → md (sidebar, máx. 720px, catálogo 3 col., ficha foto+factos lado a lado) → lg (catálogo 4 col., calendário anual expandido). PWA instalável, `safe-area-inset`, offline, imagens responsivas, `font-display: swap`.

---

## Comparação (apps líderes) e tendências
- **Planta** — força no onboarding curto com ícones e lembretes inteligentes (adotado); fraqueza no topo auto-scroll distrativo (corrigido com Home focada em "tarefas de hoje").
- **Duolingo** — trilho de lições, streak com freeze, XP variável, cores com significado fixo, conta adiada (tudo adotado).
- **From Seed to Spoon** — datas por localização, diário com fotos, "o que plantar agora" (adotado e localizado PT por região manual).
- **Tendências 2025/26** — modo escuro de primeira classe, accent vibrante, profundidade por luminância e bordas subtis, tipografia fluida (clamp).

### Fontes
- [Design Critique: Planta's iOS app — Medium](https://medium.com/@harshitadandu07/design-critique-plantas-ios-app-89b9b09bb377)
- [Duolingo UX Design Breakdown: 12 Patterns (2026) — 925 Studios](https://www.925studios.co/blog/duolingo-design-breakdown)
- [Duolingo's Gamification Secrets — Orizon](https://www.orizon.co/blog/duolingos-gamification-secrets)
- [From Seed to Spoon — App Highlights](https://www.seedtospoon.net/app/)
- [Mobile App Design Trends 2026 — Muzli](https://muz.li/blog/whats-changing-in-mobile-app-design-ui-patterns-that-matter-in-2026/)
- [UI Design Trends 2026 — Tubik](https://blog.tubikstudio.com/ui-design-trends-2026/)
