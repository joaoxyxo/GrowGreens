# Especificação de Conteúdo e Currículo — GrowGreens

**Versão:** 1.0 (MVP-ready) · **Idioma:** Português europeu · **Contexto:** Portugal litoral atlântico (Ovar/Aveiro) · **Público:** principiantes absolutos · **Formato:** percurso tipo Duolingo (PWA)

---

## 0. Princípios orientadores

1. **Aprender a fazer, não só a ler.** Cada lição termina com uma ação real ou decisão prática.
2. **Vitórias fáceis primeiro.** Primeiras unidades dão sucesso garantido (microgreens, rega, germinação em copo) antes de pedir paciência (tomate, sucessão).
3. **Lições curtas (3-5 min).**
4. **Repetição espaçada de conceitos** (rega "dedo no solo", drenagem, luz, endurecimento) reaparecem deliberadamente.
5. **Ritmo da natureza ≠ ritmo da app.** Distinguir *lições de conhecimento* (a qualquer momento) de *missões de cultivo* (esperam dias/semanas). A gamificação respeita esta dualidade — não penalizar o utilizador por "não fazer nada" enquanto a planta cresce.

---

## 1. Arquitetura pedagógica

### 1.1 Hierarquia
```
PERCURSO (caminho vertical)
└── UNIDADE (tema coeso, 4-7 lições, cor/ícone próprios)
     └── LIÇÃO (1 micro-objetivo, 3-5 min, 5-8 passos)
          └── PASSO (1 ecrã: ensinar OU verificar OU agir)

Camadas paralelas:
MISSÕES DE CULTIVO (tarefas reais, ligadas ao calendário e temporizadores)
FICHAS (referência consultável: planta + saúde) — biblioteca, não lições
```

### 1.2 Anatomia de uma lição (5-8 passos)
| # | Tipo | Função | Duração |
|---|---|---|---|
| 1 | Gancho | porque importa | 5s |
| 2 | Conceito A | ensinar | 30s |
| 3 | Verificação A | quiz | 15s |
| 4 | Conceito B | ensinar | 30s |
| 5 | Verificação B | quiz/arrastar/ordenar | 15s |
| 6 | Mito vs Facto *(opc.)* | desfazer crença errada | 20s |
| 7 | Resumo | 2-3 bullets | 10s |
| 8 | Ação/Compromisso | "vais fazer isto" / desbloqueia missão | 10s |

Regra de ouro: **nunca mais de 2 conceitos novos por lição.**

### 1.3 Tipos de interação (paleta reutilizável)
Cartão de conceito · escolha múltipla · verdadeiro/falso · arrastar para ordenar · associar · toca no erro (sobre imagem) · deslizador de decisão · foto-tarefa (diário/prova) · compromisso (ativa lembrete).

### 1.4 Ritmo
Lição de conhecimento 3-5 min (5-8 passos). Sessão diária 1-2 lições (~5-10 min). Missão de cultivo: ação real 1-15 min + check-in 30s.

### 1.5 Repetição espaçada
**A) Revisão de conceitos:** conceitos "core" entram em fila e reaparecem como mini-quiz em intervalos crescentes (~+2 dias, +1 semana, +3 semanas). Core: teste do dedo (rega), drenagem, sol pleno vs meia-sombra, endurecimento, consociação.
**B) Revisão em espiral:** o mesmo conceito reaplicado em contexto novo (rega na U2 → tomate na U7 → gestão de fungos na U9), aprofundando.

### 1.6 Quizzes, checkpoints e provas práticas
- Verificação intra-lição (erro → explicação, não punição).
- Checkpoint de fim de unidade (5 perguntas, ≥4/5 dá XP bónus + selo).
- **Prova prática (diferenciador):** evidência real ao fim de unidades-chave — foto da colheita (U1), foto de rebento (U3), primeiro fruto/transplante (U7). Dá a conquista mais valiosa e é partilhável.

---

## 2. Currículo completo

**10 unidades base + 3 avançadas + faixa sazonal contínua.** (★) = dispara/alimenta missão de cultivo real.

### U0 — Bem-vindo (3 lições)
L0.1 O que vais conseguir fazer · L0.2 Tens espaço para isto? · L0.3 O teu primeiro objetivo

### U1 — Desafio Microgreens (7 dias) (6 lições)
L1.1 O que são e porque começamos aqui · L1.2 Kit mínimo (★) · L1.3 Escolher a semente · L1.4 Semear hoje (★ inicia o desafio) · L1.5 Cuidar dia a dia · L1.6 Colher e comer (prova prática)

### U2 — A Semente e a Água (5 lições)
L2.1 O que há dentro de uma semente · L2.2 O que precisa para acordar · L2.3 Regar sem matar: teste do dedo *(core)* · L2.4 Excesso de água: o erro nº1 · L2.5 Checkpoint

### U3 — Germinar em Casa (5 lições)
L3.1 Germinar feijão num frasco (★) · L3.2 Vasos, copos e furos: drenagem *(core)* · L3.3 Substrato vs terra do jardim · L3.4 Tabuleiro/alvéolos vs sementeira direta (★) · L3.5 Prova prática: primeiro rebento

### U4 — A Luz e o Lugar (5 lições)
L4.1 Porque precisam de luz (luz = comida) · L4.2 Sol pleno/meia-sombra/sombra *(core)* · L4.3 Orientação da varanda/janela (★) · L4.4 Sinais de pouca luz · L4.5 Checkpoint

### U5 — O Solo Vivo (5 lições)
L5.1 O solo é vivo · L5.2 Três tipos de solo + teste do punhado · L5.3 Drenagem e retenção (clima húmido) · L5.4 N-P-K simples · L5.5 Checkpoint

### U6 — As Fases de Crescimento (5 lições)
L6.1 As 5 fases · L6.2 Cotiledonares vs folhas verdadeiras · L6.3 Transplantar sem traumatizar (★) · L6.4 Endurecer (hardening-off) *(core)* · L6.5 Prova prática: identifica a fase

### U7 — A Primeira Horta de Verdade (7 lições)
L7.1 As 5 plantas mais fáceis em PT · L7.2 Alface e folhas de corte (★) · L7.3 Rabanete: colheita rápida (★) · L7.4 Aromáticas no parapeito (★) · L7.5 Tomate de varanda (★) · L7.6 Calendário de Ovar/Aveiro *(sazonal)* · L7.7 Checkpoint

### U8 — Consociação (4 lições)
L8.1 O que é e porque funciona *(core)* · L8.2 Pares clássicos · L8.3 Plantas que repelem pragas · L8.4 Maus vizinhos

### U9 — Pragas e Fungos no Clima Atlântico (6 lições)
L9.1 Porque o clima húmido favorece fungos · L9.2 Míldio · L9.3 Oídio (pó branco) · L9.4 Afídeos, lesmas, mosca-mineira · L9.5 Defesa biológica primeiro · L9.6 Prova prática: diagnostica esta folha

### U10 — Compostagem (5 lições)
L10.1 Porque compostar · L10.2 Verdes e castanhos *(core)* · L10.3 O que pôr/nunca pôr · L10.4 Pequeno espaço/vermicompostagem · L10.5 Usar o composto (★)

### Avançadas
**U11 — Sucessão e Rotação** (5): sucessão · rotação · famílias · planear um ano (★) · checkpoint.
**U12 — Sementes Próprias** (4): guardar sementes · secar/armazenar · estacas e divisão · trocar na comunidade.
**U13 — Horta Resiliente o Ano Inteiro** (5): proteger do vento/chuva · inverno em Aveiro · mulching · água inteligente · prova prática final.

### Faixa sazonal contínua
"Este mês em Ovar/Aveiro": cápsula mensal (1) semear, (2) colher, (3) alerta do mês (ex.: "Setembro húmido → atenção ao míldio no tomate"). Alimenta lembretes.

---

## 3. Estrutura de uma "Ficha de Planta" (template)
```
1. CABEÇALHO — foto, dificuldade ●○○, tempo até colheita, espaço, etiqueta "Boa para começar"
2. EM 30 SEGUNDOS — 3 bullets para quem tem pressa
3. QUANDO SEMEAR (Ovar/Aveiro) — mini-calendário 12 meses + sementeira direta/alvéolo + nota húmida
4. PASSO A PASSO POR FASE — semear, germinação, crescimento, floração/frutificação, colheita (1-2 frases + 1 ação)
5. REGA · LUZ · SOLO — três medidores rápidos
6. PRAGAS E DOENÇAS — 2-3 ameaças mais prováveis cá + prevenção biológica
7. CONSOCIAÇÃO — bons/maus vizinhos
8. COLHEITA E CONSERVAÇÃO
9. BENEFÍCIOS DE SAÚDE — liga à ficha de saúde do grupo
10. RECEITAS ASSOCIADAS — 1-2 receitas portuguesas simples
11. ERRO MAIS COMUM — caixa de aviso destacada
```

Exemplo (excerto, Rabanete):
> **EM 30 SEGUNDOS** — É a colheita mais rápida que vais ter: em 3-4 semanas estás a comer. Adora sol, não gosta de calor a mais. Se ficar muito tempo no solo, fica picante e duro.
> **ERRO MAIS COMUM** — Semear muito junto. Sem espaço, faz folha e não faz raiz. Deixa pelo menos 3 dedos entre cada um.

---

## 4. Fichas de Saúde / Nutrição (5 grupos)

**Template:** 1) O que inclui · 2) Porque faz bem (simples) · 3) Nutrientes principais (nutriente → o que faz → exemplo) · 4) Como tirar mais proveito (cru vs cozinhado, combinações) · 5) Quem deve ter atenção (prudência) · 6) Fresco vs comprado · 7) Ideia rápida na cozinha.

| Grupo | Plantas-tipo | Ângulo nutricional |
|---|---|---|
| Folhas verdes | alface, rúcula, espinafre, acelga | Fibra, folato, vit. K, hidratação |
| Brássicas | couve, brócolos, rabanete, mostarda | Glucosinolatos, vit. C; cru vs cozinhado; nota tiroide |
| Frutos/Tomate | tomate, pimento, courgette, beringela | Licopeno (cozinhado), vit. C |
| Leguminosas | feijão, ervilha, fava | Proteína vegetal, fibra, fixação de azoto |
| Aromáticas | manjericão, salsa, hortelã, alecrim | Antioxidantes, sabor sem sal |

Exemplo (excerto, Frutos/Tomate):
> **COMO TIRAR MAIS PROVEITO** — O tomate tem um antioxidante chamado licopeno. O teu corpo absorve-o melhor quando o tomate é cozinhado com um fio de azeite. Por isso um molho caseiro pode ser ainda mais útil que o tomate cru — sem deixares de comer os dois.

---

## 5. Desafio Microgreens — guião dia a dia (7 dias)

> **Cultura MVP:** rabanete ou rúcula/mostarda (germinação rápida, sem blackout obrigatório, ~7-10 dias). Ervilha/girassol = "nível 2". Cada dia: **MOSTRAR · DIZER · PEDIR · AVISO**.

**DIA 0 — Semear (liga à L1.4)** — *Mostrar:* tabuleiro raso, substrato húmido, sementes uniformes. *Dizer:* "Não enterras — espalhas por cima do substrato húmido, juntas mas sem pilha. Carrega de leve." *Pedir:* tapar (escuro 2-3 dias) + peso leve; foto; ativar lembrete. *Aviso:* "Sementes a mais apodrecem."

**DIA 1 — Paciência e humidade** — ainda tapado, nada visível (normal). Borrifar se seco; não regar a mais. *Aviso:* humidade a mais convida bolor.

**DIA 2 — Primeiros sinais** — raízes brancas, "cotonete" branco. *Dizer:* "Aquele pelo branco à volta das raízes é normal, não é bolor." *Aviso (importante):* raiz = pelos agarrados a cada raiz que desaparecem ao humedecer; bolor = teias brancas/cinzentas por cima das sementes com cheiro a mofo. Na dúvida: mais ar, menos água.

**DIA 3 — Destapar e dar luz** — 90% levantadas, caules pálidos. *Dizer:* "Hora de destapar! Estão amarelas porque estiveram no escuro — em 1-2 dias ficam verdes." *Pedir:* parapeito com luz (sem sol direto forte); rega pela base. *Aviso:* se a maioria não levantou, espera +1 dia tapado.

**DIA 4 — A ficar verde** — caules a endireitar, cotilédones a verdejar. Rodar o tabuleiro; rega pela base de manhã; foto. *Aviso:* caules compridos/tombados = pouca luz.

**DIA 5 — Quase lá** — tapete denso 3-5 cm. Manter rega pela base, verificar humidade. *Aviso:* pontos amarelos/cheiro azedo = água parada na base; reduzir rega + arejar.

**DIA 6 — Pronto a colher (janela)** — cotilédones abertos, primeiras folhas verdadeiras a despontar. Decidir: colher já ou +1 dia. *Aviso:* não deixar passar muitos dias (fibrosas/amargas).

**DIA 7 — Colher e comer (prova prática U1)** — corte rente ao substrato. **Foto da colheita** → conquista "Primeira Colheita" + selo U1. Pergunta "onde usaste?". *Aviso:* microgreens não voltam a crescer — semeia tabuleiro novo.

**Pós-desafio:** propor já um segundo tabuleiro (sucessão) e ligar à U2 — transformar vitória em hábito.

---

## 6. Gamificação e retenção (ligadas ao conteúdo)

Princípio: **gamificar sem mentir sobre a biologia.** Não inventar urgência onde a planta precisa de dias.
- **Streak "horta-aware":** conta por dia com atividade — lição **ou** check-in de missão **ou** foto/diário. Nos dias de espera, o **check-in de 30s conta** ("Espreitei as plantas: tudo bem"). Streak freeze para dias maus.
- **XP e níveis:** lições, checkpoints, missões reais (XP maior), provas práticas (XP máximo). **Bónus de revisão espaçada.** Níveis: Semente → Rebento → Plântula → Hortelão → Mestre-Hortelão.
- **Conquistas:** sempre amarradas a marcos reais ("Primeira Colheita", "Sem afogar ninguém", "Mão verde", "Caçador de míldio", "Compostador", "Ano cheio"). Partilháveis = aquisição orgânica.
- **Lembretes inteligentes** (o motor de retenção real): ligados a conteúdo e tempo biológico — "Dia 3 — hora de destapar!", "Não chove há 4 dias em Aveiro — confere a rega", lembrete sazonal mensal. Frequência controlável.
- Pós-MVP: ligas/amigos, missões semanais, diário-timeline de fotos.

| Mecânica | Liga a | Objetivo |
|---|---|---|
| Streak | check-ins + lições | hábito diário |
| XP de revisão | conceitos-core espaçados | retenção |
| Prova prática + badge | fins de unidade-chave | transferir para o real |
| Lembretes | fases de missões + faixa sazonal | voltar no momento certo |

---

## 7. Plano de produção de conteúdo

**Templates mestres** (definir cedo, separar conteúdo de UI): Template de Lição (8 tipos de passo) · Template de Ficha de Planta (11 secções) · Template de Ficha de Saúde (7 secções) · Glossário de termos simplificados ("luz = comida", "endurecer = habituar ao exterior").

**MVP:** U0, U1 + guião 7 dias, U2, U3, U4, U7 parcial (L7.1 + 5 plantas fáceis + faixa "Este mês"); 5 fichas de planta (rabanete, alface, rúcula, manjericão, tomate); 2 fichas de saúde (Folhas verdes, Aromáticas); gamificação core (streak horta-aware, XP, 4 conquistas, lembretes do desafio).
**Fase 2:** U5, U6, resto U7, U8, U9; +6 fichas de planta; +3 fichas de saúde; revisão espaçada completa.
**Fase 3:** U10-U13; ligas/social; diário.

**Ordem de produção:** 1) templates+glossário+tom; 2) faixa sazonal Ovar (alimenta tudo); 3) U1 + microgreens (testar com utilizadores cedo); 4) fundamentos U2-U4; 5) fichas de planta MVP; 6) fichas de saúde MVP; 7) gamificação; 8) iterar com dados de conclusão/streak.

**Regras de qualidade:** teste dos 5 min + teste da ação (terminar em algo concreto); afirmações de saúde factuais e não-clínicas; tudo localizado ao litoral atlântico; conceitos-core escritos uma vez (single source of truth).

---

## Fontes
- [The Duolingo Method (whitepaper)](https://duolingo-papers.s3.amazonaws.com/reports/Duolingo_whitepaper_duolingo_method_2023.pdf)
- [Dear Duolingo: spaced repetition](https://blog.duolingo.com/spaced-repetition-for-learning/)
- [Microlearning & Gamification Guide (2026)](https://www.studyunicorn.com/blogs/microlearning-and-gamification-complete-strategic-guide)
- [Duolingo's Gamification Secrets — Orizon](https://www.orizon.co/blog/duolingos-gamification-secrets)
- [Microgreens Growing Timeline — City Cultivator](https://www.citycultivator.com/microgreens-growing-timeline/)
- [Microgreens and Blackout Dome — Bootstrap Farmer](https://www.bootstrapfarmer.com/blogs/microgreens/microgreens-and-when-to-to-use-a-blackout-dome)
- [Calendário da Horta por Regiões — Hortas Biológicas](https://www.hortasbiologicas.pt/calendario-da-horta-por-regioes-em-portugal/)
- [Como combater o Míldio — Hortas Biológicas](https://www.hortasbiologicas.pt/como-combater-o-mildio-na-horta/)
- [Oídio na horta — Hortas Biológicas](https://www.hortasbiologicas.pt/oidio-na-horta-como-prevenir-e-tratar/)
