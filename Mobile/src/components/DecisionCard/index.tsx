import { Text, TouchableOpacity, TouchableOpacityProps, View, ViewProps } from "react-native";
import { Decision } from "@/@types";
import {MaterialIcons} from "@expo/vector-icons"
import { styles } from "./styles";
import { areaMap, statusMap } from "@/utils/translate";

type Props = TouchableOpacityProps & {
    data: Decision
}

export default function DecisionCard({
    data,
    ...props
}: Props) {

    return (
        <TouchableOpacity style={styles.container} {...props} activeOpacity={0.5}>
            <View style={{flexDirection: "row", justifyContent: "space-between", gap: 3}}>
                <Text style={styles.topText}>{areaMap[data.area]}</Text>
                <Text style={styles.topText}>{statusMap[data.status]}</Text>
            </View>
            <Text style={{textAlign: "justify"}}>{data.contexto}</Text>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <View style={{flexDirection: "row", justifyContent: "space-between", gap: 9}}>
                    <View style={styles.iconData}>
                        <MaterialIcons name="chat" size={18}/>
                        <Text>{data.hypothesisCount}</Text>
                    </View>
                    <View style={styles.iconData}>
                        <MaterialIcons name="fact-check" size={18}/>
                        <Text>{data.evidencesCount}</Text>
                    </View>
                </View>
                <View style={styles.iconData}>
                    <MaterialIcons name="calendar-today" size={18}/>
                    <Text>{new Date(data.updatedAt).toLocaleDateString("pt-BR")}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}