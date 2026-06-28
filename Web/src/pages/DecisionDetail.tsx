import { useEffect, useState } from "react"
import { type DecisionInput, type Decision, type DecisionFormData } from "../@types"
import { api } from "../services/api"
import { useNavigate, useParams } from "react-router-dom"
import { DecisionContainer } from "../components/Container"
import { Input } from "../components/Input"
import { areaMap, areaOptions, confiancaOptions, impactoMap, impactoOptions, resultadoMap, resultadoOptions, statusMap, statusOptions, tipoOptions } from "../utils/translate"
import { Button } from "../components/Button"
import { LucideCheck, LucideChevronLeft, LucideEdit, LucideEraser, LucidePlus, LucideSave } from "lucide-react"
import { DecisionInputCard } from "../components/DecisionInputsCard"
import { Modal } from "../components/Modal"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

export function DecisionDetails() {
    const [decision, setDecision] = useState<Decision>()
    const [decisionInputs, setDecisionInputs] = useState<DecisionInput[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingInput, setEditingInput] = useState<DecisionInput | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const { iddecision } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
            async function getDecision() {
                const response = await api.get(`/decisions/${iddecision}`)
                setDecision(response.data)
            }
            async function getDecisionInputs() {
                const response = await api.get(`/decisions/${iddecision}/inputs`)
                setDecisionInputs(response.data)
            }

            getDecision()
            getDecisionInputs()
        }, [iddecision]
    )
    
    const { 
        register: registerInput,
        unregister: unregisterInput,
        handleSubmit: handleSubmitInput,
        reset: resetInput,
        formState: {errors: inputErrors, isDirty: isDirtyInput}
    } = useForm<DecisionInput>()
    
    const { 
        register: registerDecision, 
        handleSubmit: handleSubmitDecision, 
        unregister: unregisterDecision,
        reset: resetDecision,
        control: controlDecision,
        formState: {errors: decisionErrors, isDirty: isDirtyDecision}
    } = useForm<DecisionFormData>()

    const editingStatus = useWatch({ control: controlDecision, name: "status" })

    useEffect(() => {
        if(editingInput) {
            resetInput({
                tipo: editingInput.tipo,
                descricao: editingInput.descricao,
                fonte: editingInput.fonte,
                confianca: editingInput.confianca
            })
        } else {
            resetInput({})
        }
    },[editingInput, resetInput])
    
    async function onSubmitInput(data: DecisionInput) {
        if(editingInput) {
            if(!isDirtyInput) {
                return toast.error("NENHUMA ALTERAÇÂO FOI FEITA!")
            }
            await api.put(`/inputs/${editingInput.idinput}`, data)
            setDecisionInputs(prev => prev.map(i => i.idinput === editingInput.idinput ? {...i, ...data} : i))
        } else {
           const response = await api.post(`/decisions/${iddecision}/inputs`, data)

           setDecisionInputs(prev => [...prev, response.data])
        }
        setIsModalOpen(false)
        setEditingInput(null)
        unregisterInput()
        toast.success("INSUMO CRIADO COM SUCESSO")
    }

    useEffect(() => {
        if(isEditing && decision) {
            resetDecision({
                area: decision.area,
                impactoEsperado: decision.impactoEsperado,
                status: decision.status,
                responsavel: decision.responsavel,
                titulo: decision.titulo,
                contexto: decision.contexto,
                decisaoTomada: decision.decisaoTomada ?? undefined,
                decidedAt: decision.decidedAt ?? undefined,
                resultadoRevisao: decision.resultadoRevisao ?? undefined,
                resumoRevisao: decision.resumoRevisao ?? undefined,
                aprendizado: decision.aprendizado ?? undefined,
                proximaAcao: decision.proximaAcao ?? undefined,
                reviewedAt: decision.reviewedAt ?? undefined,
            })
        }
    }, [isEditing, decision, resetDecision])

    useEffect(() => {
        if(isEditing) {
            unregisterDecision([
                "decisaoTomada",
                "decidedAt",
                "resultadoRevisao",
                "resumoRevisao",
                "aprendizado",
                "proximaAcao",
                "reviewedAt",
            ])
        }
    }, [editingStatus, isEditing, unregisterDecision])

    async function onSubmitDecision(data: DecisionFormData) {
        if(!isDirtyDecision) {
            toast.error("NENHUMA EDIÇÂO FOI FEITA!")
        }

        const noEmptyValuesData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined)
        )
        console.log(data)
        await api.put(`/decisions/${iddecision}`, noEmptyValuesData)
        setDecision(prev => prev ? {...prev, ...data} : prev)
        setIsEditing(false)
        toast.success("DECISION EDITADA COM ÊXITO", {position: "bottom-right"})
        navigate("/")
    }

    async function handleDeleteDecision() {
        try{
            await api.delete(`/decisions/${iddecision}`)
            toast.success("DECISION APAGADA COM SUCESSO!", {position: "bottom-right"})
            navigate("/")
        } catch(err) {
            console.log(err.response.data)
            toast.error("FALHA EM APAGAR A DECISION!")
        }
    }


    if(!decision) return (
        <DecisionContainer>
            <p className="text-lg">Carregando...</p>
        </DecisionContainer>
    )
    
    return (
        <DecisionContainer className="gap-4">
            <form onSubmit={handleSubmitDecision(onSubmitDecision)} className="pb-10">
                <Input
                    label="Área"
                    type="select"
                    className="w-full border pl-2 h-10"
                    options={
                        isEditing 
                        ? areaOptions 
                        : [{ 
                            value: decision.area, 
                            label: areaMap[decision.area] 
                        }]
                    }
                    register={registerDecision('area')}
                    defaultValue={decision.area}
                    disabled={!isEditing}
                />

                <Input
                    label="Impacto Esperado"
                    type="select"
                    className="w-full border pl-2 h-10"
                    options={
                        isEditing 
                        ? impactoOptions 
                        : [{ 
                            value: decision.impactoEsperado, 
                            label: impactoMap[decision.impactoEsperado]
                        }]
                    }
                    register={registerDecision('impactoEsperado')}
                    defaultValue={decision?.impactoEsperado}
                    disabled={!isEditing}
                />
                <Input 
                    label="Responsável" 
                    type="text" 
                    className="w-full border h-10 pl-2"
                    defaultValue={decision?.responsavel}
                    disabled={!isEditing}
                    register={registerDecision('responsavel')}
                />

                <Input
                    label="Status"
                    type="select"
                    className="w-full border pl-2 h-10"
                    options={
                        isEditing 
                        ? statusOptions 
                        : [{ 
                            value: decision.status, 
                            label: statusMap[decision.status]
                        }]
                    }
                    register={registerDecision('status')}
                    defaultValue={decision?.status}
                    disabled={!isEditing}
                />

                <div className="md:col-span-2">
                    <Input 
                        label="Título" 
                        type="textarea" 
                        defaultValue={decision?.titulo}
                        disabled
                    />
                </div>

                <div className="md:col-span-2">
                    <Input 
                        label="Contexto" 
                        type="textarea" 
                        defaultValue={decision?.contexto}
                        disabled
                    />
                </div>

                {((isEditing ? editingStatus : decision?.status) === "decided" || 
                    (isEditing ? editingStatus : decision?.status) === "reviewed" ||
                    (isEditing ? editingStatus : decision?.status) === "reversed") && (
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input 
                                label="Decisão Tomada" 
                                type="textarea"
                                containerClassName="md:col-span-2"
                                defaultValue={decision?.decisaoTomada || undefined}
                                register={isEditing ? registerDecision('decisaoTomada', {
                                    required: "Decisão é obrigatória",
                                    minLength: {value: 5, message: "Mínimo de 5 caracteres"}
                                }) : undefined}
                                error={decisionErrors.decisaoTomada?.message}
                                disabled={!isEditing}
                            />
                            <Input
                                label="Decidido em"
                                type="date"
                                containerClassName="md:col-span-2 pb-5"
                                defaultValue={decision?.decidedAt || undefined}
                                register={isEditing ? registerDecision('decidedAt', {
                                    required: "Data de decisão é obrigatória"
                                }) : undefined}
                                error={decisionErrors.decidedAt?.message}
                                disabled={!isEditing}
                            />
                        </div>
                    )}

                    {((isEditing ? editingStatus : decision?.status) === "reviewed" ||
                    (isEditing ? editingStatus : decision?.status) === "reversed") && (
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Resultado da revisão"
                                type="select"
                                className="w-full border pl-2 h-10"
                                options={isEditing ? resultadoOptions : [{ 
                                    value: decision?.resultadoRevisao ?? "inconclusive",
                                    label: resultadoMap[decision?.resultadoRevisao ?? "inconclusive"] 
                                }]}
                                defaultValue={decision?.resultadoRevisao || undefined}
                                register={isEditing ? registerDecision('resultadoRevisao', {
                                    required: "Resultado da revisão é obrigatório",
                                }) : undefined}
                                error={decisionErrors.resultadoRevisao?.message}
                                disabled={!isEditing}
                            />
                            <Input
                                label="Revisado em"
                                type="date"
                                defaultValue={decision?.reviewedAt || undefined}
                                register={isEditing ? registerDecision('reviewedAt', {
                                    required: "Data de revisão é obrigatória"
                                }) : undefined}
                                error={decisionErrors.reviewedAt?.message}
                                disabled={!isEditing}
                            />
                            <Input
                                label="Resumo da revisão"
                                type="textarea"
                                containerClassName="md:col-span-2"
                                defaultValue={decision?.resumoRevisao || undefined}
                                register={isEditing ? registerDecision('resumoRevisao', {
                                    required: "Resumo da revisão é obrigatório",
                                    minLength: {value: 10, message: "Mínimo de 10 caracteres"}
                                }) : undefined}
                                error={decisionErrors.resumoRevisao?.message}
                                disabled={!isEditing}
                            />
                            <Input
                                label="Aprendizado"
                                type="textarea"
                                containerClassName="md:col-span-2"
                                defaultValue={decision?.aprendizado || undefined}
                                register={isEditing ? registerDecision('aprendizado', {
                                    required: "Aprendizado é obrigatório",
                                    minLength: {value: 10, message: "Mínimo de 10 caracteres"}
                                }) : undefined}
                                error={decisionErrors.aprendizado?.message}
                                disabled={!isEditing}
                            />
                            <Input
                                label="Próxima ação"
                                type="textarea"
                                containerClassName="md:col-span-2"
                                defaultValue={decision?.proximaAcao || undefined}
                                register={isEditing ? registerDecision('proximaAcao', {
                                    required: "Resumo da revisão é obrigatório",
                                    minLength: {value: 8, message: "Mínimo de 8 caracteres"}
                                }) : undefined}
                                error={decisionErrors.proximaAcao?.message}
                                disabled={!isEditing}
                            />
                            <div className="md:col-span-2 flex flex-row justify-between">
                                <label>
                                    Criado: {new Date(decision.createdAt).toLocaleDateString("pt-BR")}
                                </label>
                                <label>
                                    Atualizado: {new Date(decision.updatedAt).toLocaleDateString("pt-BR")}
                                </label>
                            </div>
                        </div>
                )}
                
                <div>
                    <div className={`
                        flex flex-row justify-between pb-2 items-center
                        mt-5 bg-white py-3 px-3 border-2 border-gray-400
                    `}>
                        <label className="text-lg font-bold">
                            Hipóteses/Evidências({decisionInputs.length})
                        </label>
                        <Button
                            type="button"
                            variant="input" 
                            className="flex items-center gap-1 flex-row"
                            onClick={() => {
                                setIsModalOpen(true)
                                setEditingInput(null)
                                console.log(isDirtyDecision)
                            }}
                        >
                            <LucidePlus size={20}/>
                            <label>
                                Insumo
                            </label>
                        </Button>
                    </div>
                    <div className="max-h-[80vh] overflow-y-auto">
                        {decisionInputs.map((input) => (
                            <DecisionInputCard
                                key={input.idinput}
                                input={input} 
                                onEdit={() => {
                                    setEditingInput(input)
                                    setIsModalOpen(true)
                                }}
                                onDelete={() => {
                                    api.delete(`/inputs/${input.idinput}`)
                                    setDecisionInputs(prev => 
                                        prev.filter(i => i.idinput !== input.idinput)
                                    )
                                    toast.success("INSUMO REMOVIDO COM SUCESSO")
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="md:col-span-2 flex flex-col sm:flex-row justify-center gap-4 mt-6">
                    <Button
                        type="button"
                        variant="back" 
                        className="w-full sm:w-auto px-4 py-2 gap-1 items-center"
                        onClick={() => navigate("/")}
                    >
                        <LucideChevronLeft size={25}/> Voltar
                    </Button>
                    <Button 
                        variant="new" 
                        className="w-full sm:w-auto px-6 py-2 gap-2"
                        type="button"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        <LucideEdit size={16}/>Editar
                    </Button>
                    <Button
                        type="button"
                        variant="cancel" 
                        className="w-full sm:w-auto px-6 py-2 gap-2"
                        onClick={() => setIsDeleting(true)}
                    >
                        <LucideEraser size={16}/>Apagar
                    </Button>
                    {isEditing && (
                        <Button 
                            variant="save"
                            type="submit"
                            disabled={!isDirtyDecision}
                        >
                            <div className="flex gap-2 items-center px-2">
                                <LucideSave size={20}/>
                                Salvar
                            </div>
                        </Button>
                    )}
                </div>

                {isModalOpen === true && (
                    <Modal 
                        isOpen={isModalOpen} 
                        title="Novo Insumo" 
                        onClose={() => {
                            setEditingInput(null)
                            setIsModalOpen(false)
                            unregisterInput(["tipo", "descricao", "fonte", "confianca"])
                        }}
                    >
                        <label>
                            {decision.titulo}    
                        </label>
                        <div className="flex flex-col gap-2 pt-3" onSubmit={handleSubmitInput(onSubmitInput)}>       
                            <Input
                                type="select"
                                label="Tipo"
                                options={tipoOptions}
                                className="w-full border pl-3 h-10"
                                register={registerInput("tipo", {
                                    required: "Tipo é obrigatório"
                                })}
                                defaultValue={editingInput?.tipo}
                                error={inputErrors.tipo?.message}
                            />
                            <Input
                                type="textarea"
                                label="Descrição"
                                register={registerInput("descricao", {
                                    required: "Descrição é obrigatória",
                                    minLength: {value: 10, message: "Mínimo de 10 caracteres"}
                                })}
                                placeholder="Insira a descrição..."
                                defaultValue={editingInput?.descricao}
                                error={inputErrors.descricao?.message}
                            />
                            <Input
                                type="text"
                                label="Fonte"
                                className="w-full border pl-3 h-10"
                                register={registerInput("fonte", {
                                    required: "Fonte é obrigatória",
                                    minLength: {value: 2, message: "Mínimo de 2 caracteres"}
                                })}
                                defaultValue={editingInput?.fonte}
                                error={inputErrors.fonte?.message}
                            />
                            <Input
                                type="select"
                                label="Confiança"
                                options={confiancaOptions}
                                className="w-full border pl-3 h-10"
                                register={registerInput("confianca", {
                                    required: "Nivel de confiança é obrigatório"
                                })}
                                defaultValue={editingInput?.confianca}
                                error={inputErrors.confianca?.message}
                            />
                        <div className="flex flex-row justify-center items-center py-5 gap-4">
                            
                            <Button
                                variant="save" 
                                className="gap-1 w-full"
                                type="button"
                                onClick={handleSubmitInput(onSubmitInput)}
                                disabled={!isDirtyInput}
                            >
                                <LucideCheck size={20}/>
                                <label>
                                    Salvar
                                </label>
                            </Button>
                        </div>
                        </div>
                    </Modal>
                )}

                {isDeleting && (
                    <Modal 
                        deleting 
                        isOpen={isDeleting} 
                        onClose={() => setIsDeleting(false)} 
                        title="Deseja excluir essa decisão?"    
                    >
                        <div className="flex flex-col gap-5 pt-5">
                            <label className="font-semibold items-center justify-center text-center">
                                Ao apagá-la, os insumos atribuídos a ela também serão apagados, e não será possível recuperá-los.
                            </label>
                            <div className="flex flex-row gap-8 items-center justify-center">
                                <Button 
                                    type="button"
                                    variant="back" 
                                    onClick={() => setIsDeleting(false)}
                                >
                                    <label className="cursor-pointer">
                                        Cancelar
                                    </label>
                                </Button>
                                <Button 
                                    variant="cancel" 
                                    onClick={() => handleDeleteDecision()}
                                    type="button"
                                >
                                    <LucideEraser size={20}/>
                                    <label className="cursor-pointer">
                                        Apagar
                                    </label>
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}
            </form>
        </DecisionContainer>
    )
}