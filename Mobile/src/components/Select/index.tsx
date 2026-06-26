import { Option } from "@/@types"
import { Text, TouchableOpacity, View, ViewProps } from "react-native"
import { styles } from "./styles"

type Props = ViewProps & {
    placeholder: string
    open: boolean,
    options: Option[]
    selected?: string
    onClick: () => void
    onSelect: (value: string) => void,
}

export default function Select({placeholder, open, options, onSelect, onClick, selected, ...props}: Props) {
    return (
        <View {...props}>
        <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={onClick} 
            style={styles.container}
            >
            <Text style={{fontSize: 10, fontWeight: 500}}>{placeholder}</Text>
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