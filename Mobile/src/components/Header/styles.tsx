import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 60, 
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", 
        borderWidth: 1,
        borderColor: "#d1d5db",
        paddingHorizontal: 16,
        position: "relative"
    },
    containerTitulo: {
        maxWidth: "60%", 
        alignItems: "center",
        justifyContent: "center"
    },
    tituloText: {
        color: "#000",
        textAlign: "center"
    },
    containerBotaoEsquerdo: {
        position: "absolute",
        left: 16,
        height: "100%",
        justifyContent: "center"
    },
    containerBotaoDireito: {
        position: "absolute",
        right: 16,
        height: "100%",
        justifyContent: "center"
    },
    botaoHeader: {
        backgroundColor: "gray",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        height: 36
    }
});