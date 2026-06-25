import type { DecisionInput } from "../@types";
import { LucideEdit, LucideTrash } from 'lucide-react'
import { confiancaMap, tipoMap } from "../utils/translate";

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
                p-5 justify-between items-center
            `}
            {...props}
        >
            <div className="flex flex-col flex-1 min-w-0">
                <label className="break-all">
                    {
                        input.descricao
                    }
                </label>
                <label>
                    <label>Tipo: {tipoMap[input.tipo]}</label>
                </label>
                <div className="flex items-start gap-4">
                    <label className="flex-1 break-all">
                        Fonte: {input.fonte}
                    </label>
                    <label className="shrink-0 whitespace-nowrap">
                        Confiança: {confiancaMap[input.confianca]}
                    </label>
                </div>
            </div>
            
            <div className="flex flex-row gap-2 pl-5">
                <div className={`
                    bg-purple-200 rounded-lg 
                    hover:bg-purple-300 transition 
                    cursor-pointer  
                `}
                onClick={onEdit}>
                    <LucideEdit size={30} color="purple" className="p-1"/>
                </div>
                <div className={`
                    bg-red-200 rounded-lg 
                    hover:bg-red-300 transition
                    cursor-pointer
                `}
                onClick={onDelete}>
                    <LucideTrash size={30} color="red" className="p-1"/>
                </div>
            </div>
        </div>
    )
}