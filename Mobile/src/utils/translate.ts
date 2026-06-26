export const statusArray = ["draft", "under_analysis", "decided", "reviewed", "reversed"]

export const areaArray = ["Product", "Engineering", "Design", "Operations", "Business", "Other"]

export const statusMap: Record<string, string> = {
  draft: "Rascunho",
  under_analysis: "Em análise",
  decided: "Decidida",
  reviewed: "Revisada",
  reversed: "Revertida"
}

export const areaMap: Record<string, string> = {
  Product: "Produto",
  Engineering: "Engenharia",
  Design: "Design",
  Operations: "Operações",
  Business: "Negócios",
  Other: "Outro"
}

export const impactoMap: Record<string, string> = {
  low: "Baixo",
  medium: "Médio",
  high: "Alto",
  critical: "Crítico"
}

export const resultadoMap: Record<string, string> = {
  confirmed: "Confimada", 
  partially_confirmed: "Parcialmente confirmada",
  invalidated: "Invalidada", 
  inconclusive: "Inconclusivo"
}

export const tipoMap: Record<string, string> = {
  hypothesis: "Hipótese",
  evidence: "Evidência"
}

export const confiancaMap: Record<string, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta"
}