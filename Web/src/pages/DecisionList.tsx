import { useEffect, useState } from "react"
import { type Decision } from "../@types"
import { api } from "../services/api"
import { DecisionCard } from "../components/Card"
import { DecisionContainer } from "../components/Container"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/Button"

export function DecisionList() {

    const [decisions, setDecisions] = useState<Decision[]>([])

    const navigate = useNavigate()

    useEffect(() => {
        async function fetchDecisions() {
            const response = await api.get("/decisions")
            setDecisions(response.data.items)
        }
        fetchDecisions()
    }, [])
    
    return (
        <DecisionContainer>
            <div className="flex flex-col gap-10">
                {decisions.map((decision) => (
                    <DecisionCard 
                        key={decision.iddecision} 
                        decision={decision}
                        onClick={() => navigate(`/decisions/${decision.iddecision}`)}
                    />
                ))}
            </div>
                <Button variant="new" onClick={() => navigate("/decisions/new")}>
                    Novo
                </Button>
        </DecisionContainer>

    )
}