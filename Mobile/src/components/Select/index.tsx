import { Option } from "@/@types"
import { Text, TouchableOpacity, View, ViewProps } from "react-native"

type Props = ViewProps & {
    placeholder: string
    open: boolean,
    options: Option[]
    onClick: () => void
}

export default function Select({placeholder, open, options, onClick, ...props}: Props) {
    return (
        <View {...props}>
        <TouchableOpacity activeOpacity={0.8} onPress={onClick}>
            <Text>{placeholder}</Text>
        </TouchableOpacity>
        
            {open && (
                <View>
                    {options.map((option, Index) => (
                        <View 
                            key={Index} 
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 10,
                                borderWidth: 1,
                                borderColor: "gray",
                                width: "100%",
                                height: "auto"
                            }}
                        >
                            <Text style={{fontSize: 10, fontWeight: 500}}>
                                {option.label}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    )
}