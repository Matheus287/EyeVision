import { useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { cores } from "../theme/colors";
import { Texto } from "../components/Texto";
import { useBluetooth } from "../contexto/bluetoothContext";
import { useAnuncioDeTela } from "../servicos/useAcessibilidade";

export default function GerenciarDispositivos() {
    const router = useRouter();

    const {
        dispositivosSalvos,
        dispositivoConectado,
        conectandoId,
        conectarDispositivoPorId,
        desconectarDispositivo,
        removerDispositivo,
        renomearDispositivo,
    } = useBluetooth();

    const [menuAberto, setMenuAberto] = useState<string | null>(null);
    const [modalRenomear, setModalRenomear] = useState(false);
    const [dispositivoSelecionado, setDispositivoSelecionado] = useState<{
        id: string;
        nome: string;
    } | null>(null);
    const [novoNome, setNovoNome] = useState("");

    useAnuncioDeTela("Gerenciar dispositivos");

    function abrirMenu(id: string) {
        setMenuAberto((atual) => (atual === id ? null : id));
    }

    function fecharMenu() {
        setMenuAberto(null);
    }

    function abrirRenomear(dispositivo: {
        id: string;
        nome: string;
    }) {
        setDispositivoSelecionado(dispositivo);
        setNovoNome(dispositivo.nome);
        fecharMenu();
        setModalRenomear(true);
    }

    function fecharRenomear() {
        setModalRenomear(false);
        setDispositivoSelecionado(null);
        setNovoNome("");
    }

    async function salvarNome() {
        if (!dispositivoSelecionado) {
            return;
        }

        const nomeLimpo = novoNome.trim();

        if (!nomeLimpo) {
            Alert.alert(
                "Nome inválido",
                "Digite um nome para o dispositivo."
            );
            return;
        }

        await renomearDispositivo(
            dispositivoSelecionado.id,
            nomeLimpo
        );

        fecharRenomear();
    }

    function confirmarRemocao(
        id: string,
        nome: string
    ) {
        fecharMenu();

        Alert.alert(
            "Remover dispositivo",
            `Deseja remover ${nome} dos dispositivos salvos?`,
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: async () => {
                        await removerDispositivo(id);
                    },
                },
            ]
        );
    }

    async function alternarConexao(
        id: string
    ) {
        fecharMenu();

        const estaConectado =
            dispositivoConectado?.id === id;

        if (estaConectado) {
            await desconectarDispositivo();
            return;
        }

        await conectarDispositivoPorId(id);
    }

    function obterStatus(
        id: string
    ) {
        if (conectandoId === id) {
            return "Conectando...";
        }

        if (dispositivoConectado?.id === id) {
            return "Conectado";
        }

        return "Desconectado";
    }

    function estaConectado(id: string) {
        return dispositivoConectado?.id === id;
    }

    return (
        <View style={estilos.container}>

            <View style={estilos.cabecalho}>
                <TouchableOpacity
                    style={estilos.botaoVoltar}
                    onPress={() => router.back()}
                    accessibilityRole="button"
                    accessibilityLabel="Voltar para configurações"
                >
                    <Feather
                        name="chevron-left"
                        size={24}
                        color={cores.primariaClara}
                    />
                </TouchableOpacity>

                <Texto
                    style={estilos.titulo}
                    accessibilityRole="header"
                >
                    Gerenciar dispositivos
                </Texto>
            </View>


            {dispositivosSalvos.length > 0 ? (
                <View style={estilos.card}>

                    {dispositivosSalvos.map(
                        (dispositivo, index) => {

                            const conectado =
                                estaConectado(dispositivo.id);

                            const status =
                                obterStatus(dispositivo.id);

                            const ultimo =
                                index ===
                                dispositivosSalvos.length - 1;

                            return (
                                <View
                                    key={dispositivo.id}
                                    style={[
                                        estilos.dispositivo,
                                        ultimo &&
                                            estilos.semBorda,
                                    ]}
                                >

                                    <View style={estilos.info}>

                                        <View
                                            style={estilos.nomeLinha}
                                        >
                                            <Feather
                                                name="bluetooth"
                                                size={20}
                                                color={
                                                    cores.primariaClara
                                                }
                                            />

                                            <Texto
                                                style={
                                                    estilos.nome
                                                }
                                                numberOfLines={1}
                                            >
                                                {dispositivo.nome}
                                            </Texto>
                                        </View>

                                        <Texto
                                            style={[
                                                estilos.status,
                                                conectado &&
                                                    estilos.statusConectado,
                                            ]}
                                        >
                                            {status}
                                        </Texto>

                                    </View>


                                    <View>
                                        <TouchableOpacity
                                            style={
                                                estilos.botaoMenu
                                            }
                                            onPress={() =>
                                                abrirMenu(
                                                    dispositivo.id
                                                )
                                            }
                                            accessibilityRole="button"
                                            accessibilityLabel={`Opções de ${dispositivo.nome}`}
                                            accessibilityHint="Toque para abrir as opções do dispositivo"
                                        >
                                            <Feather
                                                name="more-vertical"
                                                size={22}
                                                color={
                                                    cores.primariaClara
                                                }
                                            />
                                        </TouchableOpacity>


                                        {menuAberto ===
                                            dispositivo.id && (
                                            <View
                                                style={
                                                    estilos.menu
                                                }
                                            >

                                                <TouchableOpacity
                                                    style={
                                                        estilos.menuItem
                                                    }
                                                    onPress={() =>
                                                        abrirRenomear(
                                                            dispositivo
                                                        )
                                                    }
                                                    accessibilityRole="button"
                                                    accessibilityLabel={`Renomear ${dispositivo.nome}`}
                                                >
                                                    <Feather
                                                        name="edit-2"
                                                        size={18}
                                                        color={
                                                            cores.primariaClara
                                                        }
                                                    />

                                                    <Texto
                                                        style={
                                                            estilos.menuTexto
                                                        }
                                                    >
                                                        Renomear
                                                    </Texto>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={
                                                        estilos.menuItem
                                                    }
                                                    onPress={() =>
                                                        alternarConexao(
                                                            dispositivo.id
                                                        )
                                                    }
                                                    disabled={
                                                        conectandoId ===
                                                        dispositivo.id
                                                    }
                                                    accessibilityRole="button"
                                                    accessibilityLabel={
                                                        conectado
                                                            ? `Desconectar ${dispositivo.nome}`
                                                            : `Conectar ${dispositivo.nome}`
                                                    }
                                                >
                                                    <Feather
                                                        name={
                                                            conectado
                                                                ? "link-2"
                                                                : "bluetooth"
                                                        }
                                                        size={18}
                                                        color={
                                                            cores.primariaClara
                                                        }
                                                    />

                                                    <Texto
                                                        style={
                                                            estilos.menuTexto
                                                        }
                                                    >
                                                        {conectado
                                                            ? "Desconectar"
                                                            : "Conectar"}
                                                    </Texto>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={
                                                        estilos.menuItem
                                                    }
                                                    onPress={() =>
                                                        confirmarRemocao(
                                                            dispositivo.id,
                                                            dispositivo.nome
                                                        )
                                                    }
                                                    accessibilityRole="button"
                                                    accessibilityLabel={`Remover ${dispositivo.nome}`}
                                                >
                                                    <Feather
                                                        name="trash-2"
                                                        size={18}
                                                        color={
                                                            cores.aviso
                                                        }
                                                    />

                                                    <Texto
                                                        style={[
                                                            estilos.menuTexto,
                                                            estilos.removerTexto,
                                                        ]}
                                                    >
                                                        Remover
                                                    </Texto>
                                                </TouchableOpacity>

                                            </View>
                                        )}

                                    </View>

                                </View>
                            );
                        }
                    )}

                </View>
            ) : (

                <View style={estilos.card}>
                    <View style={estilos.vazio}>

                        <Feather
                            name="bluetooth"
                            size={42}
                            color={cores.primariaClara}
                        />

                        <Texto
                            style={estilos.vazioTitulo}
                        >
                            Nenhum dispositivo salvo
                        </Texto>

                        <Texto
                            style={estilos.vazioTexto}
                        >
                            Conecte um dispositivo EyeVision
                            para que ele apareça aqui.
                        </Texto>

                    </View>
                </View>
            )}


            <TouchableOpacity
                style={estilos.adicionar}
                onPress={() =>
                    router.push(
                        "/adicionar-dispositivo"
                    )
                }
                accessibilityRole="button"
                accessibilityLabel="Adicionar dispositivo"
                accessibilityHint="Abre a tela para procurar dispositivos EyeVision"
            >
                <Feather
                    name="plus"
                    size={20}
                    color={cores.primariaClara}
                />

                <Texto
                    style={estilos.adicionarTexto}
                >
                    Adicionar dispositivo
                </Texto>
            </TouchableOpacity>


            <Modal
                visible={modalRenomear}
                transparent
                animationType="fade"
                onRequestClose={fecharRenomear}
            >
                <View style={estilos.fundoModal}>

                    <View style={estilos.modal}>

                        <Texto
                            style={estilos.modalTitulo}
                            accessibilityRole="header"
                        >
                            Renomear dispositivo
                        </Texto>

                        <Texto
                            style={estilos.modalDescricao}
                        >
                            Escolha um nome para identificar
                            este dispositivo.
                        </Texto>

                        <TextInput
                            style={estilos.input}
                            value={novoNome}
                            onChangeText={setNovoNome}
                            placeholder="Nome do dispositivo"
                            placeholderTextColor={
                                cores.primariaClara
                            }
                            maxLength={30}
                            autoFocus
                            accessibilityLabel="Nome do dispositivo"
                            accessibilityHint="Digite o novo nome do dispositivo"
                        />

                        <View
                            style={estilos.acoesModal}
                        >

                            <TouchableOpacity
                                style={
                                    estilos.botaoCancelar
                                }
                                onPress={fecharRenomear}
                                accessibilityRole="button"
                                accessibilityLabel="Cancelar"
                            >
                                <Texto
                                    style={
                                        estilos.textoCancelar
                                    }
                                >
                                    Cancelar
                                </Texto>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={
                                    estilos.botaoSalvar
                                }
                                onPress={salvarNome}
                                accessibilityRole="button"
                                accessibilityLabel="Salvar novo nome"
                            >
                                <Texto
                                    style={
                                        estilos.textoSalvar
                                    }
                                >
                                    Salvar
                                </Texto>
                            </TouchableOpacity>

                        </View>

                    </View>

                </View>
            </Modal>

        </View>
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
        gap: 16,
        marginBottom: 32,
    },

    botaoVoltar: {
        padding: 4,
    },

    titulo: {
        fontSize: 24,
        color: cores.primariaClara,
        fontWeight: "600",
    },


    card: {
        backgroundColor: cores.primariaBase,
        borderRadius: 20,
        overflow: "visible",
        marginBottom: 20,
    },


    dispositivo: {
        minHeight: 86,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        paddingHorizontal: 20,
        paddingVertical: 16,

        borderBottomWidth:
            StyleSheet.hairlineWidth,
        borderBottomColor: cores.divisoria,
    },

    semBorda: {
        borderBottomWidth: 0,
    },


    info: {
        flex: 1,
        marginRight: 12,
    },

    nomeLinha: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    nome: {
        color: cores.primariaClara,
        fontSize: 16,
        fontWeight: "600",
        flexShrink: 1,
    },

    status: {
        color: cores.primariaClara,
        opacity: 0.55,
        fontSize: 13,
        marginTop: 5,
        marginLeft: 30,
    },

    statusConectado: {
        opacity: 1,
    },


    botaoMenu: {
        padding: 8,
    },


    menu: {
        position: "absolute",
        right: 0,
        top: 42,

        width: 180,

        backgroundColor: cores.primariaBase,
        borderRadius: 14,

        paddingVertical: 6,

        elevation: 8,
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        zIndex: 10,
    },

    menuItem: {
        minHeight: 48,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
    },

    menuTexto: {
        color: cores.primariaClara,
        fontSize: 14,
    },

    removerTexto: {
        color: cores.aviso,
    },


    vazio: {
        alignItems: "center",
        justifyContent: "center",

        paddingHorizontal: 30,
        paddingVertical: 50,
    },

    vazioTitulo: {
        color: cores.primariaClara,
        fontSize: 17,
        fontWeight: "600",

        marginTop: 16,
        textAlign: "center",
    },

    vazioTexto: {
        color: cores.primariaClara,
        opacity: 0.55,

        fontSize: 14,
        textAlign: "center",

        marginTop: 8,
        lineHeight: 20,
    },


    adicionar: {
        minHeight: 58,

        borderRadius: 16,
        backgroundColor: cores.primariaBase,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        gap: 10,
    },

    adicionarTexto: {
        color: cores.primariaClara,
        fontSize: 16,
        fontWeight: "600",
    },

    fundoModal: {
        flex: 1,

        backgroundColor: "rgba(0, 0, 0, 0.6)",

        alignItems: "center",
        justifyContent: "center",

        padding: 32,
    },

    modal: {
        width: "100%",

        backgroundColor: cores.primariaBase,
        borderRadius: 20,

        padding: 24,
    },

    modalTitulo: {
        color: cores.primariaClara,
        fontSize: 20,
        fontWeight: "600",
    },

    modalDescricao: {
        color: cores.primariaClara,
        opacity: 0.55,

        fontSize: 14,
        lineHeight: 20,

        marginTop: 8,
        marginBottom: 20,
    },

    input: {
        height: 56,

        backgroundColor: cores.fundo,
        borderRadius: 14,

        paddingHorizontal: 16,

        color: cores.primariaClara,
        fontSize: 16,

        borderWidth: 1,
        borderColor: cores.divisoria,
    },

    acoesModal: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",

        gap: 12,

        marginTop: 20,
    },

    botaoCancelar: {
        minHeight: 48,

        paddingHorizontal: 16,

        alignItems: "center",
        justifyContent: "center",
    },

    textoCancelar: {
        color: cores.primariaClara,
        opacity: 0.7,

        fontSize: 15,
        fontWeight: "600",
    },

    botaoSalvar: {
        minHeight: 48,

        paddingHorizontal: 20,

        borderRadius: 12,

        backgroundColor: cores.fundo,

        alignItems: "center",
        justifyContent: "center",
    },

    textoSalvar: {
        color: cores.primariaClara,

        fontSize: 15,
        fontWeight: "600",
    },

});