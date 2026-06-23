import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { v4 as uuid } from "uuid"
import { db } from "../db/database"

const inputSchema = z.object({
    tipo: z.enum(["hypothesis", "evidence"]),
    descricao: z.string().min(10),
    fonte: z.string().min(2),
    confianca: z.enum(["low", "medium", "high"])
})

async function decisionVerify(request: FastifyRequest, reply: FastifyReply) {
    const {iddecision} = z.object({iddecision: z.string()}).parse(request.params)

    const decision = await db("decisions").where("iddecision", iddecision).first()

    if(!decision) {
        return reply.status(404).send({
            error: {
                code: "NOT_FOUND",
                message: "Decision não encontrada",
            }
        })
    }
}

export function inputRoutes(app: FastifyInstance) {
    app.post("/decisions/:iddecision/inputs", {preHandler: decisionVerify}, 
        async (request, reply) => {

            const { iddecision } = request.params as { iddecision: string }

            const parsedInput = inputSchema.parse(request.body)

            const newInput = {
                ...parsedInput,
                idinput: uuid(),
                iddecision: iddecision,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            await db("decision_inputs").insert(newInput)

            return reply.status(201).send(newInput)
        }
    )

    app.get("/decisions/:iddecision/inputs",{preHandler: decisionVerify},
         async (request, reply) => {

            const { iddecision } = request.params as { iddecision: string }

            const inputs = await db("decision_inputs").where("iddecision", iddecision).select('*')

            return reply.status(200).send(inputs)
        }
    )

    app.get("/inputs/:idinput", async (request, reply) => {
            const { idinput } = request.params as { idinput: string }

            const input = await db("decision_inputs").where("idinput", idinput).first()

            if(!input) {
                return reply.status(404).send({
                    error: {
                        code: "NOT_FOUND",
                        message: "Input não encontrada",
                    }
                })
            }

            return reply.status(200).send(input)
        }
    )

    app.delete("/inputs/:idinput", async (request, reply) => {
            const { idinput } = request.params as { idinput: string }

            const deletedInput = await db("decision_inputs").where("idinput", idinput).delete()

            if(deletedInput === 0) {
                return reply.status(404).send({
                    error: {
                        code: "NOT_FOUND",
                        message: "Input não encontrada",
                    }
                })
            }

            return reply.status(204).send()
        }
    )

    app.put("/inputs/:idinput", async (request, reply) => {
        const { idinput } = request.params as { idinput: string }

        const input = await db("decision_inputs").where("idinput", idinput).first()

        const inputPutSchema = inputSchema.partial()
        
        if(!input) {
            return reply.status(404).send({
                    error: {
                        code: "NOT_FOUND",
                        message: "Input não encontrada",
                    }
                })
        }

        const data = inputPutSchema.safeParse(request.body)

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

        const updatedInput = {...data.data, updatedAt: new Date().toISOString()}
        
        await db("decision_inputs").where("idinput", idinput).update(updatedInput)

        reply.status(200).send({message: "Atualização feita com êxito!"})
    })
}