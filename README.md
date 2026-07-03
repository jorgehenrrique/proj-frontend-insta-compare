# Insta Compare

Descubra quem você segue no Instagram que não te segue de volta — comparando os arquivos oficiais que o próprio Instagram exporta para você.

Tudo roda no navegador: os arquivos enviados nunca saem do seu dispositivo, nada é enviado para nenhum servidor.

## Como funciona

1. Você exporta seus dados do Instagram (`following.json` e `followers_N.json`) pelo próprio app — a página ensina o passo a passo, com animações ilustrando cada etapa.
2. Envia esses arquivos aqui, arrastando ou selecionando.
3. A página compara as duas listas localmente e mostra quem você segue e não te segue de volta.
4. Você pode marcar cada perfil como "revisado" — a marcação fica salva no seu navegador (`localStorage`), sobrevivendo a recarregar a página.

## Rodando o projeto

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm run build    # build de produção (tsc + vite build)
npm run preview  # serve o build de produção localmente
npm run lint     # oxlint
```

## Estrutura

- `src/components/` — UI (upload, instruções, lista de resultados, cards de usuário)
- `src/components/walkthrough/` — animações de demonstração do passo a passo (conta fictícia)
- `src/utils/parseInstagramData.ts` — parsing dos JSONs exportados pelo Instagram
- `src/utils/compareFollowers.ts` — lógica de comparação (quem não segue de volta)
- `src/hooks/useCheckedUsers.ts` — persistência da lista de revisados no `localStorage`

## Stack

React + TypeScript + Vite, Tailwind CSS v4, Oxlint.
