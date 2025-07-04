import { StyleSheet } from "react-native";
import COLORS from "@/constants/colors";
import { colors, fontSize } from '@/constants/tokens';

export const favoriteStyles = StyleSheet.create({
  trackItemContainer: {
    flexDirection: 'row',
    columnGap: 14,
    alignItems: 'center',
    paddingRight: 20,
  },
  trackPlayingIconIndicator: {
    position: 'absolute',
    top: 18,
    left: 16,
    width: 16,
    height: 16,
  },
  trackPausedIndicator: {
    position: 'absolute',
    top: 14,
    left: 14,
  },
  trackArtworkImage: {
    borderRadius: 8,
    width: 50,
    height: 50,
  },
  trackTitleText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    maxWidth: '90%',
  },
  trackArtistText: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  itemSeparator: {
    borderColor: colors.textMuted,
    borderWidth: StyleSheet.hairlineWidth,
    opacity: 0.3,
  },
  emptyContentText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
  },
  pageHeader: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 25
  },
  ArtistImage: {
    width: 50,
    height: 50,
    borderRadius: 65,
    objectFit: "cover",
  },
});
