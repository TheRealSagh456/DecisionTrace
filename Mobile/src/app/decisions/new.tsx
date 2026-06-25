import Header from "@/components/Header";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DecisionNew() {


    return (
        <SafeAreaView>
            <Header 
                page={{title: "Nova Decisão", type: "others"}} 
                backButton 
                onBack={() => router.back()}
            />
            <Text>
                Nova decisão
            </Text>
        </SafeAreaView>
    )
}