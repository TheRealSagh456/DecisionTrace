import { useForm, useWatch } from "react-hook-form";
import { DecisionContainer } from "../components/Container";
import { Input } from "../components/Input";
import type { DecisionFormData } from "../@types";
import { areaOptions, impactoOptions, resultadoOptions, statusOptions } from "../utils/translate";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export function DecisionNew() {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {register, handleSubmit, control, formState: {errors}} = useForm<DecisionFormData>()

    const status = useWatch({ control, name: "status" })
    
    const navigate = useNavigate()

    function onSubmit(data: DecisionFormData) {
        api.post("/decisions", data)
        navigate("/")
    }

    return (
        <DecisionContainer>
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
                        register={register('responsavel')}
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
                        register={register('titulo')}
                    />
                </div>

                <div className="md:col-span-2">
                <Input 
                    label="Contexto" 
                    type="textarea" 
                    placeholder="Insira o contexto..."
                    register={register('contexto')}
                />
                </div>
                
                {status === "decided" && (
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            label="Decisão Tomada" 
                            type="textarea"
                            register={register("decisaoTomada")}
                            containerClassName="md:col-span-2"
                            placeholder="Insira a decisão aqui..."
                        />

                        <Input
                            label="Decidido em"
                            type="date"
                            register={register("decidedAt")}
                            containerClassName="md:col-span-2"
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
                            register={register("reviewedAt")}
                        />
                        <Input
                            label="Resumo da revisão"
                            type="textarea"
                            containerClassName="md:col-span-2"
                            register={register("resumoRevisao")}
                        />
                        <Input
                            label="Aprendizado"
                            type="textarea"
                            containerClassName="md:col-span-2"
                            register={register("aprendizado")}
                        />
                        <Input
                            label="Próxima ação"
                            type="textarea"
                            containerClassName="md:col-span-2"
                            register={register("proximaAcao")}
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