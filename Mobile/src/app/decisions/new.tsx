import { DecisionFormData } from "@/@types";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { areaMap, areaOptions, impactoMap, impactoOptions, resultadoMap, resultadoOptions, statusMap, statusOptions } from "@/utils/translate";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker"
import Button from "@/components/Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { api } from "@/services/api";

export default function DecisionNew() {
    const [isEditing, setIsEditing] = useState(false)
    const [editingDecision, setEditingDecision] = useState<DecisionFormData>()
    const [isStatusOpen, setIsStatusOpen] = useState(false)
    const [isAreaOpen, setIsAreaOpen] = useState(false)
    const [isImpactoOpen, setIsImpactoOpen] = useState(false)
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const [pickDecidedDate, setPickDecidedDate] = useState(false)
    const [pickRevDate, setPickRevDate] = useState(false)
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof DecisionFormData, string>>>({})
    const [decisionForm, setDecisionForm] = useState<DecisionFormData>({
        titulo: "",
        contexto: "",
        area: "Product",
        impactoEsperado: "low",
        status: "draft",
        responsavel: "",
        decisaoTomada: undefined,
        decidedAt: undefined,
        resultadoRevisao: undefined,
        resumoRevisao: undefined,
        aprendizado: undefined,
        proximaAcao: undefined,
        reviewedAt: undefined
    })

    const {iddecision} = useLocalSearchParams()

    useEffect(() => {
        async function getId() {
            if(iddecision) {
                setIsEditing(true)
                const editingDecision = await api.get(`/decisions/${iddecision}`)
                setDecisionForm(editingDecision.data)
                setEditingDecision(editingDecision.data)
            }
        }
        getId()
    }, [iddecision])

    useEffect(() => {
        if(!isEditing) {
            if(
                decisionForm.status === "draft" ||
                decisionForm.status === "under_analysis"
            ) {
                setDecisionForm(prev => ({
                    ...prev,
                    decisaoTomada: undefined,
                    decidedAt: undefined,
                    resultadoRevisao: undefined,
                    resumoRevisao: undefined,
                    aprendizado: undefined,
                    proximaAcao: undefined,
                    reviewedAt: undefined,
                }))
            }

            if(decisionForm.status === "decided") {
                setDecisionForm(prev => ({
                    ...prev,
                    resultadoRevisao: undefined,
                    resumoRevisao: undefined,
                    aprendizado: undefined,
                    proximaAcao: undefined,
                    reviewedAt: undefined
                }))
            }
        }
    }, [decisionForm.status])

    
    function isFormInvalid() {
        if (!decisionForm.titulo || !decisionForm.contexto || !decisionForm.responsavel || !decisionForm.status) {
            return true;
        }
        
        if (decisionForm.status === "decided" && (!decisionForm.decisaoTomada || !decisionForm.decidedAt)) {
            return true;
        }
        
        if (
            (
                decisionForm.status === "reviewed" || decisionForm.status === "reversed"
            ) 
            && 
            (
                !decisionForm.reviewedAt || !decisionForm.resultadoRevisao || !decisionForm.resumoRevisao
                || !decisionForm.aprendizado || !decisionForm.proximaAcao
            )
        ) {
            return true
        }
        
        return false;
    }

    function validateForm() {
        const errors: Partial<Record<keyof DecisionFormData, string>> = {}

        if(isFormInvalid()) {
            return true
        }

        if (decisionForm.responsavel!.trim().length < 2) errors.responsavel = "Mínimo de 2 caracteres."

        if (decisionForm.titulo!.trim().length < 5) {
            errors.titulo = "Mínimo de 5 caracteres."
        }

        if (decisionForm.contexto!.trim().length < 20) {
            errors.contexto = "Mínimo de 20 caracteres.."
        }

        const notDraftnorAnalisys = ["decided", "reviewed", "reversed"].includes(decisionForm.status || "")

        if(notDraftnorAnalisys && decisionForm.decisaoTomada) {
            if (!decisionForm.decisaoTomada || decisionForm.decisaoTomada.trim().length < 10) {
                errors.decisaoTomada = "Mínimo de 10 caracteres."
            }
        }

        const needRev = ["reviewed", "reversed"].includes(decisionForm.status || "")

        if(needRev) {
            if (decisionForm.resumoRevisao!.trim().length < 10) {
                errors.resumoRevisao = "Mínimo de 10 caracteres."
            }
            
            if (decisionForm.aprendizado!.trim().length < 10) {
                errors.aprendizado = "Mínimo de 10 caracteres."
            }

            if (decisionForm.proximaAcao!.trim().length < 5) {
                errors.proximaAcao = "Mínimo de 5 caracteres."
            }
        }

        setFormErrors(errors)

        return Object.keys(errors).length > 0

    }
    
    async function handleSubmit(data: DecisionFormData) {
        try {
            if(isEditing) {
                await api.put(`/decisions/${iddecision}`, data)
                router.back()
                Alert.alert("Edição concluída!")
            } else {
                await api.post("/decisions", data)
                router.push("/")
                Alert.alert("Decisão criada com sucesso!")
            }
        } catch(err) {
            console.log("Erro", err)
            Alert.alert("Erro ao salvar a decisão")
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <Header 
                page={{title: !isEditing ? "Nova Decisão" : "Atualização de status", type: "others"}} 
                backButton 
                onBack={() => router.back()}
            />
            <ScrollView keyboardShouldPersistTaps="handled">
                <View style={{
                    flexDirection: "column", 
                    gap: 20, 
                    paddingHorizontal: 20, 
                    paddingVertical: 20,
                    width: "100%",
                    alignItems: "center",
                    minHeight: 800
                }}>
                    <View style={{flexDirection: "column", gap: 5, width: "100%"}}>
                        <Text style={{fontWeight: 600}}>Area</Text>
                        <Select 
                            open={isAreaOpen} 
                            onClick={() => {setIsAreaOpen(!isAreaOpen)}}
                            options={areaOptions}
                            placeholder={areaMap[decisionForm.area] || "..."}
                            onSelect={(value: DecisionFormData["area"]) => {
                                setDecisionForm((prev: DecisionFormData) => ({
                                    ...prev,
                                    area: value
                                }))
                                setIsAreaOpen(!isAreaOpen)
                            }}
                            selected={decisionForm.area}
                        />
                    </View>
                    <View style={{
                        width: "100%", 
                        flexDirection: "row", 
                        alignItems: "center", 
                        justifyContent: "space-between",
                        gap: 10,
                    }}>
                        <View style={{flexDirection: "column", gap:5}}>
                            <Text style={{fontWeight: 600}}>Impacto Esperado</Text>
                            
                            <Select 
                                open={isImpactoOpen} 
                                onClick={() => setIsImpactoOpen(!isImpactoOpen)}
                                options={impactoOptions}
                                placeholder={impactoMap[decisionForm.impactoEsperado] || "..."}
                                onSelect={(value: DecisionFormData["impactoEsperado"]) => {
                                    setDecisionForm((prev: DecisionFormData) => ({
                                        ...prev,
                                        impactoEsperado: value
                                    }))
                                    setIsImpactoOpen(!isImpactoOpen)
                                }}
                                selected={decisionForm.impactoEsperado}
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <Input 
                                type="text" 
                                label="Responsável"
                                value={decisionForm.responsavel || ""}
                                error={formErrors.responsavel}
                                onChangeText={v => setDecisionForm(prev => ({
                                    ...prev,
                                    responsavel: v
                                }))}
                            />
                        </View>
                    </View>
                    <View style={{width: "100%"}}>
                        <Input 
                            type="textarea" 
                            label="Título" 
                            value={decisionForm.titulo || ""}
                            error={formErrors.titulo}
                            onChangeText={v => setDecisionForm(prev => ({
                                ...prev,
                                titulo: v
                            }))}
                            disabled={isEditing}
                        />
                        <Input 
                            type="textarea" 
                            label="Contexto" 
                            value={decisionForm.contexto || ""}
                            error={formErrors.contexto}
                            onChangeText={v => setDecisionForm(prev => ({
                                ...prev,
                                contexto: v
                            }))}
                            disabled={isEditing}
                        />
                    </View>
                    <View style={{
                        flexDirection: "column", 
                        gap:5,
                        width: "100%"
                    }}>
                        <Text style={{fontWeight: 600}}>Status</Text>
                        <Select 
                            open={isStatusOpen} 
                            onClick={() => {setIsStatusOpen(!isStatusOpen), console.log("Click")}}
                            options={statusOptions}
                            placeholder={statusMap[decisionForm.status] || "..."}
                            onSelect={(value: DecisionFormData["status"]) => {
                                setDecisionForm((prev: DecisionFormData) => ({
                                    ...prev,
                                    status: value
                                }))
                                setIsStatusOpen(!isStatusOpen)
                            }}
                            selected={decisionForm.status}
                        />
                    </View>

                    {(
                        decisionForm.status === "decided"
                        || decisionForm.status === "reversed"
                        || decisionForm.status === "reviewed"
                    ) && (
                        <>
                            <View style={{
                                width: "100%"
                            }}>
                                <Input 
                                    type="textarea" 
                                    label="Decisão Tomada"
                                    value={decisionForm.decisaoTomada || ""}
                                    error={formErrors.decisaoTomada}
                                    onChangeText={v => setDecisionForm(prev => ({
                                        ...prev,
                                        decisaoTomada: v
                                    }))}
                                    disabled={isEditing && (decisionForm.status === editingDecision?.status)}
                                />
                            </View>
                            <View style={{flexDirection: "column", gap: 5, width: "100%"}}>
                                <Text style={{fontSize: 15, fontWeight: 600}}>Decidido em</Text>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: (
                                            (decisionForm.status !== editingDecision?.status)
                                        ) ? "white" : "#e5e7eb", 
                                        paddingHorizontal: 10,
                                        paddingVertical: 10,
                                        borderWidth: 1,
                                        borderColor: "#d1d5db"
                                    }}
                                    onPress={() => setPickDecidedDate(true)}
                                    activeOpacity={0.8}
                                    disabled={isEditing && (decisionForm.status === editingDecision?.status)}
                                >
                                    
                                    <Text>
                                        {
                                            decisionForm.decidedAt 
                                            ? 
                                            new Date(decisionForm.decidedAt)
                                            .toLocaleString("pt-BR", {dateStyle: "short"})
                                            :
                                            new Date().toLocaleString("pt-BR", {dateStyle: "short"})
                                        }
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                    {pickDecidedDate && (
                        <DateTimePicker 
                            value={
                                decisionForm.decidedAt && !isNaN(Date.parse(decisionForm.decidedAt))
                                    ? new Date(decisionForm.decidedAt)
                                    : new Date()
                            }
                            mode="date"
                            onValueChange={(_, selectedDate) => {
                                setPickDecidedDate(false)
                                
                                if (selectedDate) {
                                    setDecisionForm((prev) => ({
                                        ...prev,
                                        decidedAt: selectedDate.toISOString()
                                    }))
                                }
                            }}
                            onDismiss={() => setPickDecidedDate(false)}

                        />
                    )}
                    {(decisionForm.status === "reviewed" || decisionForm.status === "reversed") &&
                    <>
                        <View style={{
                            flexDirection: "column", 
                            gap:5,
                            width: "100%"
                        }}>
                            <Text style={{fontWeight: 600}}>Resultado da revisão</Text>
                            <Select 
                                open={isReviewOpen} 
                                onClick={() => {setIsReviewOpen(!isReviewOpen)}}
                                options={resultadoOptions}
                                placeholder={resultadoMap[decisionForm.resultadoRevisao!] || "..."}
                                onSelect={(value: DecisionFormData["resultadoRevisao"]) => {
                                    setDecisionForm((prev: DecisionFormData) => ({
                                        ...prev,
                                        resultadoRevisao: value
                                    }))
                                    setIsReviewOpen(!isReviewOpen)
                                }}
                                selected={decisionForm.resultadoRevisao}
                            />
                        </View>
                        <View style={{
                            width: "100%"
                        }}>
                            <Input 
                                type="textarea" 
                                label="Resumo da revisão"
                                value={decisionForm.resumoRevisao || ""}
                                error={formErrors.resumoRevisao}
                                disabled={isEditing && (decisionForm.status === editingDecision?.status)}
                                onChangeText={v => setDecisionForm(prev => ({
                                ...prev,
                                resumoRevisao: v
                            }))}
                            />
                        </View>
                        <View style={{
                            width: "100%"
                        }}>
                            <Input 
                                type="textarea" 
                                label="Aprendizado"
                                disabled={isEditing && (decisionForm.status === editingDecision?.status)}
                                value={decisionForm.aprendizado || ""}
                                error={formErrors.aprendizado}
                                onChangeText={v => setDecisionForm(prev => ({
                                ...prev,
                                aprendizado: v
                            }))}
                            />
                        </View>
                        <View style={{
                            width: "100%"
                        }}>
                            <Input 
                                type="textarea" 
                                label="Próxima ação"
                                disabled={isEditing && (decisionForm.status === editingDecision?.status)}
                                value={decisionForm.proximaAcao || ""}
                                error={formErrors.proximaAcao}
                                onChangeText={v => setDecisionForm(prev => ({
                                ...prev,
                                proximaAcao: v
                            }))}
                            />
                        </View>
                        <View style={{
                            flexDirection: "column", 
                            gap: 5,
                            width: "100%"
                        }}>
                            <Text style={{fontSize: 15, fontWeight: 600}}>Revisada em</Text>
                            <TouchableOpacity 
                                style={{
                                    backgroundColor: (decisionForm.status !== editingDecision?.status) ? "white" : "#e5e7eb", 
                                    paddingHorizontal: 10,
                                    paddingVertical: 10,
                                    borderWidth: 1,
                                    borderColor: "#d1d5db"
                                }}
                                onPress={() => setPickRevDate(true)}
                                activeOpacity={0.8}
                                disabled={isEditing && (decisionForm.status === editingDecision?.status)}
                            >
                                
                                <Text>
                                    {
                                        decisionForm.reviewedAt 
                                        ? 
                                        new Date(decisionForm.reviewedAt)
                                        .toLocaleString("pt-BR", {dateStyle: "short"})
                                        :
                                        new Date().toLocaleString("pt-BR", {dateStyle: "short"})
                                    }
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                    }
                    {pickRevDate && (
                        <DateTimePicker 
                            value={
                                decisionForm.reviewedAt && !isNaN(Date.parse(decisionForm.reviewedAt))
                                    ? new Date(decisionForm.reviewedAt)
                                    : new Date()
                            }
                            mode="date"
                            onValueChange={(_, selectedDate) => {
                                setPickRevDate(false)
                                
                                if (selectedDate) {
                                    setDecisionForm((prev) => ({
                                        ...prev,
                                        reviewedAt: selectedDate.toISOString()
                                    }))
                                }
                            }}
                            onDismiss={() => setPickRevDate(false)}
                        />
                    )}
                </View>
            </ScrollView>
            <View 
                style={[{
                    width: "100%", 
                    paddingVertical: 20, 
                    alignItems: 'center', 
                    justifyContent: "center"
                }, isEditing && {
                    flexDirection: "column",
                    gap: 10
                }]}>
                <Button
                    disabled={isFormInvalid() || (isEditing && (decisionForm === editingDecision))}
                    style={{
                        backgroundColor: "#22c55e", 
                        padding: 10, 
                        width: "80%",
                        flexDirection: "row",
                        gap: 5,
                    }}
                    onPress={() => {
                        const error = validateForm()

                        if(!error) {
                            handleSubmit(decisionForm)
                        } else {
                            Alert.alert("Campos pendentes", "Por favor corrija os erros no formulário")
                        }
                    }}
                >
                    <MaterialCommunityIcons name="content-save" size={20} color={"white"}/>
                    
                    <Text style={{fontSize: 18, color: 'white', fontWeight: 600}}>
                        Salvar
                    </Text>
                </Button>

                {isEditing && (
                    <Button
                    style={{
                        backgroundColor: "#ef4444", 
                        padding: 10, 
                        width: "80%",
                        flexDirection: "row",
                        gap: 5,
                    }}
                    onPress={() => router.back()}
                >
                    <MaterialCommunityIcons name="cancel" size={20} color={"white"}/>
                    
                    <Text style={{fontSize: 18, color: 'white', fontWeight: 600}}>
                        Cancelar
                    </Text>
                </Button>
                )}
            </View>
        </SafeAreaView>
    )
}