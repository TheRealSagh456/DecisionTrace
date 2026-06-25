import type { Decision } from "../@types";
import { areaMap, statusMap } from "../utils/translate";
import { MessageCircle, Vote, Calendar } from 'lucide-react'

interface DecisionCardProps extends React.ComponentProps<"div"> {
    decision: Decision
}

export function DecisionCard({decision, ...props}: DecisionCardProps) {    

    return (
        <div 
            className={`
                flex flex-col border-2 border-gray-500 rounded-lg bg-white
                p-3 px-5 gap-1 cursor-pointer hover:bg-gray-100 hover:border-purple-950
                transition
            `}
            {...props}
        >
            <div className="flex justify-between">
                <label className="font-bold text-xl">
                    {
                        areaMap[decision.area]
                    }
                </label>
                <label className="font-semibold text-lg">
                    {
                        statusMap[decision.status]
                    }
                </label>
            </div>
            
            <span className="wrap-break-words line-clamp-1 py-1">
                {decision.contexto}
            </span>

            <div className="flex justify-between">
                <div className="flex justify-between gap-8">
                    <div className="flex gap-1 items-center">
                        <MessageCircle size={16} className="border-gray-900 fill-purple-600"/>
                        <span className="text-lg">{decision.hypothesisCount}</span>
                    </div>
                    <div className="flex gap-1 items-center">
                        <Vote size={20} className="border-gray-500"/>
                        <span className="text-lg">
                        {decision.evidencesCount}
                        </span>
                    </div>
                </div>
                
                <div className="flex gap-1 items-center">
                    <Calendar size={18} className="border-gray-900 fill-purple-600"/>
                    {
                        new Date(decision.updatedAt)
                        .toLocaleString('pt-BR', {
                            dateStyle: 'short'
                        })
                    }
                </div>
            </div>
        </div>
    )
}