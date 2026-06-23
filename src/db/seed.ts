import { db } from "./database"
import { v4 as uuid } from "uuid"

const d1 = uuid()
const d2 = uuid()
const d3 = uuid()
const d4 = uuid()
const d5 = uuid()

async function seed() {
  await db('decisions').delete()
  await db('decision_inputs').delete()

  await db('decisions').insert([
    {
      iddecision: d1,
      titulo: "Remover campo obrigatório de telefone no cadastro",
      contexto: "Usuários estão abandonando o cadastro antes de concluir a etapa de dados pessoais.",
      area: "Product",
      impactoEsperado: "high",
      status: "draft",
      responsavel: "Ana",
      decisaoTomada: null,
      decidedAt: null,
      resultadoRevisao: null,
      resumoRevisao: null,
      aprendizado: null,
      proximaAcao: null,
      reviewedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      iddecision: d2,
      titulo: "Simplificar etapa de confirmação do agendamento",
      contexto: "O fluxo de agendamento possui muitas etapas e os usuários desistem antes de confirmar.",
      area: "Design",
      impactoEsperado: "medium",
      status: "draft",
      responsavel: "Carlos",
      decisaoTomada: null,
      decidedAt: null,
      resultadoRevisao: null,
      resumoRevisao: null,
      aprendizado: null,
      proximaAcao: null,
      reviewedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      iddecision: d3,
      titulo: "Migrar autenticação para OAuth com Google",
      contexto: "O sistema atual de login com email e senha tem alta taxa de recuperação de senha e baixa adoção.",
      area: "Engineering",
      impactoEsperado: "high",
      status: "under_analysis",
      responsavel: "Beatriz",
      decisaoTomada: null,
      decidedAt: null,
      resultadoRevisao: null,
      resumoRevisao: null,
      aprendizado: null,
      proximaAcao: null,
      reviewedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      iddecision: d4,
      titulo: "Adotar React Query para gerenciamento de estado remoto",
      contexto: "O frontend atual tem problemas de sincronização de dados e muito código boilerplate para chamadas de API.",
      area: "Engineering",
      impactoEsperado: "medium",
      status: "decided",
      responsavel: "Lucas",
      decisaoTomada: "Adotar React Query em todos os novos módulos do frontend a partir do próximo sprint.",
      decidedAt: "2026-05-10",
      resultadoRevisao: null,
      resumoRevisao: null,
      aprendizado: null,
      proximaAcao: null,
      reviewedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      iddecision: d5,
      titulo: "Remover relatório semanal automático por email",
      contexto: "O relatório semanal enviado por email tem taxa de abertura abaixo de 5% e gera custo de infraestrutura desnecessário.",
      area: "Operations",
      impactoEsperado: "low",
      status: "reviewed",
      responsavel: "Mariana",
      decisaoTomada: "Desativar o envio automático de relatórios semanais por email e disponibilizar apenas sob demanda no painel.",
      decidedAt: "2026-04-01",
      resultadoRevisao: "confirmed",
      resumoRevisao: "A remoção do relatório automático reduziu custos e não gerou reclamações dos usuários.",
      aprendizado: "Usuários preferem acessar dados sob demanda no painel do que receber emails automáticos.",
      proximaAcao: "Avaliar outros relatórios automáticos que possam ser desativados.",
      reviewedAt: "2026-05-01",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ])

  await db('decision_inputs').insert([
    {
      idinput: uuid(),
      iddecision: d1,
      tipo: "hypothesis",
      descricao: "Remover o telefone obrigatório deve aumentar a taxa de conclusão do cadastro.",
      fonte: "Observação do time de produto",
      confianca: "medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      idinput: uuid(),
      iddecision: d1,
      tipo: "evidence",
      descricao: "O maior abandono ocorre na etapa em que o telefone é exigido.",
      fonte: "Dashboard interno de conversão",
      confianca: "high",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      idinput: uuid(),
      iddecision: d1,
      tipo: "evidence",
      descricao: "Suporte recebeu mais de 40 reclamações sobre a obrigatoriedade do telefone no último mês.",
      fonte: "Tickets de suporte",
      confianca: "high",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      idinput: uuid(),
      iddecision: d2,
      tipo: "hypothesis",
      descricao: "Reduzir o número de etapas do agendamento deve aumentar a taxa de conclusão.",
      fonte: "Benchmark de concorrentes",
      confianca: "medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      idinput: uuid(),
      iddecision: d2,
      tipo: "evidence",
      descricao: "Mais de 60% dos usuários abandonam o fluxo na terceira etapa do agendamento.",
      fonte: "Analytics de funil",
      confianca: "high",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      idinput: uuid(),
      iddecision: d3,
      tipo: "hypothesis",
      descricao: "Login com Google deve reduzir o tempo de cadastro e aumentar a conversão de novos usuários.",
      fonte: "Pesquisa com usuários",
      confianca: "medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      idinput: uuid(),
      iddecision: d3,
      tipo: "evidence",
      descricao: "Mais de 30% dos tickets de suporte são sobre recuperação de senha.",
      fonte: "Sistema de tickets",
      confianca: "high",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      idinput: uuid(),
      iddecision: d3,
      tipo: "evidence",
      descricao: "Concorrentes diretos já oferecem login com Google e têm NPS superior ao nosso.",
      fonte: "Pesquisa de mercado",
      confianca: "medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      idinput: uuid(),
      iddecision: d4,
      tipo: "hypothesis",
      descricao: "React Query vai reduzir o código de sincronização de dados em pelo menos 40%.",
      fonte: "Estimativa do time de engineering",
      confianca: "medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      idinput: uuid(),
      iddecision: d4,
      tipo: "evidence",
      descricao: "O módulo de listagem atual tem mais de 200 linhas só para gerenciar loading, erro e cache manualmente.",
      fonte: "Code review interno",
      confianca: "high",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      idinput: uuid(),
      iddecision: d5,
      tipo: "evidence",
      descricao: "Taxa de abertura dos emails semanais está abaixo de 5% nos últimos 3 meses.",
      fonte: "Plataforma de email marketing",
      confianca: "high",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      idinput: uuid(),
      iddecision: d5,
      tipo: "evidence",
      descricao: "O custo mensal de envio dos relatórios automáticos é de R$800 sem retorno mensurável.",
      fonte: "Relatório financeiro de infraestrutura",
      confianca: "high",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ])

  console.log("Seed concluído!")
  await db.destroy()
}

seed()