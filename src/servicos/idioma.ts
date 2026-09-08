export function obterCodigoIdioma(idioma: string): string {
    switch (idioma) {
        case "Português (Brasil)":
            return "pt-BR";

        case "English (United States)":
            return "en-US";

        case "Español":
            return "es-ES";

        default:
            return "pt-BR";
    }
}