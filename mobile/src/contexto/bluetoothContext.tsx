import { toByteArray } from "base64-js";
import * as Speech from "expo-speech";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Characteristic, Device } from "react-native-ble-plx";
import { COMANDOS, TAMANHO_CABECALHO, textoParaBase64, TIPOS_FRAGMENTO, UUIDS } from "../servicos/bluetoothProtocol";
import { processarCaptura } from "../servicos/iaService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useConfiguracoes } from "./ConfiguracoesContext";
import { obterCodigoIdioma } from "../servicos/idioma";

const DURACAO_BUSCA_MS = 10000;

interface TarefaRecebida {
    id: number;
    imagem: string | null;
    audio: string | null;
}

interface BluetoothContextType {
    dispositivosEncontrados: Device[];
    buscando: boolean;
    dispositivoConectado: Device | null;
    conectandoId: string | null;

    caracteristicaControle: Characteristic | null;
    caracteristicaImagem: Characteristic | null;
    caracteristicaAudio: Characteristic | null;
    caracteristicaStatus: Characteristic | null;

    imagemRecebida: string | null;
    audioRecebido: string | null;

    recebendoImagem: boolean;
    recebendoAudio: boolean;
    statusDispositivo: number;
    textoStatusDispositivo: string;

    tarefaRecebida: TarefaRecebida | null;

    processandoIA: boolean;
    respostaIA: string | null;

    procurarDispositivos: () => Promise<void>;
    conectarDispositivo: (device: Device) => Promise<void>;
    desconectarDispositivo: () => Promise<void>;
    capturarImagem: () => Promise<void>;
    analisarCaptura: () => Promise<void>;

    dispositivosSalvos: DispositivoSalvo[];

    salvarDispositivo: (device: Device) => Promise<void>;
    renomearDispositivo: (id: string, nome: string) => Promise<void>;
    removerDispositivo: (id: string) => Promise<void>;
    conectarDispositivoPorId: (id: string) => Promise<void>;
}

interface DispositivoSalvo {
    id: string;
    nome: string;
}

const BluetoothContext = createContext<BluetoothContextType | null>(null);

function obterTextoStatus(status: number): string {

    switch (status) {

        case 0x00:
            return "Pronto";

        case 0x01:
            return "Capturando imagem...";

        case 0x02:
            return "Gravando áudio...";

        case 0x03:
            return "Enviando imagem...";

        case 0x04:
            return "Enviando áudio...";

        case 0x05:
            return "Erro";

        default:
            return "Desconhecido";
    }
}

export function BluetoothProvider({ children }: { children: ReactNode }) {

    const managerRef = useRef(new BleManager());

    const { configuracoes } = useConfiguracoes();

    const [dispositivosEncontrados, setDispositivosEncontrados] = useState<Device[]>([]);
    const [buscando, setBuscando] = useState(false);
    const [dispositivoConectado, setDispositivoConectado] = useState<Device | null>(null);
    const [conectandoId, setConectandoId] = useState<string | null>(null);

    const [caracteristicaControle, setCaracteristicaControle] =
        useState<Characteristic | null>(null);

    const [caracteristicaImagem, setCaracteristicaImagem] =
        useState<Characteristic | null>(null);

    const [caracteristicaAudio, setCaracteristicaAudio] =
        useState<Characteristic | null>(null);

    const [caracteristicaStatus, setCaracteristicaStatus] =
        useState<Characteristic | null>(null);

    const [imagemRecebida, setImagemRecebida] =
    useState<string | null>(null);

    const [audioRecebido, setAudioRecebido] =
        useState<string | null>(null);

    const [recebendoImagem, setRecebendoImagem] =
        useState(false);

    const [recebendoAudio, setRecebendoAudio] =
        useState(false);

    const [statusDispositivo, setStatusDispositivo] = useState<number>(0x00);

    const textoStatusDispositivo =
    obterTextoStatus(statusDispositivo);

    const imagemBufferRef = useRef<Map<number, Uint8Array>>(new Map());
    const audioBufferRef = useRef<Map<number, Uint8Array>>(new Map());
    const imagemSubscriptionRef = useRef<{
        remove: () => void;
    } | null>(null);

    const imagemTarefaRef = useRef<number | null>(null);
    const audioTarefaRef = useRef<number | null>(null);

    const imagemPendenteRef = useRef<{
        tarefa: number;
        base64: string;
    } | null>(null);

    const audioPendenteRef = useRef<{
        tarefa: number;
        base64: string;
    } | null>(null);

    const audioSubscriptionRef = useRef<{
        remove: () => void;
    } | null>(null);

    const [tarefaRecebida, setTarefaRecebida] =
    useState<TarefaRecebida | null>(null);

    const ultimaTarefaProcessadaRef = useRef<number | null>(null);

    const [processandoIA, setProcessandoIA] = useState(false); 
    const [respostaIA, setRespostaIA] = useState<string | null>(null);

    const [dispositivosSalvos, setDispositivosSalvos] =
    useState<DispositivoSalvo[]>([]);

    const CHAVE_DISPOSITIVOS = "@eyevision:dispositivos";

    useEffect(() => {
        carregarDispositivosSalvos();
    }, []);

    useEffect(() => {
        const manager = managerRef.current;

        return () => {
            manager.stopDeviceScan();
            manager.destroy();
        };
    }, []);

    useEffect(() => {

        if (!tarefaRecebida) {
            return;
        }

        const tarefa = tarefaRecebida;

        if (
            ultimaTarefaProcessadaRef.current === tarefa.id
        ) {
            return;
        }

        ultimaTarefaProcessadaRef.current = tarefa.id;

        async function processarTarefa() {

            console.log(
                "Iniciando análise automática da tarefa:",
                tarefa.id
            );

            setProcessandoIA(true);
            setRespostaIA(null);

            try {

                const resultado = await processarCaptura(
                    tarefa.imagem,
                    tarefa.audio,
                    "image/jpeg",
                    "audio/wav"
                );

                if (resultado.sucesso) {

                    console.log(
                        "Resposta do Gemini:",
                        resultado.resposta
                    );

                    setRespostaIA(resultado.resposta);

                    await Speech.stop();

                    await Speech.speak(
                        resultado.resposta,
                        {
                            language: obterCodigoIdioma(
                                configuracoes.idiomaLeitura
                            ),
                            rate: configuracoes.velocidadeFala,
                            volume: configuracoes.volumeFala,
                            pitch: 1.0,
                        }
                    );

                } else {

                    console.log(
                        "Erro na análise:",
                        resultado.erro
                    );

                    const mensagemErro =
                        "Não foi possível realizar a análise.";

                    setRespostaIA(mensagemErro);

                    await Speech.stop();

                    await Speech.speak(
                        mensagemErro,
                        {
                            language: "pt-BR",
                            rate: 0.95,
                        }
                    );
                }

            } catch (erro) {

                console.error(
                    "Erro ao processar tarefa:",
                    erro
                );

                const mensagemErro =
                    "Ocorreu um erro ao processar a solicitação.";

                setRespostaIA(mensagemErro);

                await Speech.stop();

                await Speech.speak(
                    mensagemErro,
                    {
                        language: "pt-BR",
                        rate: 0.95,
                    }
                );

            } finally {

                setProcessandoIA(false);
            }
        }

        processarTarefa();

    }, [tarefaRecebida]);


    async function pedirPermissoes() {
        if (Platform.OS !== "android") return true;

        if (Platform.Version >= 31) {
            const resultado = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ]);

            return (
                resultado[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                resultado[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
                    PermissionsAndroid.RESULTS.GRANTED
            );
        }

        const resultado = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        return resultado === PermissionsAndroid.RESULTS.GRANTED;
    }

    async function procurarDispositivos() {
        const permitido = await pedirPermissoes();

        if (!permitido) {
            console.log("Permissão Bluetooth negada");
            return;
        }

        setDispositivosEncontrados([]);
        setBuscando(true);

        managerRef.current.startDeviceScan(null, null, (erro, device) => {
            if (erro) {
                console.log("ERRO BLE:", erro);
                setBuscando(false);
                return;
            }

            if (device && device.name) {
                setDispositivosEncontrados((anteriores) => {
                    if (anteriores.some((d) => d.id === device.id)) {
                        return anteriores;
                    }

                    return [...anteriores, device];
                });
            }
        });

        setTimeout(() => {
            managerRef.current.stopDeviceScan();
            setBuscando(false);
        }, DURACAO_BUSCA_MS);
    }

    async function conectarDispositivo(device: Device, jaConectado = false) {
        try {
            setConectandoId(device.id);

            if (dispositivoConectado) {
                await dispositivoConectado.cancelConnection();
                setDispositivoConectado(null);
            }

            managerRef.current.stopDeviceScan();
            setBuscando(false);

            console.log("Conectando em:", device.name);

            let conectado = jaConectado
                ? device
                : await device.connect();

            try {
                conectado = await conectado.requestMTU(247);

                console.log(
                    "MTU negociado:",
                    conectado.mtu
                );
            } catch (erro) {
                console.log(
                    "Não foi possível negociar MTU maior, seguindo com o padrão:",
                    erro
                );
            }

            await conectado.discoverAllServicesAndCharacteristics();

            const estaConectado = await conectado.isConnected();

            if (!estaConectado) {
                throw new Error("Dispositivo não está conectado.");
            }

            const servicos = await conectado.services();

            const servicoEyeVision = servicos.find(
                (servico) => servico.uuid.toLowerCase() === UUIDS.SERVICO_EYEVISION.toLowerCase()
            );

            if (!servicoEyeVision) {
                throw new Error("Serviço EyeVision não encontrado.");
            }

            const caracteristicas = await conectado.characteristicsForService(
                servicoEyeVision.uuid
            );

            const controle = caracteristicas.find(
                (caracteristica) =>
                    caracteristica.uuid.toLowerCase() === UUIDS.CONTROLE.toLowerCase()
            );

            const imagem = caracteristicas.find(
                (caracteristica) =>
                    caracteristica.uuid.toLowerCase() === UUIDS.IMAGEM.toLowerCase()
            );

            const audio = caracteristicas.find(
                (caracteristica) =>
                    caracteristica.uuid.toLowerCase() === UUIDS.AUDIO.toLowerCase()
            );

            const status = caracteristicas.find(
                (caracteristica) =>
                    caracteristica.uuid.toLowerCase() === UUIDS.STATUS.toLowerCase()
            );

            if (!controle) {
                throw new Error("Característica CONTROLE não encontrada.");
            }

            if (!imagem) {
                throw new Error("Característica IMAGEM não encontrada.");
            }

            if (!audio) {
                throw new Error("Característica AUDIO não encontrada.");
            }

            if (!status) {
                throw new Error("Característica STATUS não encontrada.");
            }

            setCaracteristicaControle(controle);
            setCaracteristicaImagem(imagem);
            setCaracteristicaAudio(audio);
            setCaracteristicaStatus(status);

            console.log("CARACTERÍSTICAS ENCONTRADAS:");
            console.log("CONTROLE:", controle.uuid);
            console.log("IMAGEM:", imagem.uuid);
            console.log("AUDIO:", audio.uuid);
            console.log("STATUS:", status.uuid);

            setDispositivoConectado(conectado);
            await salvarDispositivo(conectado);

            iniciarRecebimentoImagem(
                conectado,
                imagem
            );

            iniciarRecebimentoAudio(
                conectado,
                audio
            );

            iniciarRecebimentoStatus(
                conectado,
                status
            );

            managerRef.current.onDeviceDisconnected(
                conectado.id,
                () => {
                    console.log("Dispositivo desconectado.");

                    setDispositivoConectado((atual) => {
                        if (atual?.id === conectado.id) {
                            setCaracteristicaControle(null);
                            setCaracteristicaImagem(null);
                            setCaracteristicaAudio(null);
                            setCaracteristicaStatus(null);

                            imagemSubscriptionRef.current?.remove();
                            imagemSubscriptionRef.current = null;

                            audioSubscriptionRef.current?.remove();
                            audioSubscriptionRef.current = null;

                            imagemBufferRef.current.clear();
                            audioBufferRef.current.clear();

                            imagemTarefaRef.current = null;
                            audioTarefaRef.current = null;
                            imagemPendenteRef.current = null;
                            audioPendenteRef.current = null;

                            setImagemRecebida(null);
                            setAudioRecebido(null);
                            setRecebendoImagem(false);
                            setRecebendoAudio(false);
                            setTarefaRecebida(null);
                            setStatusDispositivo(0x00);

                            return null;
                        }

                        return atual;
                    });
                }
            );

        } catch (erro) {
            console.log("ERRO AO CONECTAR:", erro);
            setDispositivoConectado(null);
        } finally {
            setConectandoId(null);
        }
    }

    async function capturarImagem() {
        if (!dispositivoConectado) {
            console.log("Nenhum dispositivo conectado.");
            return;
        }

        if (!caracteristicaControle) {
            console.log("Característica CONTROLE não encontrada.");
            return;
        }

        try {
            const conectado = await dispositivoConectado.isConnected();

            if (!conectado) {
                console.log("O dispositivo não está conectado.");
                setDispositivoConectado(null);
                return;
            }

            const comando = textoParaBase64(COMANDOS.CAPTURAR_IMAGEM);

            console.log("Enviando comando CAPTURAR_IMAGEM...");

            await caracteristicaControle.writeWithResponse(comando);

            console.log("Comando CAPTURAR_IMAGEM enviado.");
        } catch (erro) {
            console.log("ERRO AO ENVIAR COMANDO DE IMAGEM:", erro);
        }
    }


    async function desconectarDispositivo() {

        if (!dispositivoConectado) return;

        try {

            imagemSubscriptionRef.current?.remove();
            imagemSubscriptionRef.current = null;

            audioSubscriptionRef.current?.remove();
            audioSubscriptionRef.current = null;

            await dispositivoConectado.cancelConnection();

            setDispositivoConectado(null);

            setCaracteristicaControle(null);
            setCaracteristicaImagem(null);
            setCaracteristicaAudio(null);
            setCaracteristicaStatus(null);

            setImagemRecebida(null);
            setAudioRecebido(null);
            setTarefaRecebida(null);
            setStatusDispositivo(0x00);

            imagemBufferRef.current.clear();
            audioBufferRef.current.clear();

            imagemTarefaRef.current = null;
            audioTarefaRef.current = null;
            imagemPendenteRef.current = null;
            audioPendenteRef.current = null;

            console.log(
                "Dispositivo desconectado com sucesso."
            );

        } catch (erro) {
            console.log(
                "Erro ao desconectar:",
                erro
            );
        }
    }

    async function carregarDispositivosSalvos() {
        try {
            const dados = await AsyncStorage.getItem(CHAVE_DISPOSITIVOS);

            if (dados) {
                setDispositivosSalvos(JSON.parse(dados));
            }
        } catch (erro) {
            console.error(
                "Erro ao carregar dispositivos:",
                erro
            );
        }
    }

    async function salvarDispositivo(device: Device) {
        try {
            const dispositivosAtuais =
                await AsyncStorage.getItem(CHAVE_DISPOSITIVOS);

            const lista: DispositivoSalvo[] =
                dispositivosAtuais
                    ? JSON.parse(dispositivosAtuais)
                    : [];

            const jaExiste = lista.some(
                (dispositivo) => dispositivo.id === device.id
            );

            if (jaExiste) {
                return;
            }

            const novoDispositivo: DispositivoSalvo = {
                id: device.id,
                nome: device.name || "EyeVision",
            };

            const novaLista = [
                ...lista,
                novoDispositivo,
            ];

            await AsyncStorage.setItem(
                CHAVE_DISPOSITIVOS,
                JSON.stringify(novaLista)
            );

            setDispositivosSalvos(novaLista);

        } catch (erro) {
            console.error(
                "Erro ao salvar dispositivo:",
                erro
            );
        }
    }

    async function renomearDispositivo(
        id: string,
        nome: string
    ) {
        try {
            const nomeLimpo = nome.trim();

            if (!nomeLimpo) {
                return;
            }

            const novaLista = dispositivosSalvos.map(
                (dispositivo) =>
                    dispositivo.id === id
                        ? {
                            ...dispositivo,
                            nome: nomeLimpo,
                        }
                        : dispositivo
            );

            setDispositivosSalvos(novaLista);

            await AsyncStorage.setItem(
                CHAVE_DISPOSITIVOS,
                JSON.stringify(novaLista)
            );

        } catch (erro) {
            console.error(
                "Erro ao renomear dispositivo:",
                erro
            );
        }
    }

    async function removerDispositivo(id: string) {
        try {

            if (dispositivoConectado?.id === id) {
                await desconectarDispositivo();
            }

            const novaLista = dispositivosSalvos.filter(
                (dispositivo) => dispositivo.id !== id
            );

            setDispositivosSalvos(novaLista);

            await AsyncStorage.setItem(
                CHAVE_DISPOSITIVOS,
                JSON.stringify(novaLista)
            );

        } catch (erro) {
            console.error(
                "Erro ao remover dispositivo:",
                erro
            );
        }
    }

    async function conectarDispositivoPorId(id: string) {
        try {
            setConectandoId(id);

            managerRef.current.stopDeviceScan();
            setBuscando(false);

            console.log(
                "Conectando ao dispositivo salvo:",
                id
            );

            const device =
                await managerRef.current.connectToDevice(id);

            await conectarDispositivo(device, true);

        } catch (erro) {
            console.log(
                "ERRO AO CONECTAR DISPOSITIVO SALVO:",
                erro
            );
        } finally {
            setConectandoId(null);
        }
    }
    async function enviarComando(comando: string) {
        if (!dispositivoConectado) {
            console.log("Nenhum dispositivo conectado.");
            return;
        }

        try {
            console.log("Enviando comando:", comando);

            const comandoBase64 = btoa(comando);

            await dispositivoConectado.writeCharacteristicWithResponseForService(
                UUIDS.SERVICO_EYEVISION,
                UUIDS.CONTROLE,
                comandoBase64
            );

            console.log("Comando enviado com sucesso!");

        } catch (erro) {
            console.log("ERRO AO ENVIAR COMANDO:", erro);
        }
    }

    function tentarAssociarTarefa() {

        const img = imagemPendenteRef.current;
        const aud = audioPendenteRef.current;

        if (!img || !aud) {
            return;
        }

        if (img.tarefa !== aud.tarefa) {
            console.log(
                "Imagem e áudio pendentes pertencem a tarefas diferentes:",
                img.tarefa,
                aud.tarefa
            );
            return;
        }

        const tarefa: TarefaRecebida = {
            id: img.tarefa,
            imagem: img.base64,
            audio: aud.base64
        };

        imagemPendenteRef.current = null;
        audioPendenteRef.current = null;

        console.log(
            "Imagem e áudio associados na tarefa:",
            tarefa.id
        );

        setTarefaRecebida(tarefa);
    }

    function reconstruirDados(
        buffer: Map<number, Uint8Array>,
        total: number
    ): Uint8Array | null {

        if (buffer.size !== total) {
            return null;
        }

        for (let i = 0; i < total; i++) {
            if (!buffer.has(i)) {
                return null;
            }
        }

        let tamanhoTotal = 0;

        for (const dados of buffer.values()) {
            tamanhoTotal += dados.length;
        }

        const resultado = new Uint8Array(tamanhoTotal);

        let posicao = 0;

        for (let i = 0; i < total; i++) {
            const dados = buffer.get(i)!;

            resultado.set(dados, posicao);

            posicao += dados.length;
        }

        return resultado;
    }

    function bytesParaBase64(bytes: Uint8Array): string {

        let binario = "";

        const tamanhoBloco = 0x8000;

        for (let i = 0; i < bytes.length; i += tamanhoBloco) {

            const bloco = bytes.subarray(
                i,
                Math.min(i + tamanhoBloco, bytes.length)
            );

            binario += String.fromCharCode(...bloco);
        }

        return btoa(binario);
    }

    function iniciarRecebimentoImagem(
        device: Device,
        characteristic: Characteristic
    ) {
        setRecebendoImagem(true);
        imagemBufferRef.current.clear();
        imagemTarefaRef.current = null;
        imagemPendenteRef.current = null;

        console.log("Monitorando IMAGEM...");

        imagemSubscriptionRef.current =
        device.monitorCharacteristicForService(
            UUIDS.SERVICO_EYEVISION,
            characteristic.uuid,
            (erro, characteristicAtualizada) => {

                if (erro) {
                    console.log("ERRO AO RECEBER IMAGEM:", erro);
                    setRecebendoImagem(false);
                    return;
                }

                if (!characteristicAtualizada?.value) {
                    return;
                }

                try {
                    const bytes = toByteArray(
                        characteristicAtualizada.value
                    );

                    if (bytes.length < TAMANHO_CABECALHO) {
                        console.log("Fragmento de imagem inválido.");
                        return;
                    }

                    const tipo = bytes[0];

                    const tarefa =
                        bytes[1] |
                        (bytes[2] << 8);

                    const sequencia =
                        bytes[3] |
                        (bytes[4] << 8);

                    const total =
                        bytes[5] |
                        (bytes[6] << 8);

                    const dados = bytes.slice(7);

                    if (tipo !== TIPOS_FRAGMENTO.IMAGEM) {
                        console.log("Tipo de fragmento inesperado:", tipo);
                        return;
                    }
                    
                    if (imagemTarefaRef.current === null) {
                        imagemTarefaRef.current = tarefa;
                    }

                    if (imagemTarefaRef.current !== tarefa) {
                        console.log(
                            "Fragmento pertence a outra tarefa."
                        );
                        return;
                    }

                    imagemBufferRef.current.set(
                        sequencia,
                        dados
                    );

                    console.log(
                        `Imagem: ${sequencia + 1}/${total}`
                    );

                    if (imagemBufferRef.current.size === total) {

                        const imagem = reconstruirDados(
                            imagemBufferRef.current,
                            total
                        );

                        if (!imagem) {
                            console.log(
                                "Não foi possível reconstruir a imagem."
                            );
                            setRecebendoImagem(false);
                            return;
                        }

                        const base64 = bytesParaBase64(imagem);

                        setImagemRecebida(base64);
                        setRecebendoImagem(false);

                        imagemPendenteRef.current = {
                            tarefa: imagemTarefaRef.current!,
                            base64
                        };

                        imagemBufferRef.current.clear();

                        imagemTarefaRef.current = null;

                        console.log(
                            "Imagem recebida e reconstruída!"
                        );

                        tentarAssociarTarefa();
                    }

                } catch (erro) {
                    console.log(
                        "ERRO AO PROCESSAR IMAGEM:",
                        erro
                    );

                    setRecebendoImagem(false);
                }
            }
        );
    }

    function iniciarRecebimentoAudio(
        device: Device,
        characteristic: Characteristic
    ) {
        setRecebendoAudio(true);
        audioBufferRef.current.clear();
        audioTarefaRef.current = null;
        audioPendenteRef.current = null;

        console.log("Monitorando AUDIO...");

        audioSubscriptionRef.current =
        device.monitorCharacteristicForService(
            UUIDS.SERVICO_EYEVISION,
            characteristic.uuid,
            (erro, characteristicAtualizada) => {

                if (erro) {
                    console.log("ERRO AO RECEBER ÁUDIO:", erro);
                    setRecebendoAudio(false);
                    return;
                }

                if (!characteristicAtualizada?.value) {
                    return;
                }

                try {
                    const bytes = toByteArray(
                        characteristicAtualizada.value
                    );

                    if (bytes.length < TAMANHO_CABECALHO) {
                        console.log("Fragmento de áudio inválido.");
                        return;
                    }

                    const tipo = bytes[0];

                    const tarefa =
                        bytes[1] |
                        (bytes[2] << 8);

                    const sequencia =
                        bytes[3] |
                        (bytes[4] << 8);

                    const total =
                        bytes[5] |
                        (bytes[6] << 8);

                    const dados = bytes.slice(7);

                    if (tipo !== TIPOS_FRAGMENTO.AUDIO) {
                        console.log(
                            "Tipo de fragmento inesperado:",
                            tipo
                        );
                        return;
                    }

                    if (audioTarefaRef.current === null) {
                        audioTarefaRef.current = tarefa;
                    }

                    if (audioTarefaRef.current !== tarefa) {
                        console.log(
                            "Fragmento pertence a outra tarefa."
                        );
                        return;
                    }

                    audioBufferRef.current.set(
                        sequencia,
                        dados
                    );

                    console.log(
                        `Áudio: ${sequencia + 1}/${total}`
                    );

                    if (audioBufferRef.current.size === total) {

                        const audio = reconstruirDados(
                            audioBufferRef.current,
                            total
                        );

                        if (!audio) {
                            console.log(
                                "Não foi possível reconstruir o áudio."
                            );
                            setRecebendoAudio(false);
                            return;
                        }

                        const base64 = bytesParaBase64(audio);

                        setAudioRecebido(base64);
                        setRecebendoAudio(false);

                        audioPendenteRef.current = {
                            tarefa: audioTarefaRef.current!,
                            base64
                        };

                        audioBufferRef.current.clear();

                        audioTarefaRef.current = null;

                        console.log(
                            "Áudio recebido e reconstruído!"
                        );

                        tentarAssociarTarefa();
                    }

                } catch (erro) {
                    console.log(
                        "ERRO AO PROCESSAR ÁUDIO:",
                        erro
                    );

                    setRecebendoAudio(false);
                }
            }
        );
    }

    function iniciarRecebimentoStatus(
        device: Device,
        characteristic: Characteristic
    ) {
        console.log("Monitorando STATUS...");

        device.monitorCharacteristicForService(
            UUIDS.SERVICO_EYEVISION,
            characteristic.uuid,
            (erro, characteristicAtualizada) => {

                if (erro) {
                    console.log(
                        "ERRO AO RECEBER STATUS:",
                        erro
                    );
                    return;
                }

                if (!characteristicAtualizada?.value) {
                    return;
                }

                try {
                    const bytes = toByteArray(
                        characteristicAtualizada.value
                    );

                    if (bytes.length < 1) {
                        return;
                    }

                    const status = bytes[0];

                    setStatusDispositivo(status);

                    console.log(
                        "Status do dispositivo:",
                        status
                    );

                } catch (erro) {
                    console.log(
                        "ERRO AO PROCESSAR STATUS:",
                        erro
                    );
                }
            }
        );
    }

    async function analisarCaptura() {

        if (!tarefaRecebida) {
            console.log(
                "Nenhuma tarefa disponível para análise."
            );
            return;
        }

        console.log(
            "Enviando tarefa para o Gemini:",
            tarefaRecebida.id
        );

        setProcessandoIA(true);
        setRespostaIA(null);

        try {

            const resultado = await processarCaptura(
                tarefaRecebida.imagem,
                tarefaRecebida.audio,
                "image/jpeg",
                "audio/wav"
            );

            if (resultado.sucesso) {

                console.log(
                    "Resposta do Gemini:",
                    resultado.resposta
                );

                setRespostaIA(resultado.resposta);

                await Speech.stop();

                await Speech.speak(
                    resultado.resposta,
                    {
                        language: obterCodigoIdioma(
                            configuracoes.idiomaLeitura
                        ),
                        rate: configuracoes.velocidadeFala,
                        volume: configuracoes.volumeFala,
                        pitch: 1.0,
                    }
                );

            } else {

                console.log(
                    "Erro na análise:",
                    resultado.erro
                );

                const mensagemErro =
                    "Não foi possível realizar a análise.";

                setRespostaIA(mensagemErro);

                await Speech.stop();

                await Speech.speak(
                    mensagemErro,
                    {
                        language: "pt-BR",
                        rate: 0.95,
                    }
                );
            }

        } catch (erro) {

            console.error(
                "Erro ao analisar captura:",
                erro
            );

            const mensagemErro =
                "Ocorreu um erro ao processar a solicitação.";

            setRespostaIA(mensagemErro);

            await Speech.stop();

            await Speech.speak(
                mensagemErro,
                {
                    language: "pt-BR",
                    rate: 0.95,
                }
            );

        } finally {

            setProcessandoIA(false);
        }
    }

    return (
        <BluetoothContext.Provider
            value={{
                dispositivosEncontrados,
                dispositivosSalvos,

                buscando,
                dispositivoConectado,
                conectandoId,

                caracteristicaControle,
                caracteristicaImagem,
                caracteristicaAudio,
                caracteristicaStatus,

                imagemRecebida,
                audioRecebido,
                tarefaRecebida,
                statusDispositivo,
                textoStatusDispositivo: obterTextoStatus(statusDispositivo),

                recebendoImagem,
                recebendoAudio,

                processandoIA,
                respostaIA,

                procurarDispositivos,
                conectarDispositivo,
                conectarDispositivoPorId,
                desconectarDispositivo,

                salvarDispositivo,
                renomearDispositivo,
                removerDispositivo,

                capturarImagem,
                analisarCaptura,
            }}
        >
            {children}
        </BluetoothContext.Provider>
    );
}

export function useBluetooth() {
    const contexto = useContext(BluetoothContext);

    if (!contexto) {
        throw new Error(
            "useBluetooth precisa ser usado dentro de um BluetoothProvider"
        );
    }

    return contexto;
}