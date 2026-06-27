# DecisionTrace — API

API REST para gerenciamento de decisões e seus insumos.

## Tecnologias

- Node.js 20+
- Fastify
- SQLite + Knex
- Zod
- TypeScript

## Como rodar

```bash
npm run cook => [

npm install
npm run setup                # cria um .env baseado no example
npx run db                   # cria as tabelas no banco
npm run seed                 # insere dados iniciais
npm run dev                  # inicia em http://localhost:3333

]
```


## Rotas

### Decisions

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/decisions` | Lista todas as decisions |
| GET | `/decisions/:iddecision` | Busca uma decision por ID |
| POST | `/decisions` | Cria uma decision |
| PUT | `/decisions/:iddecision` | Atualiza uma decision |
| DELETE | `/decisions/:iddecision` | Remove uma decision e seus inputs |

### Query params do GET /decisions

| Param | Descrição |
|-------|-----------|
| `q` | Busca textual em título, contexto e decisão tomada |
| `status` | Filtra por status |
| `area` | Filtra por área |
| `impactoEsperado` | Filtra por impacto |
| `_page` | Página atual (padrão: 1) |
| `_limit` | Itens por página (padrão: 10) |

### DecisionInputs

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/decisions/:iddecision/inputs` | Lista inputs de uma decision |
| GET | `/inputs/:idinput` | Busca um input por ID |
| POST | `/decisions/:iddecision/inputs` | Cria um input |
| PUT | `/inputs/:idinput` | Atualiza um input |
| DELETE | `/inputs/:idinput` | Remove um input |

## Exemplos de requisição

### Criar decision (draft)

```http
POST /decisions
Content-Type: application/json

{
  "titulo": "Remover campo obrigatório de telefone no cadastro",
  "contexto": "Usuários estão abandonando o cadastro antes de concluir a etapa de dados pessoais.",
  "area": "Product",
  "impactoEsperado": "high",
  "status": "draft",
  "responsavel": "Ana"
}
```

### Criar decision (decided)

```http
POST /decisions
Content-Type: application/json

{
  "titulo": "Adotar TypeScript no projeto",
  "contexto": "O time tem dificuldade de manutenção sem tipagem no código atual.",
  "area": "Engineering",
  "impactoEsperado": "medium",
  "status": "decided",
  "responsavel": "Maria",
  "decisaoTomada": "Migrar gradualmente para TypeScript começando pelos módulos novos.",
  "decidedAt": "2026-06-01"
}
```

### Criar input

```http
POST /decisions/:iddecision/inputs
Content-Type: application/json

{
  "tipo": "hypothesis",
  "descricao": "Remover o telefone obrigatório deve aumentar a taxa de conclusão do cadastro.",
  "fonte": "Observação do time de produto",
  "confianca": "medium"
}
```

## Formato de erro

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      {
        "field": "titulo",
        "message": "Too small: expected string to have >=5 characters"
      }
    ]
  }
}
```

## Códigos de erro

| Código | Situação |
|--------|----------|
| 400 | Dados inválidos |
| 404 | Recurso não encontrado |
| 500 | Erro interno |
