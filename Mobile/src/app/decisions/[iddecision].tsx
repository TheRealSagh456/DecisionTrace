import Header from "@/components/Header";
import { api } from "@/services/api";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DecisionDetail() {
    const {iddecision} = useLocalSearchParams()

    return (
        <SafeAreaView style={styles.container}>
            <Header 
                page={{type: "others", title: "AWDA"}} 
                backButton 
                rightButton={{type: "edit"}}
                onBack={() => router.back()}
                onEdit={() => router.push("/decisions/new")}
            />
            <Text>
                Detalhe
            </Text>
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