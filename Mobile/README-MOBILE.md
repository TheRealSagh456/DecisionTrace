# DecisionTrace — Mobile

App mobile para gerenciamento de decisões.

## Tecnologias

- React Native + Expo
- TypeScript
- Expo Router
- Axios
- React Native Safe Area Context

## Como rodar

```bash
npm run mobile

Android   ->  npm run android
iOS       ->  npm run ios
Expo go   ->  npx expo start # Escaneie o QR code com o celular
```

> A API precisa estar rodando e acessível pelo celular.

## Configurando o endereço da API

Abra `src/services/api.ts` e altere o `baseURL` para o IP da sua máquina na rede local:

```typescript
export const api = axios.create({
  baseURL: 'http://192.168.X.X:3333'
})
```

Para descobrir o IP da sua máquina:
- **Windows:** `ipconfig` no terminal
- **Linux/Mac:** `hostname -I` no terminal

Se estiver usando emulador Android, use `http://10.0.2.2:3333`.

## Telas

### Lista de Decisions
- Cards com área, status, título e contadores
- Busca com debounce
- Filtros por status, área e impacto em um bottom sheet
- Atualiza automaticamente ao voltar de outras telas

### Nova Decision / Atualização de Status
- A mesma tela serve para criar e editar
- Ao criar: todos os campos editáveis, status inicia como `draft`
- Ao editar: título e contexto bloqueados, demais campos editáveis
- Campos condicionais aparecem conforme o status selecionado
- Seleção de datas com DateTimePicker nativo

### Detalhe da Decision
- Exibe todos os dados em modo leitura
- Lista de hipóteses e evidências
- Modal para criar e editar inputs
- Confirmação antes de deletar decision
- Botão Editar navega para a tela de atualização de status
