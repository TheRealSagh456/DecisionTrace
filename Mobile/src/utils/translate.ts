import { Option } from "@/@types"

export const statusMap: Record<string, string> = {
  draft: "Rascunho",
  under_analysis: "Em análise",
  decided: "Decidida",
  reviewed: "Revisada",
  reversed: "Revertida"
}

export const statusOptions: Option[] = Object.entries(statusMap).map(([value, label]) => ({
    value,
    label,
}))

export const areaMap: Record<string, string> = {
  Product: "Produto",
  Engineering: "Engenharia",
  Design: "Design",
  Operations: "Operações",
  Business: "Negócios",
  Other: "Outro"
}

export const areaOptions: Option[] = Object.entries(areaMap).map(([value, label]) => ({
    value,
    label,
}))

export const impactoMap: Record<string, string> = {
  low: "Baixo",
  medium: "Médio",
  high: "Alto",
  critical: "Crítico"
}

export const impactoOptions: Option[] = Object.entries(impactoMap).map(([value, label]) => ({
    value,
    label,
}))

export const resultadoMap: Record<string, string> = {
  confirmed: "Confimada", 
  partially_confirmed: "Parcialmente confirmada",
  invalidated: "Invalidada", 
  inconclusive: "Inconclusivo"
}

export const resultadoOptions: Option[] = Object.entries(resultadoMap).map(([value, label]) => ({
    value,
    label,
}))

export const tipoMap: Record<string, string> = {
  hypothesis: "Hipótese",
  evidence: "Evidência"
}

export const tipoOptions: Option[] = Object.entries(tipoMap).map(([value, label]) => ({
    value,
    label,
}))

export const confiancaMap: Record<string, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta"
}

export const confiancaOptions: Option[] = Object.entries(confiancaMap).map(([value, label]) => ({
    value,
    label,
}))