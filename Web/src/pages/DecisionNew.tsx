import { useForm, useWatch } from "react-hook-form";
import { DecisionContainer } from "../components/Container";
import { Input } from "../components/Input";
import type { DecisionFormData } from "../@types";
import { areaOptions, impactoOptions, resultadoOptions, statusOptions } from "../utils/translate";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { toast } from "sonner";
import { useEffect } from "react";

export function DecisionNew() {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {register, unregister, handleSubmit, control, formState: {errors}} = useForm<DecisionFormData>()

    const status = useWatch({ control, name: "status" })
    
    const navigate = useNavigate()

    async function onSubmit(data: DecisionFormData) {
        try {
            console.log(data)
            await api.post("/decisions", data)
            toast.success("✅ Decisão criada com sucesso!", {position: "bottom-right"})
            setTimeout(() => navigate("/"),500)

        } catch(err) {
            console.log(err.response.data)
            toast.error("❌ Erro ao criar decisão! ❌")
        }
    }

    useEffect(() => {

        if(status !== "reviewed" && status !== "reversed" && status !== "decided") {
            unregister([
                "decisaoTomada",
                "decidedAt"
            ])
        }

        if(status !== "reviewed" && status !== "reversed") {
            unregister([
                "resultadoRevisao",
                "reviewedAt",
                "resumoRevisao",
                "aprendizado",
                "proximaAcao",
            ])
        }

    }, [status, unregister])

    return (
        <DecisionContainer centralized>
            <h1 className="font-bold text-2xl mb-5">Nova Decisão</h1>
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 p-10 rounded-xl border"
            >
                    <Input
                        label="Área"
                        type="select"
                        className="w-full border pl-3 h-10"
                        register={register('area')}
                        options={areaOptions}
                    />

                    <Input
                        label="Impacto Esperado"
                        type="select"
                        className="w-full border pl-3 h-10"
                        register={register('impactoEsperado')}
                        options={impactoOptions}
                    />
                    <Input 
                        label="Responsável" 
                        type="text" 
                        className="w-full border h-10 pl-2"
                        placeholder="Insira um nome..."
                        register={register('responsavel', {
                            required: "Responsável é obrigatório",
                            minLength: {value: 2, message: "Mínimo de 2 caracteres"}
                        })}
                        error={errors.responsavel?.message}
                    />

                    <Input
                        label="Status"
                        type="select"
                        className="w-full border pl-3 h-10"
                        register={register('status')}
                        options={statusOptions}
                    />

                <div className="md:col-span-2">
                    <Input 
                        label="Título" 
                        type="textarea" 
                        placeholder="Insira um título..."
                        register={register('titulo', {
                            required: "Título é obrigatório",
                            minLength: {value: 5, message: "Mínimo de 5 caracteres"}
                        })}
                        error={errors.titulo?.message}
                    />
                </div>

                <div className="md:col-span-2">
                <Input 
                    label="Contexto" 
                    type="textarea" 
                    placeholder="Insira o contexto..."
                    register={register('contexto', {
                        required: "Contexto é obrigatório",
                        minLength: {value: 20, message: "Mínimo de 20 caracteres"}
                    })}
                    error={errors.contexto?.message}
                />
                </div>
                
                {(status === "decided" || status === "reviewed" || status === "reversed") && (
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            label="Decisão Tomada" 
                            type="textarea"
                            register={register("decisaoTomada", {
                                required: "Decisão é obrigatória"
                            })}
                            containerClassName="md:col-span-2"
                            placeholder="Insira a decisão aqui..."
                            error={errors.decisaoTomada?.message}
                        />

                        <Input
                            label="Decidido em"
                            type="date"
                            register={register("decidedAt", {
                                required: "Data de revisão é obrigatória"
                            })}
                            containerClassName="md:col-span-2"
                            error={errors.decidedAt?.message}
                        />
                    </div>
                )}

                {(status === "reviewed" || status === "reversed") && (
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Resultado da revisão"
                            type="select"
                            className="w-full border pl-3 h-10"
                            options={resultadoOptions}
                            register={register("resultadoRevisao")}
                        />
                        <Input
                            label="Revisado em"
                            type="date"
                            register={register("reviewedAt", {
                                required: "Data de revisão é obrigatória"
                            })}
                            error={errors.reviewedAt?.message}
                        />
                        <Input
                            label="Resumo da revisão"
                            type="textarea"
                            containerClassName="md:col-span-2"
                            register={register("resumoRevisao", {
                                required: "Resumo da revisão é obrigatório"
                            })}
                            error={errors.resumoRevisao?.message}
                        />
                        <Input
                            label="Aprendizado"
                            type="textarea"
                            containerClassName="md:col-span-2"
                            register={register("aprendizado", {
                                required: "Aprendizado é obrigatório"
                            })}
                            error={errors.aprendizado?.message}
                        />
                        <Input
                            label="Próxima ação"
                            type="textarea"
                            containerClassName="md:col-span-2"
                            register={register("proximaAcao", {
                                required: "Próxima ação é obrigatória"
                            })}
                            error={errors.proximaAcao?.message}
                        />
                    </div>
                )}
                <div className="md:col-span-2 flex flex-col sm:flex-row justify-center gap-4 mt-4">
                    <Button 
                        variant="save" 
                        type="submit" 
                        className="w-full sm:w-auto px-6 py-2"
                    >
                        Salvar
                    </Button>
                    <Button 
                        type="button" 
                        variant="cancel"
                        className="w-full sm:w-auto px-6 py-2"
                        onClick={() => navigate("/")}
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </DecisionContainer>
    )
}