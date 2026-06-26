import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#d1d5db",
        width: "100%",
        height: 41,
        backgroundColor: "white",
        alignItems: "flex-start",
        justifyContent: "center"
    },
    overlay: {
        position: "absolute", 
        left: 0, 
        right: 0, 
        zIndex: 50, 
        top:"100%", 
        flex: 1, 
        backgroundColor: "white"
    }
})