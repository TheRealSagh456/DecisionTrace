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
import { MaterialIcons } from '@expo/vector-icons';
import Select from '@/components/Select';
import { statusArray, statusMap } from '@/utils/translate';
import { Option } from '../@types';

export default function Index() {
    const [decisions, setDecisions] = useState<Decision[]>([])
    const [search, setSearch] = useState("")
    const [debouncedSearch] = useDebounce(search, 400)
    const [isFiltering, setIsFiltering] = useState(false)
    const [isStatusOpen, setIsStatusOpen] = useState(false)

    useEffect(() => {
        async function fetchDecisions() {
            try{
                const response = await api.get("/decisions", {
                    params: {
                        q: debouncedSearch || undefined
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
        console.log("Aopa")
        fetchDecisions()
    }, [debouncedSearch])

    const statusOptions: Option[] = Object.entries(statusMap).map(([value, label]) => ({
        value,
        label,
    }))

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
                style={{backgroundColor: "purple", padding: 10, width: "80%"}}
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
                    <View style={{
                        position: "absolute",
                        zIndex: 40,
                        width: "100%",
                        alignSelf: "center",
                        height: "60%",
                        backgroundColor: "white",
                        bottom: 0,
                        borderTopLeftRadius: 28,
                        borderTopRightRadius: 28,
                        paddingTop: 15
                    }}>

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
                    <Select 
                        open={isStatusOpen} 
                        onClick={() => setIsStatusOpen(!isStatusOpen)}
                        options={statusOptions}
                        placeholder='draft'
                    />
                    </View>
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