import { Text, View, ViewProps } from "react-native";
import { styles } from "./styles";
import Button from "../Button";
import { MaterialIcons } from "@expo/vector-icons";

type Props = ViewProps & {
    backButton?: boolean,
    rightButton?: {
        type: "edit" | "delete"
    }
    page: {
        type: "main" | "others",
        title: string
    },
    onBack?: () => void,
    onEdit?: () => void,
    onDelete?: () => void
}

export default function Header({
    page, 
    backButton, 
    rightButton, 
    onBack, 
    onEdit, 
    onDelete, 
    ...props
}: Props) {
    return (
        <View style={ styles.container } {...props}
        >
            {
                page.type === "others" && backButton && (
                    <View style={styles.containerBotaoEsquerdo}>
                        <Button style={styles.botaoHeader} onPress={onBack}>
                            <MaterialIcons name="arrow-back" size={20} color={"white"}/>
                            <Text style={{color: "white", fontSize: 15}}>Voltar</Text>
                        </Button>
                    </View>
                )
            }
            
            <View style={styles.containerTitulo}>
                <Text 
                    style={[
                        styles.tituloText,
                        page.type === "main" ?
                        {fontSize: 32, fontWeight: "bold"} :
                        {fontSize: 16, fontWeight: 500}
                    ]}
                >
                    {page.title}
                </Text>
            </View>
                    
            {
                page.type === "others" && rightButton  && (
                    <View style={styles.containerBotaoDireito}>
                        {rightButton.type === "edit" ? (
                            <Button style={[styles.botaoHeader, {
                                backgroundColor: "purple",
                            }]} onPress={onEdit}>
                            <MaterialIcons name="edit" size={20} color={"white"}/>
                                <Text style={{color: "white", fontSize: 15}}>Editar</Text>
                            </Button>
                        ) : (
                            <Button style={[styles.botaoHeader, {
                                backgroundColor: "red"
                            }]} onPress={onDelete}>
                                <MaterialIcons name="delete" size={20} color={"white"}/>
                                <Text>Apagar</Text>
                            </Button>
                        )}
                    </View>
                )
            }
        </View>        
    )
}