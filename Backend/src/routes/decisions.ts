import { FastifyInstance } from "fastify"
import z from "zod"
import { v4 as uuid } from "uuid"
import { db } from "../db/database"

const decisionSchemaBase = z.object({
    titulo: z.string().min(5),
    contexto: z.string().min(20),
    area: z.enum(["Product", "Engineering", "Design", "Operations", "Business", "Other"]),
    impactoEsperado: z.enum(["low", "medium", "high", "critical"]),
    status: z.enum(["draft", "under_analysis", "decided", "reviewed", "reversed"]).default("draft"),
    responsavel: z.string().min(2),
    decisaoTomada: z.string().min(10).nullish(),
    decidedAt: z.string().nullish(),
    resultadoRevisao: z.enum(["confirmed", "partially_confirmed", "invalidated", "inconclusive"]).nullish(),
    resumoRevisao: z.string().nullish(),
    aprendizado: z.string().nullish(),
    proximaAcao: z.string().nullish(),
    reviewedAt: z.string().nullish()
})

const refineDecided = (data: any) => {
    if (data.status === "decided") {
        return data.decisaoTomada != null && data.decidedAt != null
    }
    return true
}

const refineRev = (data: any) => {
    if (data.status === "reversed" || data.status === "reviewed") {
        return data.decisaoTomada != null && data.decidedAt != null &&
        data.resultadoRevisao != null && data.resumoRevisao != null &&
        data.aprendizado != null && data.proximaAcao != null && data.reviewedAt != null
    }
    return true
}

const decisionSchema = decisionSchemaBase
    .refine(refineDecided, {
        message: "decisaoTomada e decidedAt são obrigatórios quando o status for decided",
        path: ["decisaoTomada"]
    })
    .refine(refineRev, {
        message: "Para status reviewed e reversed todos os campos de revisão são obrigatórios",
        path: ["resultadoRevisao"]
    })

const updateDecisionSchema = decisionSchemaBase.partial()
    .refine(refineDecided, {
        message: "decisaoTomada e decidedAt são obrigatórios quando o status for decided",
        path: ["decisaoTomada"]
    })
    .refine(refineRev, {
        message: "Para status reviewed e reversed todos os campos de revisão são obrigatórios",
        path: ["resultadoRevisao"]
    })

export type Decision = z.infer<typeof decisionSchema>

export async function decisionsRoutes(app: FastifyInstance) {

    app.get("/decisions/:iddecision", async (request, reply) => {
        const { iddecision } = z.object({ iddecision: z.string() }).parse(request.params)

        const decision = await db('decisions').where('iddecision', iddecision).first()

        if (!decision) {
            return reply.status(404).send({
                error: { code: "NOT_FOUND", message: "Decision não encontrada" }
            })
        }

        return decision
    })

    app.post("/decisions", async (request, reply) => {
        const data = decisionSchema.safeParse(request.body)

        if (!data.success) {
            return reply.status(400).send({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Dados inválidos",
                    details: data.error.issues.map(err => ({
                        field: err.path[0],
                        message: err.message
                    }))
                }
            })
        }

        const decision = {
            ...data.data,
            iddecision: uuid(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        await db('decisions').insert(decision)

        return reply.status(201).send(decision)
    })

    app.put("/decisions/:iddecision", async (request, reply) => {
        const { iddecision } = z.object({ iddecision: z.string() }).parse(request.params)

        const decision = await db('decisions').where('iddecision', iddecision).first()

        if (!decision) {
            return reply.status(404).send({
                error: { code: "NOT_FOUND", message: "Decision não encontrada" }
            })
        }

        const data = updateDecisionSchema.safeParse(request.body)

        if (!data.success) {
            return reply.status(400).send({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Dados inválidos",
                    details: data.error.issues.map(err => ({
                        field: err.path[0],
                        message: err.message
                    }))
                }
            })
        }

        const updated = {
            ...data.data,
            updatedAt: new Date().toISOString()
        }

        await db('decisions').where('iddecision', iddecision).update(updated)

        const decisionAtualizada = await db('decisions').where('iddecision', iddecision).first()

        return reply.status(200).send(decisionAtualizada)
    })

    app.get("/decisions", async (request, reply) => { // Query
        const { q, status, area, impactoEsperado, _page, _limit } = z.object({
            q: z.string().optional(),
            status: z.string().optional(),
            area: z.string().optional(),
            impactoEsperado: z.string().optional(),
            _page: z.string().optional(),
            _limit: z.string().optional(),
        }).parse(request.query)

        const query = db("decisions").select("*")

        if(status) {
            query.where("status", status)
        }

        if(area) {
            query.where("area", area)
        }

        if(impactoEsperado) {
            query.where("impactoEsperado", impactoEsperado)
        }

        if(q) {
            query.where(function() {
                this.where("titulo", "like", `%${q}%`)
                .orWhere("contexto", "like", `%${q}%`)
                .orWhere("decisaoTomada", "like", `%${q}%`)
            })
        }

        const total = await query.clone().count("iddecision as count").first()
        
        const page = Number(_page) || 1
        const limit = Number(_limit) || 10
        const offset = (page-1) * limit
        
        const decisions = await query.limit(limit).offset(offset)

        const withCounts = await Promise.all(decisions.map(async (decision) => {
            const inputTotal = await db("decision_inputs")
            .where("iddecision", decision.iddecision)
            .count('idinput as count').first()

            const hypothesis = await db("decision_inputs")
            .where("iddecision", decision.iddecision)
            .where("tipo", "hypothesis")
            .count('idinput as count').first()

            const evidences = await db("decision_inputs")
            .where("iddecision", decision.iddecision)
            .where("tipo", "evidence")
            .count('idinput as count').first()

            return {
                ...decision,
                inputsCount: Number(inputTotal?.count),
                hypothesisCount: Number(hypothesis?.count),
                evidencesCount: Number(evidences?.count)
            }
        }))
        
        return reply.status(200).send({
            items: withCounts,
            page: page,
            pageSize: limit,
            total: Number(total?.count)
        })
    })

    app.delete("/decisions/:iddecision", async (request, reply) => {
        const { iddecision } = z.object({ iddecision: z.string() }).parse(request.params)

        const deletedDecision = await db("decisions").where("iddecision", iddecision).delete()

        if(deletedDecision === 0) {
            return reply.status(404).send({
                error: {
                    code: "NOT_FOUND",
                    message: "Decision não encontrada",
                }
            })
        }

        return reply.status(204).send()
    })
}