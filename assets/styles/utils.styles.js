import { StyleSheet } from "react-native";
import { colors, fontSize } from "@/constants/tokens"

const styles = StyleSheet.create({
    centeredRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
    },
    slider: {
        height: 7,
        borderRadius: 16,
    },
    itemSeparator: {
        borderColor: colors.textMuted,
        borderWidth: StyleSheet.hairlineWidth,
        opacity: 0.3,
    },
    emptyContentText: {
        ...defaultStyles.text,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: 20,
    },
    emptyContentImage: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginTop: 40,
        opacity: 0.3,
    },
});

