import { colors } from "@/constants/tokens";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";

const defaultSearchOptions = {
	tintColor: colors.primary,
	hideWhenScrolling: false,
}

export const useNavigationSearch = ({
	searchBarOptions,
}) => {
	const [search, setSearch] = useState('')

	const navigation = useNavigation()

	const handleOnChangeText = ({ nativeEvent: { text } }) => {
		setSearch(text)
	}

	useLayoutEffect(() => {
		navigation.setOptions({
			headerSearchBarOptions: {
				...defaultSearchOptions,
				...searchBarOptions,
				onChangeText: handleOnChangeText,
			},
		})
	}, [navigation, searchBarOptions])

	return search
}