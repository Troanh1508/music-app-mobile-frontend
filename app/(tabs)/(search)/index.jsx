import { View, StyleSheet, Button, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Pressable } from 'react-native';
import React from 'react'
import { Image } from 'expo-image';
import { useEffect, useState } from "react";
import { useMusicStore } from '@/store/useMusicStore';
import { useDebounce } from "@/hooks/useDebounce";
import { searchStyles } from "@/assets/styles/search.styles";
import { favoriteStyles } from '@/assets/styles/favorite.styles';
import COLORS from "@/constants/colors";
import { colors, fontSize } from '@/constants/tokens';
import { Ionicons, Entypo } from "@expo/vector-icons";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAudioQueueStore } from '@/store/useAudioQueueStore';
import { AudioPro, useAudioPro, AudioProState } from 'react-native-audio-pro';
import { LoaderKitView } from 'react-native-loader-kit';
import { StopPropagation } from '@/components/utils/StopPropagation';
import { SongShortcutsMenu } from '@/components/SongShortcutsMenu';
import { mapSongsToQueue } from '@/helpers/mapSongsToQueue';
import { Link, useRouter } from 'expo-router';

export default function Search() {

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { queue, setQueue, currentIndex } = useAudioQueueStore();
  const { playingTrack, state } = useAudioPro();
  const router = useRouter();
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
    <View style={{ ...favoriteStyles.itemSeparator, marginVertical: 9, marginLeft: 60 }} />
  )

  const renderSongItem = ({ item, index }) => {
    const isActiveTrack = item._id === queue[currentIndex]?.id;
    return (
      <Pressable
        onPress={() => {
          const queue = mapSongsToQueue(searchedSongs);
          setQueue(queue, index);
          AudioPro.play(queue[index]);// Set the queue and start playing from the clicked song
        }}
      >
        <View style={favoriteStyles.trackItemContainer}>
          <View>
            <Image source={item.imageUrl ?? unknownTrackImageUri} style={{ ...favoriteStyles.trackArtworkImage, }} />
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Track title + artist */}
            <View style={{
              width: '100%', flex: 1, flexDirection: 'row', justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  {isActiveTrack &&
                    ((state === AudioProState.PLAYING) ? (
                      <LoaderKitView
                        style={{ width: 20, height: 20 }}
                        name={'AudioEqualizer'}
                        color={COLORS.primary}
                      />
                    ) : (
                      null
                    ))}
                  <Text
                    numberOfLines={1}
                    style={{
                      ...favoriteStyles.trackTitleText,
                      color: isActiveTrack ? COLORS.primary : colors.text,
                      flex: 1,
                    }}
                  >
                    {item.title}
                  </Text>

                </View>

                {item.artist.name && (
                  <Text numberOfLines={1} style={favoriteStyles.trackArtistText}>
                    {item.artist.name}
                  </Text>
                )}
              </View>


              <StopPropagation>
                <SongShortcutsMenu song={item}>
                  <Entypo name="dots-three-horizontal" size={18} color={colors.icon} />
                </SongShortcutsMenu>
              </StopPropagation>

            </View>


          </View>
        </View>
      </Pressable>
    );
  };

  const renderAlbumItem = ({ item }) => {
    return (

      <Pressable onPress={() => { router.push(`(tabs)/(search)/album/${item._id}`);}}>
        <View style={favoriteStyles.trackItemContainer}>
          <View>
            <Image source={item.imageUrl ?? unknownTrackImageUri} style={{ ...favoriteStyles.trackArtworkImage, }} />
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Track title + artist */}
            <View style={{
              width: '100%', flex: 1, flexDirection: 'row', justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...favoriteStyles.trackTitleText,
                      color: colors.text,
                      flex: 1,
                    }}
                  >
                    {item.title}
                  </Text>

                </View>

                {item.artist.name && (
                  <Text numberOfLines={1} style={favoriteStyles.trackArtistText}>
                    {item.artist.name}
                  </Text>
                )}
              </View>

            </View>
          </View>
        </View>
      </Pressable>

    );
  };

  const renderArtistItem = ({ item }) => {
    return (

      <Pressable onPress={() => { router.push(`(tabs)/(search)/artist/${item._id}`); }}>
        <View style={favoriteStyles.trackItemContainer}>
          <View>
            <Image source={item.imageUrl ?? unknownTrackImageUri} style={{ ...favoriteStyles.ArtistImage, }} />
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Track title + artist */}
            <View style={{
              width: '100%', flex: 1, flexDirection: 'row', justifyContent: 'space-between',
              alignItems: 'center',
            }}>

              <Text
                numberOfLines={1}
                style={{
                  ...favoriteStyles.trackTitleText,
                  color: colors.text,
                  flex: 1,
                }}
              >
                {item.name}
              </Text>



            </View>
          </View>
        </View>
      </Pressable>

    );
  };




  return (
    <ScrollView style={{ backgroundColor: "black", flex: 1 }}>
      <View style={{ padding: 20, paddingBottom: 200 }}>
        <View style={searchStyles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.textMuted}
            style={searchStyles.searchIcon}
          />
          <TextInput
            style={searchStyles.searchInput}
            placeholder="Search for songs, albums, artists"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={(text) => {
            setSearchQuery(text);
            }}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} style={searchStyles.clearButton}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {searchedSongs.length > 0 && (
    <>
      <Text style={{ marginVertical: 20, fontWeight: 'bold', color: colors.text }}>Songs:</Text>
      <FlatList
        data={searchedSongs}
        renderItem={({ item, index }) => renderSongItem({ item, index })}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={ItemDivider}
        ListFooterComponent={ItemDivider}
        scrollEnabled={false}
      />
    </>
  )}

  {searchedAlbums.length > 0 && (
    <>
      <Text style={{ marginVertical: 20, fontWeight: 'bold', color: colors.text }}>Albums:</Text>
      <FlatList
        data={searchedAlbums}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => renderAlbumItem({ item })}
        ItemSeparatorComponent={ItemDivider}
        ListFooterComponent={ItemDivider}
        scrollEnabled={false}
      />
    </>
  )}

  {searchedArtists.length > 0 && (
    <>
      <Text style={{ marginVertical: 20, fontWeight: 'bold', color: colors.text }}>Artists:</Text>
      <FlatList
        data={searchedArtists}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => renderArtistItem({ item })}
        ItemSeparatorComponent={ItemDivider}
        ListFooterComponent={ItemDivider}
        scrollEnabled={false}
      />
    </>
  )}
  
  {searchedSongs.length === 0 && searchedAlbums.length === 0 && searchedArtists.length === 0 && (
    <NoResultsFound />
  )}

      </View>
    </ScrollView>

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