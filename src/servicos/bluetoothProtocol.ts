export const UUIDS = {
    SERVICO_EYEVISION: "7d3a0000-8b6e-4c2a-9f10-123456789abc",

    CONTROLE: "7d3a0001-8b6e-4c2a-9f10-123456789abc",
    IMAGEM: "7d3a0002-8b6e-4c2a-9f10-123456789abc",
    AUDIO: "7d3a0003-8b6e-4c2a-9f10-123456789abc",
    STATUS: "7d3a0004-8b6e-4c2a-9f10-123456789abc",
};

export const COMANDOS = {
    CAPTURAR_IMAGEM: "CAPTURAR_IMAGEM",
    CAPTURAR_AUDIO: "CAPTURAR_AUDIO",
    PARAR_AUDIO: "PARAR_AUDIO",
};

export function textoParaBase64(texto: string): string {
    return btoa(texto);
}
