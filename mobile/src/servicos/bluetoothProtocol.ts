export const UUIDS = {
    SERVICO_EYEVISION:
        "7d3a0000-8b6e-4c2a-9f10-123456789abc",

    CONTROLE:
        "7d3a0001-8b6e-4c2a-9f10-123456789abc",

    IMAGEM:
        "7d3a0002-8b6e-4c2a-9f10-123456789abc",

    AUDIO:
        "7d3a0003-8b6e-4c2a-9f10-123456789abc",

    STATUS:
        "7d3a0004-8b6e-4c2a-9f10-123456789abc",
};

export const COMANDOS = {
    CAPTURAR_IMAGEM: "CAPTURAR_IMAGEM",
    CAPTURAR_AUDIO: "CAPTURAR_AUDIO",
    PARAR_AUDIO: "PARAR_AUDIO",
};

export const TIPOS_FRAGMENTO = {
    IMAGEM: 0x01,
    AUDIO: 0x02,
};

export const STATUS = {
    PRONTO: 0x00,
    CAPTURANDO_IMAGEM: 0x01,
    GRAVANDO_AUDIO: 0x02,
    ENVIANDO_IMAGEM: 0x03,
    ENVIANDO_AUDIO: 0x04,
    ERRO: 0x05,
};

export const TAMANHO_PAYLOAD = 180;

export const TAMANHO_CABECALHO = 7;

export function textoParaBase64(texto: string): string {
    return btoa(texto);
}