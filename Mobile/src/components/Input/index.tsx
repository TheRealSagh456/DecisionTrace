import { MaterialIcons } from "@expo/vector-icons";
import { TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import { styles } from "./style";

type Props = TextInputProps & {
    search?: boolean
}

export default function Input({search, ...props}: Props) {
    return (
        <View style={styles.container}>
            {search && (
                <MaterialIcons name="search" size={30} style={{alignSelf: "center"}}/>
            )}
            <TextInput style={{flex:1, color: "black"}} {...props}/>
        </View>
    )
}