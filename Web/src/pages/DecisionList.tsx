import { useEffect, useState } from "react"
import { type Decision, type DecisionsFilter } from "../@types"
import { api } from "../services/api"
import { DecisionCard } from "../components/DecisionCard"
import { DecisionContainer } from "../components/Container"
import { useNavigate } from "react-router-dom"
import { ListHeader } from "../components/ListHeader"
import { Modal } from "../components/Modal"
import { Input } from "../components/Input"
import { areaOptions, impactoOptions, statusOptions } from "../utils/translate"
import { Button } from "../components/Button"
import { useForm } from "react-hook-form"
import { useDebounce } from "use-debounce"
import { LucideChevronLeft, LucideChevronRight, LucideFilterX } from "lucide-react"

export function DecisionList() {

    const [decisions, setDecisions] = useState<Decision[]>([])
    const [search, setSearch] = useState("")
    const [debouncedSearch] = useDebounce(search, 500)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isFilterUp, setIsFilterUp] = useState(false)
    const [isFiltering, setIsFiltering] = useState(false)
    const [filterData, setFitlerData] = useState<DecisionsFilter>({
        status: undefined,
        area: undefined,
        impactoEsperado: undefined
    })

    const navigate = useNavigate()

    useEffect(() => {
        const limit = 5

        async function fetchDecisions() {
            const response = await api.get("/decisions", {
                params: {
                    q: debouncedSearch || undefined,
                    status: filterData?.status || undefined,
                    area: filterData?.area || undefined,
                    impactoEsperado: filterData?.impactoEsperado || undefined,
                    _page: page || undefined,
                    _limit: limit
                }
            })
            setDecisions(response.data.items)
            const total = response.data.total

            setTotalPages(Math.ceil(total/limit))
        }
        fetchDecisions()
    }, [debouncedSearch, filterData, page])

    if(!decisions) return (
        <DecisionContainer>
            <p className="text-lg">Carregando...</p>
        </DecisionContainer>
    )

    const {register, handleSubmit} = useForm()

    function onFilter(data: DecisionsFilter) {
        setFitlerData({
            status: data.status || undefined,
            area: data.area || undefined,
            impactoEsperado: data.impactoEsperado || undefined
        })
        setPage(1)
        setIsFilterUp(false)
        setIsFiltering(true)
    }

    function removeFilters() {
        setFitlerData({
            status: undefined,
            area: undefined,
            impactoEsperado: undefined
        })
        setPage(1)
        setIsFilterUp(false)
        setIsFiltering(false)
    }

    return (
        <DecisionContainer>
            <ListHeader 
                onCreate={() => navigate("/decisions/new")}
                onFilter={() => setIsFilterUp(true)}
                onSearch={setSearch}
            />
            <div className="flex flex-col gap-7">
                {decisions.map((decision) => (
                    <DecisionCard 
                        key={decision.iddecision} 
                        decision={decision}
                        onClick={() => navigate(`/decisions/${decision.iddecision}`)}
                    />
                ))}
            </div>

            {isFilterUp && (
                <Modal isOpen={isFilterUp} onClose={() => setIsFilterUp(false)} title="Filtrar por:">
                    <form onSubmit={handleSubmit(onFilter)}>
                        <div className="py-3 my-4 px-5 flex flex-col gap-5 bg-gray-50 rounded-lg">
                            <Input 
                                type="select" 
                                label="Status" 
                                options={[{value: "", label: "Todos"}, ...statusOptions]} 
                                defaultValue="Todos"
                                className="w-full border pl-3 h-10"
                                register={register("status")}
                            />
                            <Input 
                                type="select" 
                                label="Area" 
                                options={[{value: "", label: "Todos"}, ...areaOptions]} 
                                defaultValue="Todos"
                                className="w-full border pl-3 h-10"
                                register={register("area")}
                            />
                            <Input 
                                type="select" 
                                label="Impacto Esperado" 
                                options={[{value: "", label: "Todos"}, ...impactoOptions]} 
                                defaultValue="Todos"
                                className="w-full border pl-3 h-10"
                                register={register("impactoEsperado")}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button 
                                variant="new" 
                                className="w-full"
                                type="submit" 
                            >
                                <label>
                                    Filtrar
                                </label>
                            </Button>
                            {
                                isFiltering
                                && (
                                    <Button 
                                        variant="back"
                                        className="w-full"
                                        type="button"
                                        onClick={removeFilters}
                                    >
                                        <div className="flex flex-row gap-3">
                                            <LucideFilterX size={18}/>
                                            <label>
                                                Remover filtros
                                            </label>
                                        </div>
                                    </Button>
                                )
                            }
                        </div>
                    </form>
                </Modal>
            )}

            <div className="fixed bottom-0 left-0 right-0 flex w-full items-center justify-center py-7 h-auto gap-3">
                <Button 
                    variant="new"
                    onClick={() => page>=2 && setPage(page-1)}
                    disabled={page === 1}
                >
                    <LucideChevronLeft size={20}/>
                </Button>

                <label className="text-xl">
                    {`${page} de ${totalPages} `}
                </label>

                <Button 
                    variant="new"
                    onClick={() => page<totalPages && setPage(page+1)}
                    disabled={page >= totalPages}
                >
                    <LucideChevronRight size={20}/>
                </Button>
            </div>
        </DecisionContainer>

    )
}