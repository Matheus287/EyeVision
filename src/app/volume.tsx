import { Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cores } from "../theme/colors";
import { Texto } from "../components/Texto";
import { useConfiguracoes } from "../contexto/ConfiguracoesContext";
import { useAnuncioDeTela } from "../servicos/useAcessibilidade";

export default function Volume() {

    const router = useRouter();

    const {
        configuracoes,
        alterarConfiguracao,
    } = useConfiguracoes();

    const volume = configuracoes.volumeFala;
    const volumePercentual = Math.round(volume * 100);

    useAnuncioDeTela("Volume da reprodução");

    function alterarVolume(valor: number) {

        alterarConfiguracao(
            "volumeFala",
            valor
        );
    }

    return (
        <SafeAreaView style={estilos.container}>

            <ScrollView
                contentContainerStyle={estilos.conteudo}
            >

                <Pressable
                    style={estilos.botaoVoltar}
                    onPress={() => router.back()}
                    accessibilityRole="button"
                    accessibilityLabel="Voltar"
                >
                    <Feather
                        name="chevron-left"
                        size={28}
                        color={cores.primariaClara}
                    />
                </Pressable>

                <Texto style={estilos.titulo} accessibilityRole="header">
                    Volume da reprodução
                </Texto>

                <View style={estilos.card}>

                    <View
                        style={estilos.indicador}
                        accessible
                        accessibilityLabel={`Volume atual: ${volumePercentual} por cento`}
                    >

                        <Feather
                            name={
                                volume === 0
                                    ? "volume-x"
                                    : volume < 0.5
                                        ? "volume-1"
                                        : "volume-2"
                            }
                            size={28}
                            color={cores.primariaClara}
                        />

                        <Texto style={estilos.valor}>
                            {volumePercentual}%
                        </Texto>

                    </View>

                    <Slider
                        style={estilos.slider}
                        minimumValue={0}
                        maximumValue={1}
                        step={0.01}
                        value={volume}
                        onValueChange={alterarVolume}
                        minimumTrackTintColor={cores.terciaria}
                        maximumTrackTintColor="#555"
                        thumbTintColor={cores.terciaria}
                        accessible
                        accessibilityRole="adjustable"
                        accessibilityLabel="Volume da reprodução"
                        accessibilityValue={{
                            min: 0,
                            max: 100,
                            now: volumePercentual,
                            text: `${volumePercentual} por cento`,
                        }}
                    />

                    <View style={estilos.rotulos}>

                        <Texto style={estilos.rotulo}>
                            Silencioso
                        </Texto>

                        <Texto style={estilos.rotulo}>
                            Máximo
                        </Texto>

                    </View>

                </View>

            </ScrollView>

        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
    },
    conteudo: {
        padding: 32,
        paddingBottom: 48,
    },
    botaoVoltar: {
        alignSelf: "flex-start",
        padding: 4,
        marginBottom: 16,
    },
    titulo: {
        fontSize: 24,
        color: cores.primariaClara,
        fontWeight: "600",
        marginBottom: 32,
    },
    card: {
        backgroundColor: cores.primariaBase,
        borderRadius: 20,
        padding: 24,
    },
    indicador: {
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
    },
    valor: {
        fontSize: 20,
        color: cores.primariaClara,
    },
    slider: {
        width: "100%",
        height: 40,
    },
    rotulos: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4,
    },
    rotulo: {
        fontSize: 13,
        color: cores.primariaClara,
        opacity: 0.6,
    },
});
