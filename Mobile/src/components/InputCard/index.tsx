import { Text, TouchableOpacity, View, ViewProps } from "react-native";
import { styles } from "./styles";
import { DecisionInput } from "@/@types";
import { MaterialIcons } from "@expo/vector-icons";
import { confiancaMap, tipoMap } from "@/utils/translate";

type Props = ViewProps & {
    data: DecisionInput
    onEdit: () => void
    onDelete: () => void
}

export default function InputCard({data, onEdit, onDelete, ...props}: Props) {
    return (
        <View style={styles.container} {...props}> 
            <View style={{width: "75%", gap: 8, paddingRight: 8}}>
                <View style={{flexDirection: "column", justifyContent: "flex-start", width: "100%", gap:8}}>
                    <Text 
                        numberOfLines={1} 
                        ellipsizeMode="tail"
                        style={{fontWeight: 600}}
                    >
                        {data.descricao}
                    </Text>
                    <Text 
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={{fontWeight: 600}}
                    >
                        Tipo: {tipoMap[data.tipo]}
                    </Text>
                </View>
                <View 
                    style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row"
                        }}
                    >
                    <Text style={{width: "50%", fontWeight: 600}}>
                        Fonte: {data.fonte}
                    </Text>
                    <Text style={{fontWeight: 600}}>
                        Confiança: {confiancaMap[data.confianca]}
                    </Text>
                </View>
            </View>
            <View style={{flexDirection: "row", gap: 8}}>
                <TouchableOpacity 
                    onPress={onEdit}
                    style={{
                        backgroundColor: "#65e9d7",
                        padding: 7,
                        borderRadius: 8,
                        borderWidth: 2
                    }}>
                    <MaterialIcons name="edit" color={"#000000"} size={20}/>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={onDelete}
                    style={{
                        backgroundColor: "#ff6868",
                        padding: 7,
                        borderRadius: 8,
                        borderWidth: 2
                    }}>
                    <MaterialIcons name="delete" color={"#000000"} size={20}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}