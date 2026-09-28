import { useEffect, useRef } from "react";
import { AccessibilityInfo } from "react-native";

export function anunciar(mensagem: string) {
    AccessibilityInfo.announceForAccessibility(mensagem);
}

export function useAnuncioDeTela(titulo: string) {
    useEffect(() => {
        const tempo = setTimeout(() => {
            anunciar(titulo);
        }, 400);

        return () => clearTimeout(tempo);
    }, []);
}

export function useAnuncioDeMudanca<T>(
    valor: T,
    montarMensagem: (valorAtual: T, valorAnterior: T | undefined) => string | null
) {
    const anteriorRef = useRef<T | undefined>(undefined);
    const jaRenderizouRef = useRef(false);

    useEffect(() => {
        if (jaRenderizouRef.current) {
            const mensagem = montarMensagem(valor, anteriorRef.current);
            if (mensagem) {
                anunciar(mensagem);
            }
        }

        jaRenderizouRef.current = true;
        anteriorRef.current = valor;
    }, [valor]);
}
