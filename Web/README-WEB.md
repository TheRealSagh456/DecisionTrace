# DecisionTrace — Web

Interface web para gerenciamento de decisões.

## Tecnologias

- React + Vite
- TypeScript
- Tailwind CSS
- React Router
- React Hook Form
- Axios
- Sonner (toasts)

## Como rodar

```bash
npm run web   # inicia em http://localhost:5173
```

> A API precisa estar rodando em `http://localhost:3333`.

## Telas

### Lista de Decisions (`/`)
- Cards com área, status, título, contadores de hipóteses e evidências
- Busca textual com debounce
- Filtros por status, área e impacto esperado
- Paginação

### Nova Decision (`/decisions/new`)
- Formulário com validação
- Campos condicionais aparecem de acordo com o status selecionado
- Status `decided` exige decisão tomada e data
- Status `reviewed`/`reversed` exige campos de revisão completos

### Detalhe da Decision (`/decisions/:iddecision`)
- Exibe todos os dados da decision
- Botão Editar habilita os campos de status, área e impacto
- Lista de hipóteses e evidências com opção de criar, editar e deletar
- Modal de confirmação antes de deletar

## Configuração da API

O endereço da API está em `src/services/api.ts`. Por padrão aponta para `http://localhost:3333`. Altere se necessário.
