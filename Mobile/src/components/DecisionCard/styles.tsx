import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column", 
        gap: 8,
        borderWidth: 1,
        borderColor: "#d1d5db",
        paddingHorizontal: 10,
        paddingVertical: 7
    },
    topText: {
        fontSize: 15,
        fontWeight: 700
    },
    iconData: {
        flexDirection: "row", 
        gap: 3, 
        alignItems: "center"
    }
})