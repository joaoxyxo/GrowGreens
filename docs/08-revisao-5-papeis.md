# GrowGreens — Revisão por 5 Papéis + Registo de Implementação

> Olhar para a app a partir de 5 perspetivas, do mais especialista ao mais leigo, com as 5 melhorias-chave de cada uma. No fim, o que foi **implementado autonomamente** nesta iteração e o que ficou **dependente do utilizador** (chaves/credenciais).
>
> **Versão:** 1.0 · **Data:** junho 2026

---

## 1. Engenheiro de software sénior

1. Ativar a sincronização cloud (Supabase) — sem ela, mudar de dispositivo perde tudo. *(depende de credenciais)*
2. Service worker com Background Sync e fila de escritas para nunca perder ações offline.
3. Cobertura de testes de componentes + correr o E2E (Playwright) no CI.
4. Telemetria anónima e local (funil de onboarding, conclusão do desafio).
5. Orçamento de performance + gate Lighthouse PWA no CI.

## 2. Agrónomo / horticultor

1. Catálogo até ~40 culturas, com variedades regionais portuguesas.
2. Diagnóstico real de problemas (ativar IA), com foco nos fungos do litoral. *(depende de chave)*
3. Rotação e sucessão de culturas no planeador.
4. Calendário afinado por microclima (orientação solar, altitude).
5. Consociação ativa no plano (✓ bons vizinhos, ⚠️ maus vizinhos).

## 3. Designer de produto / UX

1. Fotos reais das plantas (em vez de emojis).
2. Momento "uau" partilhável no fim do desafio.
3. Onboarding que recomenda 3 plantas para o espaço/estação.
4. Linha do tempo visual das fotos de cada planta.
5. Notificações com contexto e personalidade.

## 4. Hobbyista de jardinagem

1. Lista de compras gerada a partir do plano da horta.
2. Registo de colheitas com quantidades + resumo da época.
3. Guias de multiplicação (estacas, guardar sementes).
4. Comunidade leve (ver o que outros semeiam na região). *(depende de backend)*
5. Painel anual "a minha época".

## 5. Principiante absoluto (o mais "noob")

1. Um botão claro **"O que faço hoje?"** com uma única ação.
2. Kit de arranque explicadíssimo (o que comprar, onde, quanto custa).
3. "Será que matei a planta?" em linguagem simples.
4. Glossário a pedido para palavras esquisitas.
5. Tom de "não faz mal falhar" + sugerir uma planta fácil.

---

## Implementado nesta iteração (sem depender do utilizador)

| Melhoria | Papel | Onde |
|---|---|---|
| **Recomendação de plantas** (espaço/estação/região) | UX #3 | Início → "Sugeridas para ti" |
| **Cartão de colheita partilhável** | UX #2 | Desafio → fim |
| **Linha do tempo de fotos** da planta | UX #4 | Ficha da planta na horta |
| **Notificações com contexto** | UX #5 | Início (ao abrir) |
| **Consociação ativa no plano** (✓/⚠️ vizinhança) | Agro #5 | Editor de espaço |
| **Lista de compras a partir do plano** | Hobby #1 | Plano da horta |
| **Histórico de colheitas** | Hobby #2 (parcial) | Horta |
| **Hero "O que faço hoje?"** | Noob #1 | Início (topo) |
| **Resolução por sintomas (sem IA)** | Noob #3 | "A minha planta não está bem" |
| **Glossário** | Noob #4 | Perfil → Glossário |
| **Fluxo encorajador ao perder uma planta** + sugestão fácil | Noob #5 | Ficha da planta na horta |
| **Proteção de sequência (streak freeze) + revisão espaçada** | Eng/UX | Curso e Perfil |
| **Coerência de zonas no calendário** | Agro #4 (parcial) | Calendário |

Todas verificadas com as condições de entrega: typecheck sem erros · **28 testes** a passar · build de produção com PWA · ESLint sem erros.

## Deixado em segundo plano (depende do utilizador)

- **Sincronização cloud** (Eng #1) e **comunidade** (Hobby #4) — exigem projeto Supabase + credenciais. Código pronto, por ativar.
- **Diagnóstico por foto com IA** (Agro #2) — exige chave Kindwise/OpenAI. Edge function pronta; a app já oferece a alternativa por sintomas.

## Trabalho de conteúdo em aberto (não depende de chaves, mas é volume)

- **Catálogo até ~40 culturas + variedades regionais** (Agro #1) e **completar o currículo** — tarefa #28. É produção de conteúdo extensa; recomenda-se fazer por lotes com revisão de qualidade.
- **Fotos reais** (UX #1) — exige escolher e licenciar imagens (Wikimedia Commons CC); decisão de assets a tomar deliberadamente.

## Próximos candidatos de maior impacto

1. **Catálogo + fotos reais** (transformam a perceção de completude).
2. **Ativar cloud + IA** quando houver credenciais.
3. **Registo de colheitas com quantidades + resumo da época** (fecha o ciclo do hobbyista).
