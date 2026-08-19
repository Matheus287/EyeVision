import { Stack } from "expo-router";
import { cores } from "../theme/colors";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function Layout() {

    const [fontsLoaded] = useFonts({
        Nunito: require("../assets/fonts/static/Nunito-Regular.ttf"),
        NunitoSemiBold: require("../assets/fonts/static/Nunito-SemiBold.ttf"),
        NunitoBold: require("../assets/fonts/static/Nunito-Bold.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: cores.fundo,
                },
            }}
        />
    );
}