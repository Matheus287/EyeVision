import { Stack } from "expo-router";
import { cores } from "../theme/colors";

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: cores.fundo },
            }}
        />
    );
}
