import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";

const DURACAO_BUSCA_MS = 10000;

interface BluetoothContextType {
    dispositivosEncontrados: Device[];
    buscando: boolean;
    dispositivoConectado: Device | null;
    conectandoId: string | null;
    procurarDispositivos: () => Promise<void>;
    conectarDispositivo: (device: Device) => Promise<void>;
    desconectarDispositivo: () => Promise<void>;
}

const BluetoothContext = createContext<BluetoothContextType | null>(null);

export function BluetoothProvider({ children }: { children: ReactNode }) {

    // o manager e a conexão vivem aqui, um nível acima das telas,
    // então sobrevivem quando você navega entre elas
    const managerRef = useRef(new BleManager());

    const [dispositivosEncontrados, setDispositivosEncontrados] = useState<Device[]>([]);
    const [buscando, setBuscando] = useState(false);
    const [dispositivoConectado, setDispositivoConectado] = useState<Device | null>(null);
    const [conectandoId, setConectandoId] = useState<string | null>(null);

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

        // Android < 12 precisa de localização para escanear BLE
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

            const conectado = await device.connect();
            await conectado.discoverAllServicesAndCharacteristics();

            const estaConectado = await conectado.isConnected();

            if (!estaConectado) {
                throw new Error("Dispositivo não está conectado.");
            }

            setDispositivoConectado(conectado);

            // detecta quando o dispositivo cai sozinho (desligou, saiu de alcance etc.)
            managerRef.current.onDeviceDisconnected(conectado.id, () => {
                setDispositivoConectado((atual) =>
                    atual?.id === conectado.id ? null : atual
                );
            });
        } catch (erro) {
            console.log("ERRO AO CONECTAR:", erro);
            setDispositivoConectado(null);
        } finally {
            setConectandoId(null);
        }
    }

    async function desconectarDispositivo() {
        if (!dispositivoConectado) return;

        try {
            await dispositivoConectado.cancelConnection();
            setDispositivoConectado(null);
        } catch (erro) {
            console.log("Erro ao desconectar:", erro);
        }
    }

    return (
        <BluetoothContext.Provider
            value={{
                dispositivosEncontrados,
                buscando,
                dispositivoConectado,
                conectandoId,
                procurarDispositivos,
                conectarDispositivo,
                desconectarDispositivo,
            }}
        >
            {children}
        </BluetoothContext.Provider>
    );
}

export function useBluetooth() {
    const contexto = useContext(BluetoothContext);

    if (!contexto) {
        throw new Error("useBluetooth precisa ser usado dentro de um BluetoothProvider");
    }

    return contexto;
}
