import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { styles } from "./styles";

export default function Button({style, children, ...props}: TouchableOpacityProps) {
    return (
            <TouchableOpacity style={[styles.container, style]} activeOpacity={0.7} {...props}>
                {children}
            </TouchableOpacity>
    )
}