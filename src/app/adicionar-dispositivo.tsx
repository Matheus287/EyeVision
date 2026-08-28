import { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { cores } from "../theme/colors";
import { Texto } from "../components/Texto";
import { useBluetooth } from "../contexto/bluetoothContext";

export default function AdicionarDispositivo() {

    const router = useRouter();

    const {
        dispositivosEncontrados,
        buscando,
        dispositivoConectado,
        conectandoId,
        procurarDispositivos,
        conectarDispositivo,
        desconectarDispositivo,
    } = useBluetooth();

    useEffect(() => {
            procurarDispositivos();
    }, []);

    const dispositivosDisponiveis = dispositivosEncontrados.filter(
        (device) => device.id !== dispositivoConectado?.id
    );

    return (
        <ScrollView>
            <View style={estilos.container}>
                <View style={estilos.cabecalho}>
                    <TouchableOpacity
                        style={estilos.botaoVoltar}
                        onPress={() => router.replace("/home")}
                    >
                        <Feather name="chevron-left" size={28} color={cores.primariaClara} />
                    </TouchableOpacity>
                </View>

                <Texto style={estilos.titulo}>Adicionar Dispositivos</Texto>

                <Texto style={estilos.subtitulo}>Dispositivo conectado</Texto>

                <View style={estilos.card}>
                    {dispositivoConectado ? (
                        <TouchableOpacity style={estilos.item} onPress={desconectarDispositivo}>
                            <View>
                                <Texto style={estilos.itemTexto}>
                                    {dispositivoConectado.name ?? "Dispositivo sem nome"}
                                </Texto>
                                <Texto style={estilos.itemSubtexto}>Toque para desconectar</Texto>
                            </View>

                            <Feather name="check-circle" size={19} color={cores.terciaria} />
                        </TouchableOpacity>
                    ) : (
                        <View style={estilos.item}>
                            <Texto style={estilos.itemTexto}>Nenhum dispositivo conectado</Texto>
                        </View>
                    )}
                </View>

                <View style={estilos.linhaSubtitulo}>
                    <Texto style={estilos.subtituloSemMargem}>Dispositivos disponíveis</Texto>

                    <TouchableOpacity
                        onPress={procurarDispositivos}
                        disabled={buscando}
                        hitSlop={8}
                    >
                        {buscando ? (
                            <ActivityIndicator size="small" color={cores.primariaClara} />
                        ) : (
                            <Feather name="refresh-cw" size={18} color={cores.primariaClara} />
                        )}
                    </TouchableOpacity>
                </View>

                <View style={estilos.card}>
                    {dispositivosDisponiveis.length === 0 ? (
                        <View style={estilos.item}>
                            <Texto style={estilos.itemTexto}>
                                {buscando
                                    ? "Procurando por dispositivos..."
                                    : "Nenhum dispositivo encontrado"}
                            </Texto>
                        </View>
                    ) : (
                        dispositivosDisponiveis.map((device) => (
                            <TouchableOpacity
                                key={device.id}
                                style={estilos.item}
                                onPress={() => conectarDispositivo(device)}
                                disabled={conectandoId !== null}
                            >
                                <Texto style={estilos.itemTexto}>
                                    {device.name ?? "Dispositivo sem nome"}
                                </Texto>

                                {conectandoId === device.id ? (
                                    <ActivityIndicator size="small" color={cores.primariaClara} />
                                ) : (
                                    <Feather
                                        name="chevron-right"
                                        size={19}
                                        color={cores.primariaClara}
                                    />
                                )}
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                <Texto style={estilos.aviso}>
                    Verifique se o dispositivo que você deseja conectar está ligado e
                    no modo pareamento e se seu celular está com o bluetooth ligado.
                </Texto>
            </View>
        </ScrollView>
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
    linhaSubtitulo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        marginLeft: 8,
        marginRight: 4,
    },
    subtituloSemMargem: {
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
    itemSubtexto: {
        color: cores.primariaClara,
        opacity: 0.6,
        fontSize: 12,
        marginTop: 2,
    },
    aviso: {
        marginTop: 32,
        textAlign: "center",
        opacity: 0.75,
        lineHeight: 21,
        color: cores.primariaClara,
    },
});
