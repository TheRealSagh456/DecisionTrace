import { useEffect, useState } from "react"
import type { Decision } from "../@types"
import { api } from "../services/api"
import { useParams } from "react-router-dom"

export function DecisionDetails() {
    const [decision, setDecision] = useState<Decision>()

    const { iddecision } = useParams()

    useEffect(() => {
            async function getDecision() {
                const response = await api.get(`/decisions/${iddecision}`)
                setDecision(response.data)
            }
            getDecision()
        }, [])
    
    return (
        <h1>{decision?.contexto}</h1>
    )
}