import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Configuracoes, configuracoesPadrao } from "../dados/configuracoes";

interface ConfiguracoesContexto {

    configuracoes: Configuracoes;

    alterarConfiguracao: <K extends keyof Configuracoes>(
        chave: K,
        valor: Configuracoes[K]
    ) => void;

    restaurarConfiguracoes: () => void;
}

const ConfiguracoesContext = createContext<
    ConfiguracoesContexto | undefined
>(undefined);

const CHAVE_STORAGE = "@eyevision:configuracoes";

export function ConfiguracoesProvider({
    children,
}: {
    children: ReactNode;
}) {

    const [configuracoes, setConfiguracoes] =
        useState<Configuracoes>(configuracoesPadrao);

    useEffect(() => {
        carregarConfiguracoes();
    }, []);

    async function carregarConfiguracoes() {

        try {

            const dados = await AsyncStorage.getItem(
                CHAVE_STORAGE
            );

            if (dados) {

                const configuracoesSalvas =
                    JSON.parse(dados);

                setConfiguracoes({
                    ...configuracoesPadrao,
                    ...configuracoesSalvas,
                });
            }

        } catch (erro) {

            console.error(
                "Erro ao carregar configurações:",
                erro
            );
        }
    }

    async function alterarConfiguracao<
        K extends keyof Configuracoes
    >(
        chave: K,
        valor: Configuracoes[K]
    ) {

        const novasConfiguracoes = {
            ...configuracoes,
            [chave]: valor,
        };

        setConfiguracoes(novasConfiguracoes);

        try {

            await AsyncStorage.setItem(
                CHAVE_STORAGE,
                JSON.stringify(novasConfiguracoes)
            );

        } catch (erro) {

            console.error(
                "Erro ao salvar configuração:",
                erro
            );
        }
    }

    async function restaurarConfiguracoes() {

        setConfiguracoes(configuracoesPadrao);

        try {

            await AsyncStorage.setItem(
                CHAVE_STORAGE,
                JSON.stringify(configuracoesPadrao)
            );

        } catch (erro) {

            console.error(
                "Erro ao restaurar configurações:",
                erro
            );
        }
    }

    return (
        <ConfiguracoesContext.Provider
            value={{
                configuracoes,
                alterarConfiguracao,
                restaurarConfiguracoes,
            }}
        >
            {children}
        </ConfiguracoesContext.Provider>
    );
}

export function useConfiguracoes() {

    const contexto = useContext(
        ConfiguracoesContext
    );

    if (!contexto) {

        throw new Error(
            "useConfiguracoes deve ser usado dentro de ConfiguracoesProvider"
        );
    }

    return contexto;
}