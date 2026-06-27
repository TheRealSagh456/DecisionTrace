# DecisionTrace

Ferramenta para registrar e acompanhar decisões de produto, tecnologia ou operação. Permite registrar o contexto, hipóteses, evidências e revisão posterior de cada decisão.

## Projetos

```
Backend/     → API REST com Node.js + Fastify
Web/         → Interface web com React + Vite
Mobile/      → App mobile com React Native + Expo
```

## Como rodar

Você vai precisar de **3 terminais abertos**, um para cada projeto.

### 1. API

```bash
cd Backend
npm run cook

# cria o banco de dados
# popula com dados iniciais 
# roda na porta 3333
```

### 2. Web

```bash
cd Web
npm run web

# roda na porta 5173
```

### 3. Mobile

```bash
cd Mobile
npm run mobile

Android     ->      npm run android
iOS         ->      npm run ios

```

> A API precisa estar rodando antes de iniciar o Web e o Mobile.

## Entidades

**Decision** — representa uma decisão com título, contexto, área, impacto esperado, status e responsável. Pode evoluir por diferentes status e receber campos de revisão.

**DecisionInput** — representa uma hipótese ou evidência vinculada a uma Decision.

## Status possíveis

| Status | Descrição |
|--------|-----------|
| `draft` | Rascunho |
| `under_analysis` | Em análise |
| `decided` | Decidida |
| `reviewed` | Revisada |
| `reversed` | Revertida |
