import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, PermissionsAndroid, Platform, Pressable } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

const manager = new BleManager();

export default function TesteBluetooth() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [dispositivoConectado, setDispositivoConectado] = useState<Device | null>(null);
  const [conectando, setConectando] = useState(false);

  async function pedirPermissoes() {
    if (Platform.OS !== 'android') return true;

    if (Platform.Version >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      return (
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    }

    return true;
  }

  async function procurarDispositivos() {
    const permitido = await pedirPermissoes();

    if (!permitido) {
      console.log('Permissão Bluetooth negada');
      return;
    }

    console.log('Iniciando busca...');

    setDevices([]);
    setScanning(true);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('ERRO BLE:', error);
        setScanning(false);
        return;
      }

      if (device) {
        console.log(
          'DISPOSITIVO:',
          device.name,
          device.id
        );

        setDevices((anteriores) => {
          const existe = anteriores.some((d) => d.id === device.id);

          if (existe) {
            return anteriores;
          }

          const novaLista = [...anteriores, device];

          console.log('LISTA AGORA:', novaLista.map((d) => ({
            nome: d.name,
            id: d.id,
          })));

          return novaLista;
        });
      }
    });

    setTimeout(() => {
      console.log('Finalizando busca...');

      manager.stopDeviceScan();
      setScanning(false);
    }, 10000);
  }

  useEffect(() => {
    return () => {
      manager.stopDeviceScan();
    };
  }, []);

  async function conectarDispositivo(device: Device) {
    try {
      setConectando(true);

      if (dispositivoConectado) {
        console.log('Desconectando dispositivo anterior...');

        await dispositivoConectado.cancelConnection();

        setDispositivoConectado(null);
      }

      console.log('Conectando a:', device.name, device.id);

      const conectado = await device.connect();

      await conectado.discoverAllServicesAndCharacteristics();

      const conectadoAgora = await conectado.isConnected();

      console.log('ESTÁ REALMENTE CONECTADO?', conectadoAgora);

      if (!conectadoAgora) {
        throw new Error('Dispositivo não está conectado.');
      }

      const servicos = await conectado.services();

      for (const servico of servicos) {
        console.log('SERVIÇO:', servico.uuid);

        const caracteristicas = await conectado.characteristicsForService(
          servico.uuid
        );

        console.log('CARACTERÍSTICAS:', caracteristicas);
      }

      setDispositivoConectado(conectado);

    } catch (error) {
      console.log('ERRO AO CONECTAR:', error);
      setDispositivoConectado(null);
    } finally {
      setConectando(false);
    }
  }

  async function desconectarDispositivo() {
    if (!dispositivoConectado) return;

    try {
      console.log('Desconectando:', dispositivoConectado.name);

      await dispositivoConectado.cancelConnection();

      console.log('Desconectado com sucesso');

      setDispositivoConectado(null);
    } catch (error) {
      console.log('Erro ao desconectar:', error);
    }
  }

  console.log(
    'DEVICES NO RENDER:',
    devices.map((d, i) => ({
      index: i,
      id: d?.id,
      name: d?.name,
    }))
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Teste Bluetooth
      </Text>

      <Button
        title={scanning ? 'Procurando...' : 'Procurar dispositivos'}
        onPress={procurarDispositivos}
        disabled={scanning}
      />

      <Text style={{ marginTop: 20, marginBottom: 10 }}>
        Dispositivos encontrados: {devices.length}
      </Text>

      <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 20 }}>
        Quantidade: {devices.length}
      </Text>

      {devices.map((device) => (
        <Pressable
          key={device.id}
          onPress={() => conectarDispositivo(device)}
          disabled={conectando}
          style={{
            padding: 15,
            marginTop: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            {device.name ?? 'Dispositivo sem nome'}
          </Text>

          <Text style={{ color: 'white', marginTop: 5 }}>
            ID: {device.id}
          </Text>
        </Pressable>
      ))}

      {conectando && (
        <Text style={{ color: 'white', marginTop: 20 }}>
          Conectando...
        </Text>
      )}

      {dispositivoConectado && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: 'white', fontSize: 20 }}>
            🟢 Conectado
          </Text>

          <Text style={{ color: 'white' }}>
            {dispositivoConectado.name ?? 'Dispositivo sem nome'}
          </Text>

          <Text style={{ color: 'white' }}>
            {dispositivoConectado.id}
          </Text>

          <Button
            title="Desconectar"
            onPress={desconectarDispositivo}
          />
        </View>
      )}

    </View>
    </View>
  );
}