export interface Decision {
  iddecision: string
  titulo: string
  contexto: string
  area: "Product" | "Engineering" | "Design" | "Operations" | "Business" | "Other"
  impactoEsperado: "low" | "medium" | "high" | "critical"
  status: "draft" | "under_analysis" | "decided" | "reviewed" | "reversed"
  responsavel: string
  decisaoTomada: string | undefined
  decidedAt: string | undefined
  resultadoRevisao: "confirmed" | "partially_confirmed" | "invalidated" | "inconclusive" | undefined
  resumoRevisao: string | undefined
  aprendizado: string | undefined
  proximaAcao: string | undefined
  reviewedAt: string | undefined
  createdAt: string
  updatedAt: string
  inputsCount: number
  hypothesisCount: number
  evidencesCount: number
}

export type DecisionFormData = Omit<Decision, 
  'iddecision' | 'createdAt' | 'updatedAt' | 'inputsCount' | 'hypothesisCount' | 'evidencesCount'
>

export type Option = {
    label: string;
    value: string;
};

export interface DecisionInput {
  idinput: string
  iddecision: string
  tipo: "hypothesis" | "evidence"
  descricao: string
  fonte: string
  confianca: "low" | "medium" | "high"
  createdAt: string
  updatedAt: string
}

export interface DecisionsFilter {
  status: Decision["status"] | undefined
  area: Decision["area"] | undefined
  impactoEsperado: Decision["impactoEsperado"] | undefined
}

export interface PaginatedDecisions {
  items: Decision[]
  page: number
  pageSize: number
  total: number
}