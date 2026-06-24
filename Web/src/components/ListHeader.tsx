import { LucideFilter, LucidePlus, LucideSearch } from "lucide-react";
import { Button } from "./Button";

interface ListHeaderProps {
    onCreate: () => void
    onFilter: () => void
    onSearch: (q: string) => void
}

export function ListHeader({onCreate, onFilter, onSearch} : ListHeaderProps) {
    return (
        <div>
            <div className="flex flex-row gap-6 py-2 mb-5">
                <div className="flex-row relative flex-1 border-2 border-gray-500 rounded-lg focus-within:border-purple-800 hover:border-purple-600">
                    <LucideSearch size={25} className="absolute mt-2 text-purple-800 ml-4"/>
                    <input 
                        type="text" 
                        placeholder="Buscar por contexto..." 
                        className="pl-13 py-2.5 w-full rounded-lg outline-none bg-white"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>

                <Button variant="new" onClick={onFilter}>
                    <LucideFilter size={30} className="p-1 mx-2"/>
                </Button>

                <Button variant="save" className="items-center justify-center flex gap-1"  onClick={onCreate}>
                    <div className="flex mx-1">
                        <LucidePlus size={26}/>
                        <label className="text-lg">
                            Criar
                        </label>
                    </div>
                </Button>
            </div>
        </div>
    )
}