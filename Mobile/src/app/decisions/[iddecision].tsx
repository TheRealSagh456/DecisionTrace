import { Decision, DecisionInput } from "@/@types";
import Header from "@/components/Header";
import { areaMap, confiancaMap, confiancaOptions, impactoMap, resultadoMap, statusMap, tipoMap, tipoOptions } from "@/utils/translate";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "@/services/api";
import Button from "@/components/Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Select from "@/components/Select";
import Input from "@/components/Input";
import InputCard from "@/components/InputCard";

export default function DecisionDetail() {
    const [decision, setDecision] = useState<Decision>()
    const [decisionInputs, setDecisionInputs] = useState<DecisionInput[]>([])
    const [inputForm, setInputForm] = useState<Partial<DecisionInput>>()
    const [InputModal, setInputModal] = useState(false)
    const [isTipoOpen, setIsTipoOpen] = useState(false)
    const [isConfiancaOpen, setIsConfiancaOpen] = useState(false)
    const {iddecision} = useLocalSearchParams()
    const [inputErrors, setInputErrors] = useState<Partial<Record<keyof DecisionInput, string>>>({})

    async function handleDelete() {
        Alert.alert(
            "Excluir decisão",
            "Ao apagá-la, os insumos também serão removidos. Deseja continuar?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Apagar", 
                    style: "destructive",
                    onPress: async () => {
                        await api.delete(`/decisions/${iddecision}`)
                        router.back()
                    }
                }
            ]
        )
    } 
    
    async function loadData() {
        const decisionResponse = await api.get(`/decisions/${iddecision}`)
        const inputsResponse = await api.get(`/decisions/${iddecision}/inputs`)

        setDecision(decisionResponse.data)
        setDecisionInputs(inputsResponse.data)
    }

    function validateForm() {
        const errors: Partial<Record<keyof DecisionInput, string>> = {}

        if (!inputForm?.descricao || inputForm.descricao.trim().length < 10) {
            errors.descricao = "Mínimo de 10 caracteres."
        }

        if (!inputForm?.fonte || inputForm.fonte.trim().length < 2) {
            errors.fonte = "Mínimo de 2 caracteres."
        }

        setInputErrors(errors)

        return Object.keys(errors).length > 0
    }

    useFocusEffect(
        useCallback(() => {
            loadData()
        }, [iddecision])
    )

     if(!decision) return (
        <SafeAreaView style={{flex: 1}}>
            <Header page={{title: "Detalhe", type: "others"}} backButton onBack={() => router.back()}/>
            <Text>Carregando...</Text>
        </SafeAreaView>
    )

    return (
        <SafeAreaView style={styles.container}>
            <Header 
                page={{type: "others", title: "Detalhes da decisão"}} 
                backButton 
                rightButton={{type: "edit"}}
                onBack={() => router.back()}
                onEdit={() => router.push(`/decisions/new?iddecision=${iddecision}`)}
            />
            <ScrollView keyboardShouldPersistTaps="handled">
                <View style={{
                    flexDirection: "column",
                    gap: 20,
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                    width: "100%",
                    alignItems: "center",
                }}>
                    <View style={{flexDirection: "column", gap: 5, width: "100%"}}>
                        <Text style={{fontWeight: 600}}>Área</Text>
                        <Text style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderWidth: 1,
                            borderColor: "#d1d5db",
                            backgroundColor: "#e5e7eb"
                        }}>
                            {areaMap[decision.area]}
                        </Text>
                    </View>

                    <View style={{
                        width: "100%",
                        flexDirection: "row",
                        gap: 10
                    }}>
                        <View style={{flexDirection: "column", gap: 5, flex: 1}}>
                            <Text style={{fontWeight: 600}}>Impacto Esperado</Text>
                            <Text style={{
                                paddingVertical: 10,
                                paddingHorizontal: 10,
                                borderWidth: 1,
                                borderColor: "#d1d5db",
                                backgroundColor: "#e5e7eb"
                            }}>
                                {impactoMap[decision.impactoEsperado]}
                            </Text>
                        </View>
                        <View style={{flexDirection: "column", gap: 5, flex: 1}}>
                            <Text style={{fontWeight: 600}}>Responsável</Text>
                            <Text style={{
                                paddingVertical: 10,
                                paddingHorizontal: 10,
                                borderWidth: 1,
                                borderColor: "#d1d5db",
                                backgroundColor: "#e5e7eb"
                            }}>
                                {decision.responsavel}
                            </Text>
                        </View>
                    </View>

                    <View style={{width: "100%", flexDirection: "column", gap: 5}}>
                        <Text style={{fontWeight: 600}}>Título</Text>
                        <Text style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderWidth: 1,
                            borderColor: "#d1d5db",
                            backgroundColor: "#e5e7eb"
                        }}>
                            {decision.titulo}
                        </Text>
                    </View>

                    <View style={{width: "100%", flexDirection: "column", gap: 5}}>
                        <Text style={{fontWeight: 600}}>Contexto</Text>
                        <Text style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderWidth: 1,
                            borderColor: "#d1d5db",
                            backgroundColor: "#e5e7eb"
                        }}>
                            {decision.contexto}
                        </Text>
                    </View>

                    <View style={{flexDirection: "column", gap: 5, width: "100%"}}>
                        <Text style={{fontWeight: 600}}>Status</Text>
                        <Text style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderWidth: 1,
                            borderColor: "#d1d5db",
                            backgroundColor: "#e5e7eb"
                        }}>
                            {statusMap[decision.status]}
                        </Text>
                    </View>

                    {(decision.status === "decided" || decision.status === "reviewed" || decision.status === "reversed") && (
                        <>
                            <View style={{width: "100%", flexDirection: "column", gap: 5}}>
                                <Text style={{fontWeight: 600}}>Decisão Tomada</Text>
                                <Text style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                    borderWidth: 1,
                                    borderColor: "#d1d5db",
                                    backgroundColor: "#e5e7eb"
                                }}>
                                    {decision.decisaoTomada}
                                </Text>
                            </View>
                            <View style={{width: "100%", flexDirection: "column", gap: 5}}>
                                <Text style={{fontWeight: 600}}>Decidido em</Text>
                                <Text style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                    borderWidth: 1,
                                    borderColor: "#d1d5db",
                                    backgroundColor: "#e5e7eb"
                                }}>
                                    {decision.decidedAt ? new Date(decision.decidedAt).toLocaleDateString('pt-BR') : "-"}
                                </Text>
                            </View>
                        </>
                    )}

                    {(decision.status === "reviewed" || decision.status === "reversed") && (
                        <>
                            <View style={{width: "100%", flexDirection: "column", gap: 5}}>
                                <Text style={{fontWeight: 600}}>Resultado da Revisão</Text>
                                <Text style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                    borderWidth: 1,
                                    borderColor: "#d1d5db",
                                    backgroundColor: "#e5e7eb"
                                }}>
                                    {resultadoMap[decision.resultadoRevisao ?? ""]}
                                </Text>
                            </View>
                            <View style={{width: "100%", flexDirection: "column", gap: 5}}>
                                <Text style={{fontWeight: 600}}>Resumo da Revisão</Text>
                                <Text style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                    borderWidth: 1,
                                    borderColor: "#d1d5db",
                                    backgroundColor: "#e5e7eb"
                                }}>
                                    {decision.resumoRevisao}
                                </Text>
                            </View>
                            <View style={{width: "100%", flexDirection: "column", gap: 5}}>
                                <Text style={{fontWeight: 600}}>Aprendizado</Text>
                                <Text style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                    borderWidth: 1,
                                    borderColor: "#d1d5db",
                                    backgroundColor: "#e5e7eb"
                                }}>
                                    {decision.aprendizado}
                                </Text>
                            </View>
                            <View style={{width: "100%", flexDirection: "column", gap: 5}}>
                                <Text style={{fontWeight: 600}}>Próxima Ação</Text>
                                <Text style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                    borderWidth: 1,
                                    borderColor: "#d1d5db",
                                    backgroundColor: "#e5e7eb"
                                }}>
                                    {decision.proximaAcao}
                                </Text>
                            </View>
                            <View style={{width: "100%", flexDirection: "column", gap: 5}}>
                                <Text style={{fontWeight: 600}}>Revisado em</Text>
                                <Text style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                    borderWidth: 1,
                                    borderColor: "#d1d5db",
                                    backgroundColor: "#e5e7eb"
                                }}>
                                    {decision.reviewedAt ? new Date(decision.reviewedAt).toLocaleDateString('pt-BR') : "-"}
                                </Text>
                            </View>
                        </>
                    )}
                    <View>
                        <View 
                            style={{
                                width: "100%",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={{fontSize: 20, fontWeight: 700}}>
                                {`Hipóteses/Evidências(${decisionInputs.length})`}
                            </Text>
                            <Button
                        style={{
                            backgroundColor: "#44a2ef",
                            padding: 10,
                            width: "auto",
                            flexDirection: "row",
                            gap: 5,
                            right: 0
                        }}
                        onPress={() => {
                            setInputModal(true)
                            setInputForm({
                                confianca: "low",
                                descricao: "",
                                fonte: "",
                                tipo: "hypothesis",
                            })
                        }}
                    >
                        <MaterialCommunityIcons name="plus" size={20} color={"white"}/>
                        <Text style={{fontSize: 15, color: "white", fontWeight: 600}}>Insumo</Text>
                    </Button>
                        </View>
                    </View>
                    <View 
                        style={{
                            borderWidth: 2, 
                            width:"100%", 
                            borderColor: "#d1d5db",
                            flexDirection: "column",
                        }}>
                        
                        {decisionInputs.map((input) => (
                            <InputCard 
                                data={input}
                                key={input.idinput}
                                onEdit={() => {
                                    setInputForm(input)
                                    setInputModal(true)
                                }}
                                onDelete={async () => {
                                    await api.delete(`/inputs/${input.idinput}`)
                                    setDecisionInputs(
                                        prev => prev.filter(
                                            item => item.idinput !== input.idinput
                                        )
                                    )
                                }}
                            />
                        ))}
                        
                    </View>
                </View>
            </ScrollView>

            {InputModal && (
                <>
                    <TouchableOpacity style={{
                        position: "absolute", 
                        flex: 1, 
                        zIndex: 20, 
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        top: 0, left: 0, right: 0, bottom: 0
                    }}
                    activeOpacity={1}
                    onPress={() => setInputModal(false)}
                    />
                    <SafeAreaView style={{
                        position: "absolute",
                        zIndex: 40,
                        width: "100%",
                        alignSelf: "center",
                        height: "85%",
                        backgroundColor: "white",
                        bottom: 0,
                        borderTopLeftRadius: 28,
                        borderTopRightRadius: 28,
                        paddingTop: 15
                    }} edges={["bottom", "left", "right"]}>

                        <Text style={{ fontSize: 20, fontWeight: 600, paddingLeft: 20 }}>
                            {inputForm?.idinput ? "Editar Insumo" : "Novo Insumo"}
                        </Text>
                        <View style={{
                            backgroundColor: "gray", height: 2, width: "100%",
                            borderRadius: 40, marginVertical: 15
                        }}/>

                        <ScrollView style={{paddingHorizontal: 20}}>
                            <View style={{flexDirection: "column", gap: 20}}>
                                <View style={{flexDirection: "column", gap: 5}}>
                                    <Text style={{fontWeight: 600}}>Tipo</Text>
                                    <Select 
                                        open={isTipoOpen} 
                                        onClick={() => setIsTipoOpen(!isTipoOpen)}
                                        options={tipoOptions}
                                        placeholder={tipoMap[inputForm?.tipo!] || "Selecione..."}
                                        onSelect={(value: DecisionInput["tipo"]) => {
                                            setInputForm(prev => ({...prev, tipo: value}))
                                            setIsTipoOpen(false)
                                        }}
                                        selected={inputForm?.tipo}
                                    />
                                </View>

                                <View style={{flexDirection: "column", gap: 5}}>
                                    <Text style={{fontWeight: 600}}>Descrição</Text>
                                    <Input
                                        type="textarea"
                                        value={inputForm?.descricao || ""}
                                        onChangeText={v => setInputForm(prev => ({...prev, descricao: v}))}
                                        placeholder="Descreva a hipótese ou evidência..."
                                        placeholderTextColor="gray"
                                        error={inputErrors.descricao}
                                    />
                                </View>

                                <View style={{flexDirection: "column", gap: 5}}>
                                    <Text style={{fontWeight: 600}}>Fonte</Text>
                                    <Input
                                        type="text"
                                        value={inputForm?.fonte || ""}
                                        onChangeText={v => setInputForm(prev => ({...prev, fonte: v}))}
                                        placeholder="De onde veio essa informação?"
                                        placeholderTextColor="gray"
                                        error={inputErrors.fonte}
                                    />
                                </View>

                                <View style={{flexDirection: "column", gap: 5}}>
                                    <Text style={{fontWeight: 600}}>Confiança</Text>
                                    <Select 
                                        open={isConfiancaOpen} 
                                        onClick={() => setIsConfiancaOpen(!isConfiancaOpen)}
                                        options={confiancaOptions}
                                        placeholder={confiancaMap[inputForm?.confianca!] || "Selecione..."}
                                        onSelect={(value: DecisionInput["confianca"]) => {
                                            setInputForm(prev => ({...prev, confianca: value}))
                                            setIsConfiancaOpen(false)
                                        }}
                                        selected={inputForm?.confianca}
                                    />
                                </View>
                            </View>
                        </ScrollView>

                        <View style={{
                            paddingHorizontal: 20, paddingVertical: 20,
                            flexDirection: "column", gap: 10, alignItems: "center"
                        }}>
                            <Button
                                style={{
                                    backgroundColor: "#22c55e", padding: 10,
                                    width: "80%", flexDirection: "row", gap: 5
                                }}
                                onPress={async () => {
                                    
                                    const error = validateForm()

                                    if(!error) {
                                        try {
                                            if(inputForm?.idinput) {
                                                await api.put(`/inputs/${inputForm.idinput}`, inputForm)
                                                setDecisionInputs(prev => prev.map(i => 
                                                    i.idinput === inputForm.idinput ? {...i, ...inputForm} as DecisionInput : i
                                                ))
                                            } else {
                                                const response = await api.post(`/decisions/${iddecision}/inputs`, inputForm)
                                                setDecisionInputs(prev => [...prev, response.data])
                                            }

                                            setInputModal(false)
                                        } catch(err) {
                                            Alert.alert("Erro ao salvar insumo")
                                        }    
                                    } else {
                                        Alert.alert("Campos pendentes", "Por favor corrija os erros no formulário")
                                    }
                                }}
                            >
                                <MaterialCommunityIcons name="content-save" size={20} color={"white"}/>
                                <Text style={{fontSize: 18, color: "white", fontWeight: 600}}>Salvar</Text>
                            </Button>

                            <Button
                                style={{
                                    backgroundColor: "#6b7280", padding: 10,
                                    width: "80%", flexDirection: "row", gap: 5
                                }}
                                onPress={() => setInputModal(false)}
                            >
                                <MaterialCommunityIcons name="cancel" size={20} color={"white"}/>
                                <Text style={{fontSize: 18, color: "white", fontWeight: 600}}>Cancelar</Text>
                            </Button>
                        </View>
                    </SafeAreaView>
                </>
)}

            <View style={{
                width: "100%",
                paddingVertical: 20,
                alignItems: "center",
                flexDirection: "column",
                gap: 10
            }}>
                <Button
                    style={{
                        backgroundColor: "#ef4444",
                        padding: 10,
                        width: "80%",
                        flexDirection: "row",
                        gap: 5
                    }}
                    onPress={handleDelete}
                >
                    <MaterialCommunityIcons name="delete" size={20} color={"white"}/>
                    <Text style={{fontSize: 18, color: "white", fontWeight: 600}}>Apagar</Text>
                </Button>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
            container: {
            flex: 1,
            backgroundColor: '#fff',
            alignItems: "center",
            paddingBottom: 20
        },
    });