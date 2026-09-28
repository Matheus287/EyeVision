import * as FileSystem from "expo-file-system/legacy";
import { Asset } from "expo-asset";

export async function arquivoParaBase64(
    modulo: number
): Promise<string> {

    const asset = Asset.fromModule(modulo);

    await asset.downloadAsync();

    if (!asset.localUri) {
        throw new Error("Não foi possível obter o arquivo local.");
    }

    return await FileSystem.readAsStringAsync(asset.localUri, {
        encoding: FileSystem.EncodingType.Base64
    });
}