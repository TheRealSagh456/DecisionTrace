import { MaterialIcons } from "@expo/vector-icons";
import { Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
    search?: boolean;
    label?: string;
    type?: "text" | "textarea";
    rows?: number;
    disabled?: boolean;
    defaultValue?: string;
    value?: string;
    error?: string;
};

export default function Input({
    search,
    label,
    type = "text",
    rows,
    disabled,
    defaultValue,
    value,
    error,
    ...props
}: Props) {
    return (
        <View
            style={{
                gap: 4,
            }}
        >
            {label && (
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "600",
                    }}
                >
                    {label}
                </Text>
            )}

            <View
                style={{
                    flexDirection: "row",
                    alignItems: type === "textarea" ? "flex-start" : "center",
                    borderWidth: 1,
                    borderColor: error ? "#ef4444" : "#d1d5db",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    backgroundColor: disabled ? "#e5e7eb" : "#fff",
                }}
            >
                {search && (
                    <MaterialIcons
                        name="search"
                        size={20}
                        style={{
                            marginRight: 8,
                            marginTop: type === "textarea" ? 12 : 0,
                        }}
                    />
                )}

                <TextInput
                    {...props}
                    editable={!disabled}
                    defaultValue={defaultValue}
                    value={value}
                    multiline={type === "textarea"}
                    numberOfLines={type === "textarea" ? rows ?? 3 : 1}
                    style={{
                        flex: 1,
                        minHeight: type === "textarea" ? (rows ?? 3) * 24 : 48,
                        paddingVertical: type === "textarea" ? 12 : 0,
                        textAlignVertical:
                            type === "textarea" ? "top" : "center",
                        color: "#000",
                    }}
                />
            </View>

            {error && (
                <Text
                    style={{
                        color: "#ef4444",
                        fontSize: 12,
                    }}
                >
                    {error}
                </Text>
            )}
        </View>
    );
}