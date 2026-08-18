import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { cores } from "../theme/colors";

interface SwitchProps {
    ligado: boolean;
    aoAlternar: () => void;
}

export function Switch({ ligado, aoAlternar }: SwitchProps) {

    const anim = useRef(new Animated.Value(ligado ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: ligado ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [ligado]);

    const corFundo = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [cores.divisoria, cores.terciaria],
    });

    const posicaoBolinha = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [4, 28],
    });

    return (
        <Pressable onPress={aoAlternar} hitSlop={8}>
            <Animated.View style={[estilos.toggleButton, { backgroundColor: corFundo }]}>
                <Animated.View
                    style={[estilos.bolinha, { left: posicaoBolinha }]}
                />
            </Animated.View>
        </Pressable>
    );
}

const estilos = StyleSheet.create({
    toggleButton: {
        width: 60,
        height: 32,
        borderRadius: 999,
        justifyContent: "center",
    },
    bolinha: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: cores.primariaClara,
        position: "absolute",
    },
});
