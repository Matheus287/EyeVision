import { Text, TextProps } from "react-native";

export function Texto(props: TextProps) {
    return (
        <Text
            {...props}
            style={[
                { fontFamily: "Nunito", color:"#FFF" },
                props.style
            ]}
        />
    );
}