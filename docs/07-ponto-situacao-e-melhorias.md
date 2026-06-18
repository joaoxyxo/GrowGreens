# GrowGreens — Ponto de Situação e 50 Melhorias

> **Nota:** muitos dos pontos P1/P2 abaixo já foram implementados desde esta revisão (lembretes .ics, edição de plantas, compressão de fotos, streak freeze, revisão espaçada, coerência de zonas, etc.) e novas funcionalidades foram adicionadas (planeador de horta, glossário, resolução por sintomas, recomendações, cartão partilhável). Ver **[`08-revisao-5-papeis.md`](08-revisao-5-papeis.md)** para o estado mais recente. A tarefa de conteúdo #28 (catálogo ~40 + currículo) continua em aberto.

> Revisão crítica feita lendo o código real e confrontando-o com a documentação (`docs/00`–`06`) e com a experiência de um utilizador a testar a app.
>
> **Versão:** 1.0 · **Data:** junho 2026 · **Base:** código atual na pasta do projeto

---

## 1. Metodologia

Três lentes: (1) **auditor** — o que os documentos prometem foi implementado? (2) **testador** — os fluxos funcionam e fazem sentido a usar? (3) **revisor de conteúdo** — a informação agronómica e nutricional está correta e suficiente? As afirmações abaixo foram verificadas no código (contagens e presença de campos confirmadas por inspeção).

---

## 2. Documentado vs. Implementado (auditoria)

| Área | Documentado | Implementado | Estado |
|---|---|---|---|
| Plataforma PWA Vue 3 + TS + Tailwind + Dexie | Sim | Sim | ✅ |
| Local-first offline, sem login | Sim | Sim | ✅ |
| Desafio microgreens 7 dias | Sim | Sim (guião dia a dia, fotos, XP) | ✅ |
| Catálogo de plantas | "~40 culturas" (contrato) | **~20 culturas** | ⚠️ parcial |
| Curso | "13 unidades" (doc 03) | **5 unidades / 12 lições** | ⚠️ parcial |
| Zonas climáticas | 3 (litoral norte, interior, sul) | 3 selecionáveis, **calendário só para litoral norte** | ❌ incoerente |
| Saúde/nutrição (5 grupos) | Sim | Sim | ✅ |
| Receitas PT | Sim | 7 receitas | ✅ |
| Calendário localizado + IPMA | Sim | Sim (litoral norte) | ⚠️ ver zonas |
| Diagnóstico IA (stub) | Sim | Sim (ecrã + guia) | ✅ |
| Cloud Supabase (migrations+RLS+functions, desativado) | Sim | Sim | ✅ |
| Legal/RGPD + disclaimer saúde | Sim | Sim | ✅ |
| Gamificação: XP, streak, conquistas | Sim | Sim | ✅ |
| **Streak freeze** | Sim (doc 03) | **Não** | ❌ em falta |
| **Repetição espaçada no curso** | Sim (doc 03) | **Não** | ❌ em falta |
| **Lembretes por notificação / export .ics** | Sim (doc 01) | **Só lista in-app** | ❌ em falta |
| **Compressão de fotos antes de guardar** | Sim (doc 01) | **Não** (guarda Blob bruto) | ❌ em falta |
| **Teste E2E (Playwright)** | Sim (contrato) | **Não** (só 17 testes unitários) | ❌ em falta |
| i18n (strings isoladas) | Sim (doc 01) | Configurado mas **strings hardcoded** | ⚠️ parcial |

**Conclusão da auditoria:** o núcleo funcional está sólido e honesto, mas há um conjunto claro de promessas dos documentos ainda por cumprir — sobretudo profundidade de catálogo/curso, coerência das zonas, e funcionalidades de retenção (streak freeze, repetição espaçada, lembretes reais).

### Pequenas correções factuais
- A app tem **12 lições** (não 14, como referi numa mensagem anterior) e **7 receitas**.
- O catálogo tem **~20 plantas** curadas.

---

## 3. Avaliação crítica por área (testador)

**Desafio microgreens.** Sólido e motivador. Dois problemas: (a) o guião é genérico, otimizado para rabanete — se o utilizador escolher **ervilha ou girassol**, não recebe a instrução de **demolha (8–12h)** que essas variedades exigem, nem o blackout mais longo; (b) os dias estão bloqueados pelo tempo real (um dia por dia) — bom para realismo, mas frustra quem quer explorar/testar e não há mensagem a explicar porquê.

**Catálogo e ficha de planta.** A ficha é rica, mas **deita fora muita informação que já está nos dados**: não mostra `dias até germinar`, `profundidade de sementeira`, `espaçamento`, `intervalo de pH`, `horas de sol mínimas` nem o campo `expectations` (expectativas realistas). São dados que o utilizador principiante precisa na prática.

**Zonas climáticas.** O utilizador pode escolher "Interior Norte" ou "Litoral Sul" no onboarding e no perfil, mas **o calendário fica vazio** e o filtro "semear este mês" não devolve nada para essas zonas. Isto parece um bug ao utilizador. Ou se preenchem as zonas, ou se esconde a escolha até existirem dados.

**Horta e diário.** Funciona bem. Falta poder **editar** uma planta depois de criada (mudar o intervalo de rega ou o nome) e **concluir lembretes a partir da lista da horta** (só dá no Início).

**Lembretes.** São apenas uma lista in-app — **não há notificação real nem export para calendário**. O botão "Ativar" no perfil pede permissão mas nunca dispara nada. Para uma app cujo motor de retenção é a rega, isto é uma lacuna central.

**Curso.** Os quizzes funcionam e o feedback é bom. Falta a **repetição espaçada** prometida e há poucas lições (12) face às 13 unidades planeadas.

**Fotos.** Guardadas como Blob bruto no IndexedDB — algumas fotos de telemóvel ocupam vários MB; sem compressão, o armazenamento local enche depressa.

---

## 4. Confronto do conteúdo (revisor)

O conteúdo agronómico está, no geral, **correto e bem calibrado** para o clima atlântico (épocas, foco anti-fungo, toxicidade do alho/cebola para animais, folhas de tomate tóxicas, germinação lenta da salsa e da cenoura). Pontos a melhorar:

- **Microgreens por variedade:** o guião não adapta demolha/blackout à variedade escolhida (ver acima).
- **Morango (perene):** `daysToHarvest` (90–120) é enganador para uma perene que produz na época seguinte — devia explicar-se melhor.
- **Falta de fontes na app:** o conteúdo de saúde tem disclaimer, mas não cita fontes; ganharia credibilidade com referências (estão nos docs, não na app).
- **Sem aviso sazonal dinâmico:** a "faixa do mês" (ex.: "setembro húmido → atenção ao míldio") está nos docs mas não aparece na app.

---

## 5. As 50 melhorias

Prioridade: **P1** (essencial para robustez/coerência), **P2** (completude e qualidade de uso), **P3** (nice-to-have / futuro).

### Coerência documentação ↔ implementação
1. **(P1)** Preencher o calendário para as zonas "Interior Norte" e "Litoral Sul", ou desativar a escolha dessas zonas até haver dados.
2. **(P1)** Ajustar os documentos (00/03/06) aos números reais (≈20 plantas, 12 lições) ou implementar o que falta — eliminar a divergência.
3. **(P2)** Expandir o catálogo para ~40 culturas (faltam, p.ex., couve-flor, repolho, batata, malagueta, beringela, pepino, abóbora, fava, grão, acelga, agrião, coentros, tomilho, orégãos, cebolinho).
4. **(P2)** Completar o currículo para as 13 unidades planeadas (solo, fases, primeira horta, compostagem, sucessão/rotação, etc.).
5. **(P2)** Implementar a **faixa sazonal "Este mês em Ovar/Aveiro"** com o alerta do mês, como previsto no doc 03.

### Profundidade de conteúdo (mostrar o que já temos)
6. **(P1)** Mostrar na ficha de planta os campos já existentes: dias até germinar, profundidade de sementeira, espaçamento, pH, horas de sol mínimas.
7. **(P1)** Mostrar o campo **`expectations`** (expectativas realistas) na ficha — combate diretamente a desistência.
8. **(P2)** Adicionar uma "barra de fases" visual na ficha (germinação → colheita) com durações.
9. **(P2)** Mostrar as **razões** da consociação (porque é bom/mau vizinho), não só os nomes.
10. **(P2)** Adicionar fotos reais das plantas (Wikimedia Commons CC), em vez de só emoji.
11. **(P2)** Citar fontes na camada de saúde (links para evidência).
12. **(P3)** Ficha de cada praga/doença com página própria e lista de plantas afetadas (filtro inverso).

### Desafio microgreens
13. **(P1)** Adaptar o guião à variedade escolhida: instruções de **demolha** (ervilha/girassol) e blackout por variedade.
14. **(P2)** Explicar o bloqueio temporal ("o próximo passo abre amanhã") e oferecer um **modo de demonstração** para explorar.
15. **(P2)** Permitir **vários tabuleiros/desafios em paralelo** e histórico de desafios concluídos.
16. **(P2)** Galeria de fotos do desafio (timeline visual da evolução dia a dia).
17. **(P3)** Sugerir automaticamente "semear o próximo tabuleiro" ao concluir (sucessão).

### Lembretes e retenção (motor da app)
18. **(P1)** Disparar **notificações reais** (Notification API enquanto a app está aberta; Web Push quando houver backend) — hoje o botão não faz nada.
19. **(P1)** **Export .ics** dos lembretes de rega (funciona em qualquer telemóvel, sem push) — prometido no doc 01.
20. **(P2)** Ajustar lembretes de rega à **meteorologia IPMA** (adiar se vai chover) — a lógica `wateringAdvice` já existe, falta ligá-la aos lembretes.
21. **(P2)** Permitir **concluir/adiar lembretes** a partir da lista da horta e da ficha da planta.
22. **(P2)** "Tarefas de hoje" no Início incluir também passos do desafio e lição sugerida, de forma unificada.
23. **(P3)** Resumo semanal ("esta semana regaste X, colheste Y").

### Gamificação
24. **(P2)** Implementar **streak freeze** (proteção de sequência) — prometido e reduz abandono.
25. **(P2)** Implementar **repetição espaçada** dos conceitos-core no curso.
26. **(P2)** Mostrar animação/feedback ao subir de nível e desbloquear conquista (hoje é só toast).
27. **(P3)** Conquistas adicionais ligadas a marcos reais (1ª colheita de cada categoria, horta de inverno, etc.).
28. **(P3)** Check-in diário de 30s ("espreitar as plantas") que conta para a streak nos dias de espera.

### Horta e diário
29. **(P1)** **Editar uma planta** depois de criada (nome, local, intervalo de rega).
30. **(P2)** Atualizar automaticamente a **fase de crescimento** da planta com base nos dias decorridos e no `stages` da espécie.
31. **(P2)** Filtrar/ordenar a horta (por estado de rega, idade, espécie) e ver plantas colhidas/perdidas (histórico).
32. **(P2)** Permitir **apagar/editar** entradas do diário.
33. **(P3)** Comparador "antes/depois" das fotos do diário.

### Robustez técnica e dados
34. **(P1)** **Comprimir fotos** (canvas → WebP, máx ~1600px) antes de guardar no IndexedDB.
35. **(P1)** Tratamento de erros visível ao utilizador (não só `console.error`) em falhas de BD/escrita.
36. **(P2)** Migrar `versionamento` do Dexie com estratégia de upgrade (já há `version(1)`, planear `version(2)`).
37. **(P2)** Implementar a **sincronização cloud** real (o código Supabase está pronto, falta o motor de push/pull + merge no login).
38. **(P2)** Gerir o **quota** do IndexedDB e avisar quando estiver cheio.
39. **(P3)** Backup/restauro manual (já há export JSON; falta **importar**).

### UX e usabilidade
40. **(P2)** Estado de "primeira utilização" mais guiado fora do desafio (tour rápido das tabs).
41. **(P2)** Pesquisa do catálogo com **sugestões/autocomplete** e pesquisa por sinónimos/nome científico.
42. **(P2)** Confirmações e ações destrutivas com **undo** (ex.: remover planta) em vez de `confirm()` do browser.
43. **(P2)** Melhorar o seletor de data de sementeira (hoje assume "hoje"; permitir datas passadas).
44. **(P3)** Vista de **calendário anual** (grelha 12 meses × culturas), como no doc 02.

### Acessibilidade e i18n
45. **(P2)** Isolar as strings em i18n (estão hardcoded) — preparar EN/ES e revisão de texto centralizada.
46. **(P2)** Auditoria de acessibilidade real (foco visível em todos os interativos, `aria-label` em botões só-ícone, contraste em modo escuro).
47. **(P3)** Suporte a tamanho de fonte do sistema e teste com leitor de ecrã.

### Qualidade, testes e operação
48. **(P1)** Adicionar o **teste E2E (Playwright)** do fluxo crítico (onboarding → desafio → colheita) — prometido no contrato.
49. **(P2)** Testes de componentes (Vue Test Utils) para os ecrãs principais e testes da lógica de gamificação (streak/níveis).
50. **(P2)** Configurar **CI (GitHub Actions)** com lint + typecheck + testes + build, e medir o Lighthouse PWA.

---

## 6. Ponto de situação — resumo

**O que está bem:** base técnica robusta e verificada (typecheck, 17 testes, build com PWA, lint limpos); núcleo funcional completo e coerente; conteúdo agronómico correto para Portugal; arquitetura local-first sólida; cloud e legal preparados.

**O que falta para ser "robusto e completo de verdade":** coerência das zonas climáticas (P1), mostrar a profundidade de conteúdo que já existe (P1), lembretes reais + .ics (P1), compressão de fotos (P1), edição de plantas (P1), adaptar o guião dos microgreens à variedade (P1), e depois expandir catálogo/curso e completar gamificação/sincronização (P2).

---

## 7. Plano de tarefas proposto (próxima iteração)

**Lote P1 — robustez e coerência (primeiro):** 1, 6, 7, 13, 18, 19, 29, 34, 35, 48.
**Lote P2 — completude:** 3, 4, 5, 8, 9, 20, 21, 24, 25, 30, 37, 45, 49, 50.
**Lote P3 — refinamento e futuro:** os restantes.

Sugestão: atacar o **Lote P1** como próximo sprint — são as mudanças que mais aumentam a sensação de robustez e de "app a sério" para quem a usa.
