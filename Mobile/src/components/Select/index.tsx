import { DecisionFormData, DecisionInput, Option } from "@/@types"
import { Text, TouchableOpacity, View, ViewProps } from "react-native"
import { styles } from "./styles"
import { MaterialIcons } from "@expo/vector-icons"

type Props = ViewProps & {
    placeholder: string
    open: boolean,
    options: Option[]
    selected?: string
    onClick: () => void
    onSelect: (value: DecisionFormData | DecisionInput) => void,
    disabled?: boolean
}

export default function Select({
    placeholder,
    open,
    options,
    disabled,
    onSelect,
    onClick,
    selected,
    ...props
}: Props) {
    return (
        <View {...props}>
        <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={() => !disabled ? onClick() : undefined}
            style={[styles.container, !disabled ? {backgroundColor: "white"} : {backgroundColor: "#e5e7eb"}]}
            disabled={disabled}
            >
            <Text style={{fontSize: 15, fontWeight: 500}}>{placeholder}</Text>
            <MaterialIcons name="keyboard-double-arrow-down" size={20} style={{position: "absolute", right: 0, paddingRight: 5}}/>
        </TouchableOpacity>
        
            {open && (
                <View style={styles.overlay}>
                    {options.map((option) => (
                        <TouchableOpacity 
                            key={option.value} 
                            style={[
                                styles.container,
                                selected === option.value && {
                                    backgroundColor: "#d1d5db"
                                }
                            ]}
                            activeOpacity={0.8}
                            onPress={() => onSelect(option.value)}
                        >
                            <Text style={{fontSize: 10, fontWeight: 500}}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    )
}