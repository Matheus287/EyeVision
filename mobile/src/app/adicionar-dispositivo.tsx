import { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { cores } from "../theme/colors";
import { Texto } from "../components/Texto";
import { useBluetooth } from "../contexto/bluetoothContext";
import { useAnuncioDeTela, useAnuncioDeMudanca } from "../servicos/useAcessibilidade";

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

    useAnuncioDeTela("Adicionar dispositivos");

    useEffect(() => {
            procurarDispositivos();
    }, []);

    // avisa por voz quando conecta/desconecta, sem precisar olhar pra tela
    useAnuncioDeMudanca(dispositivoConectado?.id ?? null, (atual, anterior) => {
        if (atual && atual !== anterior) {
            return `Conectado a ${dispositivoConectado?.name ?? "dispositivo sem nome"}`;
        }
        if (!atual && anterior) {
            return "Dispositivo desconectado";
        }
        return null;
    });

    // avisa quando a busca termina e quantos dispositivos apareceram
    useAnuncioDeMudanca(buscando, (atual, anterior) => {
        if (anterior === true && atual === false) {
            const total = dispositivosEncontrados.length;
            if (total === 0) return "Busca concluída. Nenhum dispositivo encontrado.";
            return `Busca concluída. ${total} dispositivo${total > 1 ? "s" : ""} encontrado${total > 1 ? "s" : ""}.`;
        }
        return null;
    });

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
                        accessibilityRole="button"
                        accessibilityLabel="Voltar para tela inicial"
                    >
                        <Feather name="chevron-left" size={28} color={cores.primariaClara} />
                    </TouchableOpacity>
                </View>

                <Texto style={estilos.titulo} accessibilityRole="header">
                    Adicionar Dispositivos
                </Texto>

                <Texto style={estilos.subtitulo} accessibilityRole="header">
                    Dispositivo conectado
                </Texto>

                <View style={estilos.card}>
                    {dispositivoConectado ? (
                        <TouchableOpacity
                            style={estilos.item}
                            onPress={desconectarDispositivo}
                            accessibilityRole="button"
                            accessibilityLabel={`${dispositivoConectado.name ?? "Dispositivo sem nome"}, conectado`}
                            accessibilityHint="Toque para desconectar"
                        >
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
                    <Texto style={estilos.subtituloSemMargem} accessibilityRole="header">
                        Dispositivos disponíveis
                    </Texto>

                    <TouchableOpacity
                        onPress={procurarDispositivos}
                        disabled={buscando}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel="Buscar dispositivos novamente"
                        accessibilityState={{ busy: buscando, disabled: buscando }}
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
                        dispositivosDisponiveis.map((device) => {
                            const conectandoEste = conectandoId === device.id;
                            const nome = device.name ?? "Dispositivo sem nome";

                            return (
                                <TouchableOpacity
                                    key={device.id}
                                    style={estilos.item}
                                    onPress={() => conectarDispositivo(device)}
                                    disabled={conectandoId !== null}
                                    accessibilityRole="button"
                                    accessibilityLabel={conectandoEste ? `Conectando a ${nome}` : nome}
                                    accessibilityHint={conectandoEste ? undefined : "Toque para conectar"}
                                    accessibilityState={{
                                        disabled: conectandoId !== null,
                                        busy: conectandoEste,
                                    }}
                                >
                                    <Texto style={estilos.itemTexto}>{nome}</Texto>

                                    {conectandoEste ? (
                                        <ActivityIndicator size="small" color={cores.primariaClara} />
                                    ) : (
                                        <Feather
                                            name="chevron-right"
                                            size={19}
                                            color={cores.primariaClara}
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })
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
