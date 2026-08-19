import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { cores, tamanhos } from "../theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Texto } from "../components/Texto"

const logo = require("../assets/img/Icone Branco.png");

export default function Inicial() {

    const router = useRouter();

    return (
        <SafeAreaView style={estilos.container}>

            <View style={estilos.conteudo}>

            <View style={estilos.titulo}>
                <Texto style={estilos.logo}>
                    EyeVision
                </Texto>

                <Texto style={estilos.subtitulo}>
                    Tecnologia que amplia possibilidades
                </Texto>
            </View>

                <View style={estilos.apresentacao}>
                    <Image
                        source={logo}
                        style={estilos.img}
                        resizeMode="contain"
                    />

                </View>

                <View style={estilos.rodape}>

                    <TouchableOpacity
                        style={estilos.submitButton}
                        activeOpacity={0.8}
                        onPress={() =>
                            router.push("/adicionar-dispositivo")
                        }
                    >
                        <Texto style={estilos.submitButtonTexto}>
                            Adicionar Dispositivo
                        </Texto>
                    </TouchableOpacity>

                </View>

            </View>

        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: cores.fundo,
    },

    conteudo: {
        flex: 1,
        paddingHorizontal: 32,
        paddingVertical: 24,
        justifyContent: "space-between",
    },

    titulo: {
        paddingTop: 90
    },

    apresentacao: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
    },

    logo: {
        fontSize: 36,
        color: cores.primariaClara,
        fontWeight: "700",
        marginBottom: 8,
        fontFamily: "Nunito",
    },

    subtitulo: {
        color: cores.primariaClara,
        fontSize: tamanhos.base1,
        opacity: 0.7,
        marginBottom: 40,
    },

    img: {
        width: 220,
        height: 220,
    },

    rodape: {
        width: "100%",
        alignItems: "center",
        paddingBottom: 16,
    },

    submitButton: {
        width: "100%",
        maxWidth: 400,
        paddingVertical: 14,
        backgroundColor: cores.secundariaBase,
        borderRadius: 30,
        alignItems: "center",
    },

    submitButtonTexto: {
        color: cores.primariaClara,
        fontSize: tamanhos.base2,
        fontWeight: "600",
    },

});