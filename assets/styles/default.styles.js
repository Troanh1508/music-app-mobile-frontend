import { StyleSheet } from "react-native";
import { colors, fontSize } from "@/constants/tokens"

const styles = StyleSheet.create({
  container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	text: {
		fontSize: fontSize.base,
		color: colors.text,
	},
});

