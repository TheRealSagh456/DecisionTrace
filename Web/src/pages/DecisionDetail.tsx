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
        handleSubmit: handleSubmitInput,
        reset: resetInput 
    } = useForm<DecisionInput>()
    
    const { 
        register: registerDecision, 
        handleSubmit: handleSubmitDecision, 
        reset: resetDecision,
        control: controlDecision
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
            await api.put(`/inputs/${editingInput.idinput}`, data)
            setDecisionInputs(prev => prev.map(i => i.idinput === editingInput.idinput ? {...i, ...data} : i))
        } else {
           const response = await api.post(`/decisions/${iddecision}/inputs`, data)

           setDecisionInputs(prev => [...prev, response.data])
        }
        setIsModalOpen(false)
        setEditingInput(null)
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
    }, [isEditing])

    async function onSubmitDecision(data: DecisionFormData) {
        console.log(data)
        await api.put(`/decisions/${iddecision}`, data)
        setDecision(prev => prev ? {...prev, ...data} : prev)
        setIsEditing(false)
    }

    async function handleDeleteDecision() {
        await api.delete(`/decisions/${iddecision}`)
        navigate("/")
    }


    if(!decision) return (
        <DecisionContainer>
            <p className="text-lg">Carregando...</p>
        </DecisionContainer>
    )
    
    return (
        <DecisionContainer className="gap-4">
            <form onSubmit={handleSubmitDecision(onSubmitDecision)}>
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
                    register={isEditing ? registerDecision('area') : undefined}
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
                    register={isEditing ? registerDecision('impactoEsperado') : undefined}
                    defaultValue={decision?.impactoEsperado}
                    disabled={!isEditing}
                />
                <Input 
                    label="Responsável" 
                    type="text" 
                    className="w-full border h-10 pl-2"
                    defaultValue={decision?.responsavel}
                    disabled={!isEditing}
                    register={isEditing ? registerDecision('responsavel') : undefined}
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
                    register={isEditing ? registerDecision('status') : undefined}
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
                                register={isEditing ? registerDecision('decisaoTomada') : undefined}
                                disabled={!isEditing}
                            />
                            <Input
                                label="Decidido em"
                                type="date"
                                containerClassName="md:col-span-2"
                                defaultValue={decision?.decidedAt || undefined}
                                register={isEditing ? registerDecision('decidedAt') : undefined}
                                disabled={!isEditing}
                            />
                        </div>
                    )}

                    {((isEditing ? editingStatus : decision?.status) === "reviewed" ||
                    (isEditing ? editingStatus : decision?.status) === "reversed") && (
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Resultado da Revisão"
                                type="select"
                                className="w-full border pl-2 h-10"
                                options={isEditing ? resultadoOptions : [{ 
                                    value: decision?.resultadoRevisao ?? "inconclusive",
                                    label: resultadoMap[decision?.resultadoRevisao ?? "inconclusive"] 
                                }]}
                                defaultValue={decision?.resultadoRevisao || undefined}
                                register={isEditing ? registerDecision('resultadoRevisao') : undefined}
                                disabled={!isEditing}
                            />
                            <Input
                                label="Revisado em"
                                type="date"
                                defaultValue={decision?.reviewedAt || undefined}
                                register={isEditing ? registerDecision('reviewedAt') : undefined}
                                disabled={!isEditing}
                            />
                            <Input
                                label="Resumo da Revisão"
                                type="textarea"
                                containerClassName="md:col-span-2"
                                defaultValue={decision?.resumoRevisao || undefined}
                                register={isEditing ? registerDecision('resumoRevisao') : undefined}
                                disabled={!isEditing}
                            />
                            <Input
                                label="Aprendizado"
                                type="textarea"
                                containerClassName="md:col-span-2"
                                defaultValue={decision?.aprendizado || undefined}
                                register={isEditing ? registerDecision('aprendizado') : undefined}
                                disabled={!isEditing}
                            />
                            <Input
                                label="Próxima ação"
                                type="textarea"
                                containerClassName="md:col-span-2"
                                defaultValue={decision?.proximaAcao || undefined}
                                register={isEditing ? registerDecision('proximaAcao') : undefined}
                                disabled={!isEditing}
                            />
                        </div>
                )}
            
                {decision?.status === "decided" && (
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            label="Decisão Tomada" 
                            type="textarea"
                            containerClassName="md:col-span-2"
                            defaultValue={decision?.decisaoTomada || undefined}
                            disabled
                        />

                        <Input
                            label="Decidido em"
                            type="date"
                            containerClassName="md:col-span-2"
                            defaultValue={decision?.decidedAt || undefined}
                            disabled
                        />
                    </div>
                )}

                {decision?.status === "reviewed" && (
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Resultado da Revisão"
                            type="select"
                            className="w-full border pl-2 h-10"
                            options={[
                                { 
                                    value: decision.resultadoRevisao ?? "inconclusive",
                                    label: resultadoMap[decision.resultadoRevisao ?? "inconclusive"] 
                                }
                            ]}
                            defaultValue={decision?.resultadoRevisao || undefined}  
                            disabled
                        />
                        <Input
                            label="Revisado em"
                            type="date"
                            placeholder={decision?.reviewedAt || undefined}
                            disabled
                        />
                        <Input
                            label="Resumo da Revisão"
                            type="textarea"
                            containerClassName="md:col-span-2"
                            defaultValue={decision?.resumoRevisao || undefined}
                            disabled
                        />
                        <Input
                            label="Aprendizado"
                            type="textarea"
                            containerClassName="md:col-span-2"
                            defaultValue={decision?.aprendizado || undefined}
                            disabled
                        />
                        <Input
                            label="Próxima ação"
                            type="textarea"
                            containerClassName="md:col-span-2"
                            defaultValue={decision?.proximaAcao || undefined}
                            disabled
                        />
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
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="md:col-span-2 flex flex-col sm:flex-row justify-center gap-4 mt-4">
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
                        onClick={() => setIsEditing(true)}
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
                            setIsModalOpen(false)}
                        }
                    >
                        <label>
                            {decision.titulo}    
                        </label>
                        <form className="flex flex-col gap-2 pt-3" onSubmit={handleSubmitInput(onSubmitInput)}>       
                            <Input
                                type="select"
                                label="Tipo"
                                options={tipoOptions}
                                className="w-full border pl-3 h-10"
                                register={registerInput("tipo")}
                                defaultValue={editingInput?.tipo}
                            />
                            <Input
                                type="textarea"
                                label="Descrição"
                                register={registerInput("descricao")}
                                placeholder="Insira a descrição..."
                                defaultValue={editingInput?.descricao}
                                
                            />
                            <Input
                                type="text"
                                label="Fonte"
                                className="w-full border pl-3 h-10"
                                register={registerInput("fonte")}
                                defaultValue={editingInput?.fonte}
                            />
                            <Input
                                type="select"
                                label="Confiança"
                                options={confiancaOptions}
                                className="w-full border pl-3 h-10"
                                register={registerInput("confianca")}
                                defaultValue={editingInput?.confianca}
                            />
                        <div className="flex flex-row justify-center items-center py-5 gap-4">
                            
                            <Button
                                variant="save" 
                                className="gap-1 w-full"
                                type="submit"
                            >
                                <LucideCheck size={20}/>
                                <label>
                                    Salvar
                                </label>
                            </Button>
                        </div>
                        </form>
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
                                    <label>
                                        Cancelar
                                    </label>
                                </Button>
                                <Button 
                                    variant="cancel" 
                                    onClick={() => handleDeleteDecision()}
                                    type="button"
                                >
                                    <LucideEraser size={20}/>
                                    <label>
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