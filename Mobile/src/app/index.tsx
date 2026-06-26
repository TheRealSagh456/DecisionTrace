import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Decision } from '../@types';
import { api } from '../services/api';
import DecisionCard from '@/components/DecisionCard';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDebounce } from "use-debounce"
import Header from '@/components/Header';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Select from '@/components/Select';
import { areaMap, areaOptions, impactoMap, impactoOptions, statusMap, statusOptions } from '@/utils/translate';

export default function Index() {
    const [decisions, setDecisions] = useState<Decision[]>([])
    const [search, setSearch] = useState("")
    const [debouncedSearch] = useDebounce(search, 400)
    const [isFiltering, setIsFiltering] = useState(false)
    const [isStatusOpen, setIsStatusOpen] = useState(false)
    const [isAreaOpen, setIsAreaOpen] = useState(false)
    const [isImpactoOpen, setIsImpactoOpen] = useState(false)
    const [showingFiltered, setShowingFiltered] = useState(false)
    const [filterOptions, setFilterOptions] = useState<{
        area: string | undefined
        status: string | undefined
        impactoEsperado: string | undefined
    }>({
        area: undefined,
        status: undefined,
        impactoEsperado: undefined
    })
    const [appliedFilters, setAppliedFilters] = useState({
        area: undefined,
        status: undefined,
        impactoEsperado: undefined
    })

    useEffect(() => {
        async function fetchDecisions() {
            try{
                const response = await api.get("/decisions", {
                    params: {
                        q: debouncedSearch || undefined,
                        status: showingFiltered ? appliedFilters.status : undefined,
                        area: showingFiltered ? appliedFilters.area : undefined,
                        impactoEsperado: showingFiltered ? appliedFilters.impactoEsperado : undefined
                    }
                })

                if(!response) {
                    return console.log("Nenhuma decision encontrada")
                }

                setDecisions(response.data.items)
            } catch (err) {
                console.log("ERRO", err)
            }
        }
        fetchDecisions()
        console.log("Fetchou!")
    }, [debouncedSearch, showingFiltered, appliedFilters])

    return (
    <SafeAreaView style={[styles.container, {position: "relative"}]}>
        <Header page={{type: "main", title: "DecisionTrace"}}/>
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
        }}>
            <View style={{flex: 1}}>
                <Input 
                    type='text'
                    search 
                    placeholder='Buscar por contexto...' 
                    placeholderTextColor={"gray"}
                    onChangeText={setSearch}
                />
            </View>
            <TouchableOpacity 
                style={{
                    backgroundColor: "purple", 
                    width: 50, 
                    alignItems: "center", 
                    justifyContent: "center", 
                    height: 43
                }}
                onPress={() => setIsFiltering(true)}
                >
                <MaterialIcons name='filter-alt' size={30} color={"white"}/>
            </TouchableOpacity>
        </View>
        <FlatList
            data={decisions}
            keyExtractor={item => item.iddecision}
            renderItem={({item}) => (
                <DecisionCard
                    data={item}
                    key={item.iddecision}
                    onPress={() => router.push(`/decisions/${item.iddecision}`)}
                />
            )}
        />
        <Button 
            style={{backgroundColor: "purple", padding: 10, width: "80%", marginVertical: 10, marginTop: 20}}
            onPress={() => router.push("/decisions/new")}
        >
            <Text style={{fontSize: 18, color: 'white', fontWeight: 600}}>
                Novo
            </Text>
        </Button>

            {isFiltering && (
                <>
                    <TouchableOpacity style={{
                        position: "absolute", 
                        flex: 1, 
                        zIndex: 20, 
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }}
                    activeOpacity={1}
                    onPress={() => setIsFiltering(false)}
                    />
                    <SafeAreaView style={{
                        position: "absolute",
                        zIndex: 40,
                        width: "100%",
                        alignSelf: "center",
                        height: "67%",
                        backgroundColor: "white",
                        bottom: 0,
                        borderTopLeftRadius: 28,
                        borderTopRightRadius: 28,
                        paddingTop: 15
                    }} edges={["bottom", "left", "right"]}>

                        <Text 
                            style={{
                                fontSize: 20, 
                                fontWeight: 600,
                                paddingLeft: 20
                            }}
                        >
                            Filtragem
                        </Text>
                        <View 
                            style={{
                                backgroundColor: "gray", 
                                height: 2, 
                                width: "100%", 
                                borderRadius: 40,
                                marginVertical: 15
                            }}
                        />
                        <View style={{flexDirection: "column", gap: 20, paddingHorizontal: 20}}>
                            <View style={{flexDirection: "column", gap:5}}>
                                <Text style={{fontWeight: 600}}>Status</Text>
                                <Select 
                                    open={isStatusOpen} 
                                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                                    options={statusOptions}
                                    placeholder={statusMap[filterOptions.status] || "Todos"}
                                    onSelect={(value) => {
                                        setFilterOptions((prev) => ({
                                            ...prev,
                                            status: value
                                        }))
                                        setIsStatusOpen(!isStatusOpen)
                                    }}
                                    selected={filterOptions.status}
                                />
                            </View>
                            <View style={{flexDirection: "column", gap:5}}>
                                <Text style={{fontWeight: 600}}>Area</Text>
                                <Select 
                                    open={isAreaOpen} 
                                    onClick={() => setIsAreaOpen(!isAreaOpen)}
                                    options={areaOptions}
                                    placeholder={areaMap[filterOptions.area] || "Todos"}
                                    onSelect={(value) => {
                                        setFilterOptions((prev) => ({
                                            ...prev,
                                            area: value
                                        }))
                                        setIsAreaOpen(!isAreaOpen)
                                    }}
                                    selected={filterOptions.area}
                                />
                            </View>
                            <View style={{flexDirection: "column", gap:5}}>
                                <Text style={{fontWeight: 600}}>Impacto Esperado</Text>
                                <Select 
                                    open={isImpactoOpen} 
                                    onClick={() => setIsImpactoOpen(!isImpactoOpen)}
                                    options={impactoOptions}
                                    placeholder={impactoMap[filterOptions.impactoEsperado] || "Todos"}
                                    onSelect={(value) => {
                                        setFilterOptions((prev) => ({
                                            ...prev,
                                            impactoEsperado: value
                                        }))
                                        setIsImpactoOpen(!isImpactoOpen)
                                    }}
                                    selected={filterOptions.impactoEsperado}
                                />
                            </View>
                        </View>
                        <View style={{
                            flex: 1, 
                            flexDirection:'column', 
                            gap: 10, 
                            alignItems: "center", 
                            justifyContent: "center",
                        }}>
                            <Button
                                style={{
                                    backgroundColor: "purple", 
                                    padding: 10, 
                                    width: "80%",
                                    flexDirection: "row",
                                    gap: 5
                                }}
                                onPress={() => {
                                    setShowingFiltered(true)
                                    setAppliedFilters(filterOptions)
                                    setIsFiltering(false)
                                    setIsAreaOpen(false)
                                    setIsStatusOpen(false)
                                    setIsImpactoOpen(false)
                                }}
                            >
                                <MaterialCommunityIcons name="filter" size={20} color={"white"}/>
                                
                                <Text style={{fontSize: 18, color: 'white', fontWeight: 600}}>
                                    Filtrar
                                </Text>
                            </Button>
                            {showingFiltered && (
                                <Button 
                                style={{
                                    backgroundColor: "#525252", 
                                    padding: 10, 
                                    width: "80%",
                                    flexDirection: "row",
                                    gap: 5
                                }}
                                onPress={() => {
                                    setShowingFiltered(false)
                                    setIsFiltering(false)
                                    setIsAreaOpen(false)
                                    setIsStatusOpen(false)
                                    setIsImpactoOpen(false)
                                    setFilterOptions({
                                        area: undefined,
                                        impactoEsperado: undefined,
                                        status: undefined
                                    })
                                }}
                            >
                                <MaterialCommunityIcons name="filter-off" size={20} color={"white"}/>
                                
                                <Text style={{fontSize: 18, color: 'white', fontWeight: 600}}>
                                    Remover Filtro
                                </Text>
                            </Button>
                            )}
                        </View>
                    </SafeAreaView>
                </>
            )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
                container: {
                flex: 1,
                backgroundColor: '#fff',
                alignItems: "center",
                paddingBottom: 20
            },
        });