export interface Configuracoes {
    alertasObstaculos: boolean;
    modoLeitura: boolean;
    modoNavegacao: boolean;
    economiaBateria: boolean;
    volumeFala: number;
    velocidadeFala: number;
    idiomaLeitura: string;
}

export const configuracoesPadrao: Configuracoes = {
    alertasObstaculos: true,
    modoLeitura: false,
    modoNavegacao: false,
    economiaBateria: false,
    volumeFala: 1,
    velocidadeFala: 1,
    idiomaLeitura: "Português (Brasil)",
};