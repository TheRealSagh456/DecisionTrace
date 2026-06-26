import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { styles } from "./styles";


export default function Button({style, children, disabled, ...props}: TouchableOpacityProps) {
    return (
            <TouchableOpacity 
                style={[
                    styles.container, 
                    style, 
                    disabled && {
                        opacity: 0.6
                    }
                ]} 
                activeOpacity={0.7}
                disabled={disabled} 
                {...props}
            >
                {children}
            </TouchableOpacity>
    )
}