import { View, StyleSheet, Button, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import React from 'react'
import { useEffect, useState } from "react";
import { useMusicStore } from '@/store/useMusicStore';
import { useDebounce } from "@/hooks/useDebounce";
import { searchStyles } from "@/assets/styles/search.styles";
import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Search() {

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const { searchedSongs, searchedAlbums, searchedArtists, searchAll } = useMusicStore();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

    

  const handleSearch = async (query) => {
  setLoading(true);
  try {
    await searchAll(query);
  } catch (error) {
    console.error("Error searching:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  handleSearch(debouncedSearchQuery);
}, [debouncedSearchQuery]);

  const ItemDivider = () => (
      <View style={{ ...styles.itemSeparator, marginVertical: 9, marginLeft: 60 }} />
    )

    

    

  
  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Search for songs, albums, artists"
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          handleSearch();
        }}
        style={{ borderWidth: 1, padding: 10 }}
      />

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Songs:</Text>
      <FlatList
        data={searchedSongs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Text>{item.title}</Text>}
      />

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Albums:</Text>
      <FlatList
        data={searchedAlbums}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Text>{item.title}</Text>}
      />

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Artists:</Text>
      <FlatList
        data={searchedArtists}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
}

function NoResultsFound() {
  return (
    <View style={searchStyles.emptyState}>
      <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
      <Text style={searchStyles.emptyTitle}>No results</Text>
      <Text style={searchStyles.emptyDescription}>
        Try adjusting your search or try different keywords
      </Text>
    </View>
  );
}
