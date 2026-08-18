import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { cores } from "../theme/colors";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function AdicionarDispositivo() {

    const router = useRouter();

    return (
        <SafeAreaProvider>
            <View style={estilos.container}>
                <View style={estilos.cabecalho}>
                    <TouchableOpacity
                        style={estilos.botaoVoltar}
                        onPress={() => router.push("/")}
                    >
                        <Feather name="chevron-left" size={28} color={cores.primariaClara} />
                    </TouchableOpacity>
                </View>

                <Text style={estilos.titulo}>Adicionar Dispositivos</Text>

                <Text style={estilos.subtitulo}>Dispositivos conhecidos</Text>

                <View style={estilos.card}>
                    <TouchableOpacity style={estilos.item}>
                        <Text style={estilos.itemTexto}>Dispositivo 1</Text>
                        <Feather name="chevron-right" size={19} color={cores.primariaClara} />
                    </TouchableOpacity>
                </View>

                <Text style={estilos.subtitulo}>Dispositivos disponíveis</Text>

                <View style={estilos.card}>
                    <View style={estilos.item}>
                        <Text style={estilos.itemTexto}>Procurando por dispositivos...</Text>
                    </View>
                </View>

                <Text style={estilos.aviso}>
                    Verifique se o dispositivo que você deseja conectar está ligado e
                    no modo pareamento e se seu celular está com o bluetooth ligado.
                </Text>
            </View>
        </SafeAreaProvider>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
        padding: 32,
    },
    cabecalho: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    botaoVoltar: {
        padding: 4,
    },
    titulo: {
        marginBottom: 32,
        fontSize: 24,
        color: cores.primariaClara,
        fontWeight: "600",
    },
    subtitulo: {
        marginBottom: 12,
        marginLeft: 8,
        color: cores.primariaClara,
    },
    card: {
        backgroundColor: cores.primariaBase,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 32,
    },
    item: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: cores.divisoria,
    },
    itemTexto: {
        color: cores.primariaClara,
    },
    aviso: {
        marginTop: 32,
        textAlign: "center",
        opacity: 0.75,
        lineHeight: 21,
        color: cores.primariaClara,
    },
});
