import type { DecisionInput } from "../@types";
import { LucideEdit, LucideTrash } from 'lucide-react'

interface DecisionInputCardProps extends React.ComponentProps<"div"> {
    input: DecisionInput
    onEdit: () => void
    onDelete: () => void
}

export function DecisionInputCard({input, onEdit, onDelete, ...props}: DecisionInputCardProps) {    

    return (
        <div 
            className={`
                flex flex-row border-2 border-gray-400 bg-white
                p-5 cursor-pointer hover:bg-gray-300 hover:border-purple-950
                transition justify-between items-center
            `}
            {...props}
        >
            <div className="flex flex-col flex-1">
                <label className="wrap-break-words line-clamp-1">
                    {
                        input.descricao
                    }
                </label>
                <label>
                    <label>Tipo: {input.tipo}</label>
                </label>
                <div className="flex flex-row justify-between">
                    <label>
                        Fonte: {input.fonte}
                    </label>
                    <label>
                        Confiança: {input.confianca}
                    </label>
                </div>
            </div>
            
            <div className="flex flex-row gap-2 pl-5">
                <div className={`
                    bg-purple-200 rounded-lg 
                    hover:bg-purple-300 transition    
                `}
                onClick={onEdit}>
                    <LucideEdit size={30} color="purple" className="p-1"/>
                </div>
                <div className={`
                    bg-red-200 rounded-lg 
                    hover:bg-red-300 transition`
                }
                onClick={onDelete}>
                    <LucideTrash size={30} color="red" className="p-1"/>
                </div>
            </div>
        </div>
    )
}