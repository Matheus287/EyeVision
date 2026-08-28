import { createContext, ReactNode, useContext, useEffect, useRef,useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device, Characteristic } from "react-native-ble-plx";
import { UUIDS, COMANDOS, textoParaBase64 } from "../servicos/bluetoothProtocol";

const DURACAO_BUSCA_MS = 10000;

interface BluetoothContextType {
    dispositivosEncontrados: Device[];
    buscando: boolean;
    dispositivoConectado: Device | null;
    conectandoId: string | null;
    
    caracteristicaControle: Characteristic | null;
    caracteristicaImagem: Characteristic | null;
    caracteristicaAudio: Characteristic | null;
    caracteristicaStatus: Characteristic | null;

    procurarDispositivos: () => Promise<void>;
    conectarDispositivo: (device: Device) => Promise<void>;
    desconectarDispositivo: () => Promise<void>;
    capturarImagem: () => Promise<void>;
}

const BluetoothContext = createContext<BluetoothContextType | null>(null);

export function BluetoothProvider({ children }: { children: ReactNode }) {

    const managerRef = useRef(new BleManager());

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

    useEffect(() => {
        const manager = managerRef.current;

        return () => {
            manager.stopDeviceScan();
            manager.destroy();
        };
    }, []);

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

            if (device) {
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

    async function conectarDispositivo(device: Device) {
        try {
            setConectandoId(device.id);

            if (dispositivoConectado) {
                await dispositivoConectado.cancelConnection();
                setDispositivoConectado(null);
            }

            managerRef.current.stopDeviceScan();
            setBuscando(false);

            console.log("Conectando em:", device.name);

            const conectado = await device.connect();

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
            await dispositivoConectado.cancelConnection();
            setDispositivoConectado(null);
            setCaracteristicaControle(null);
            setCaracteristicaImagem(null);
            setCaracteristicaAudio(null);
            setCaracteristicaStatus(null);

            console.log("Dispositivo desconectado com sucesso.");
        } catch (erro) {
            console.log("Erro ao desconectar:", erro);
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

    return (
        <BluetoothContext.Provider
            value={{
                dispositivosEncontrados,
                buscando,
                dispositivoConectado,
                conectandoId,

                caracteristicaControle,
                caracteristicaImagem,
                caracteristicaAudio,
                caracteristicaStatus,

                procurarDispositivos,
                conectarDispositivo,
                desconectarDispositivo,
                capturarImagem,
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