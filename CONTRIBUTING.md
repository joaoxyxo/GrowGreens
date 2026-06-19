# Contribuir para o GrowGreens

Obrigado pelo interesse! Este guia resume como correr, testar e contribuir.

## Arranque

```bash
npm install
npm run dev      # http://localhost:5390
```

## Antes de abrir um PR

Garante que tudo passa localmente:

```bash
npm run lint        # ESLint (0 problemas)
npm run typecheck   # vue-tsc
npm run test        # Vitest (unitários + componentes)
npm run build       # build de produção
```

Opcional: `npm run test:coverage` (mínimos em `vitest.config.ts`), `npm run format` (Prettier), `npm run test:e2e` (Playwright).

Node 20 (ver `.nvmrc`). **Nunca deixes a build partida.**

## Convenções

- **Idioma:** UI e conteúdo em português de Portugal (pt-PT).
- **Dados do catálogo** (`src/data/`): respeita os tipos em `src/types/catalog.ts`. Referências (companheiras, pragas, receitas, grupos) têm de apontar para slugs/códigos existentes — `tests/data-integrity.test.ts` valida isto.
- **Lógica de domínio** em funções puras (`src/utils/`), cobertas por testes; mantém os componentes `.vue` finos.
- **Arquitetura:** ver [`docs/ARQUITETURA.md`](./docs/ARQUITETURA.md) e [`CLAUDE.md`](./CLAUDE.md).

## Commits

- Mensagens claras, no imperativo (ex.: "Adicionar receita de favada").
- Um commit atómico por alteração coerente.
- Inclui/atualiza testes quando mexes em lógica.

## Estilo

Formatação delegada ao Prettier (`.prettierrc.json`) e ao ESLint. Corre `npm run lint:fix` e `npm run format` antes de commitar se necessário.
