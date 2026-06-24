import Fastify from 'fastify'
import cors from "@fastify/cors"
import dotenv from "dotenv"
import { decisionsRoutes } from './routes/decisions'
import { inputRoutes } from './routes/inputs'

dotenv.config()

const app = Fastify({logger: true})

app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
})

app.register(decisionsRoutes)
app.register(inputRoutes)

app.get("/health", async () => {
    return {status: 'ok'}
})

const PORT = Number(process.env.PORT) ?? 3333

app.listen({port: PORT, host: '0.0.0.0'}, (err) => {
    if(err) {
        app.log.error(err)
        process.exit(1)
    }
})