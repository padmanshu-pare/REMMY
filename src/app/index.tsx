import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MainBottomNav } from '@/components/main-bottom-nav';
import { categories, savedItems } from '@/constants/reels';
import { FontFamily } from '@/constants/theme';

const colors = {
  background: '#100D0E',
  surface: '#1A1517',
  surfaceRaised: '#21191C',
  border: '#34272B',
  text: '#FFF8F3',
  muted: '#A99DA0',
  accent: '#D62754',
  accentDark: '#64152B',
  cream: '#F6E9DA',
};

type IconProps = {
  name: SymbolViewProps['name'];
  size?: number;
  color?: string;
};

function Icon({ name, size = 22, color = colors.text }: IconProps) {
  return <SymbolView name={name} size={size} tintColor={color} />;
}

export default function HomeScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [savedCardWidth, setSavedCardWidth] = useState(104);

  const openSearch = () => {
    const searchQuery = query.trim();
    router.push(searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : '/search');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View style={styles.header}>
            <View style={styles.brand}>
              <Image
                source={require('@/assets/images/remmy-logo.png')}
                contentFit="contain"
                style={styles.brandLogo}
                accessibilityLabel="REMMY logo"
              />
            </View>

            <View style={styles.headerActions}>
              <View style={styles.headerIconButton}>
                <Icon
                  name={{ ios: 'bell', android: 'notifications', web: 'notifications' }}
                  size={21}
                />
                <View style={styles.notificationDot} />
              </View>
              <View style={styles.profileButton}>
                <Icon
                  name={{ ios: 'person.fill', android: 'person', web: 'person' }}
                  size={22}
                  color={colors.cream}
                />
              </View>
            </View>
          </View>

          <View style={styles.greetingSection}>
            <View style={styles.greetingCopy}>
              <Text style={styles.greeting}>Hey there! 👋</Text>
              <Text style={styles.subtitle}>What are you trying to remember today?</Text>
            </View>
            <Image
              source={require('@/assets/images/remmy-logo.png')}
              contentFit="contain"
              style={styles.greetingLogo}
              accessibilityLabel="REMMY logo"
            />
          </View>

          <View style={styles.searchBar}>
            <Icon
              name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
              size={24}
              color={colors.cream}
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search your saved Reels..."
              placeholderTextColor={colors.muted}
              returnKeyType="search"
              onSubmitEditing={openSearch}
              style={styles.searchInput}
              accessibilityLabel="Search your saved Reels"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open search"
              onPress={openSearch}
              hitSlop={8}>
              <Icon
                name={{ ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }}
                size={23}
                color={colors.cream}
              />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}>
            {categories.map((category) => (
              <Pressable
                key={category.label}
                onPress={() => setQuery(category.label)}
                style={({ pressed }) => [styles.categoryChip, pressed && styles.pressed]}>
                <Icon name={category.icon} size={20} color={colors.accent} />
                <Text style={styles.categoryText}>{category.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recently saved</Text>
              <Text style={styles.sectionSubtitle}>Your ideas, right where you left them</Text>
            </View>
            <View style={styles.seeAll}>
              <Text style={styles.seeAllText}>See all</Text>
              <Icon
                name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
                size={18}
                color={colors.accent}
              />
            </View>
          </View>

          <ScrollView
            horizontal
            onLayout={(event) => {
              const nextWidth = Math.floor((event.nativeEvent.layout.width - 24) / 3);
              setSavedCardWidth((currentWidth) =>
                currentWidth === nextWidth ? currentWidth : nextWidth
              );
            }}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.savedItemsRow}>
            {savedItems.map((item) => (
              <View key={item.title} style={[styles.savedCard, { width: savedCardWidth }]}>
                <View style={[styles.thumbnail, { backgroundColor: item.tint }]}>
                  <View style={styles.thumbnailGlow} />
                  <Text style={styles.thumbnailEmoji}>{item.icon}</Text>
                  <View style={styles.thumbnailPlay}>
                    <Icon
                      name={{ ios: 'play.rectangle', android: 'movie', web: 'movie' }}
                      size={17}
                      color={colors.cream}
                    />
                  </View>
                  <View style={styles.thumbnailSave}>
                    <Icon
                      name={{ ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' }}
                      size={17}
                      color={colors.cream}
                    />
                  </View>
                </View>
                <View style={styles.savedCardBody}>
                  <Text numberOfLines={2} style={styles.savedCardTitle}>
                    {item.title}
                  </Text>
                  <View style={styles.savedCategory}>
                    <Icon name={item.categoryIcon} size={15} color={colors.accent} />
                    <Text style={styles.savedCategoryText}>{item.category}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.addBanner}>
            <Image
              source={require('@/assets/images/remmy-logo.png')}
              contentFit="contain"
              style={styles.bannerLogo}
              accessibilityLabel="REMMY logo"
            />
            <View style={styles.bannerCopy}>
              <Text style={styles.bannerTitle}>Save a Reel</Text>
              <Text style={styles.bannerDescription}>
                Paste a link or share from Instagram to remember it later.
              </Text>
              <View style={styles.addButton}>
                <Icon name={{ ios: 'plus', android: 'add', web: 'add' }} size={21} />
                <Text style={styles.addButtonText}>Add Reel</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <MainBottomNav active="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 130,
  },
  page: {
    width: '100%',
    maxWidth: 680,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },
  brand: {
    flexShrink: 1,
  },
  brandLogo: {
    width: 78,
    height: 78,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    right: 9,
    top: 8,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#746A6D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingSection: {
    minHeight: 108,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  greetingCopy: {
    flex: 1,
    paddingRight: 4,
  },
  greeting: {
    fontFamily: FontFamily.heading,
    color: colors.text,
    fontSize: 27,
    lineHeight: 34,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 5,
    maxWidth: 330,
  },
  greetingLogo: {
    width: 92,
    height: 92,
    marginLeft: 8,
  },
  searchBar: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 15,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#8E1B3B',
    backgroundColor: colors.surface,
    marginBottom: 20,
    shadowColor: colors.accent,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  searchInput: {
    fontFamily: FontFamily.body,
    flex: 1,
    minWidth: 0,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 9,
  },
  categoryRow: {
    gap: 10,
    paddingBottom: 8,
    marginBottom: 22,
  },
  categoryChip: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 13,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  categoryText: {
    fontFamily: FontFamily.medium,
    color: colors.text,
    fontSize: 13,
  },
  pressed: {
    opacity: 0.75,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FontFamily.heading,
    color: colors.text,
    fontSize: 20,
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    fontFamily: FontFamily.body,
    color: colors.muted,
    fontSize: 12,
    marginTop: 3,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  seeAllText: {
    fontFamily: FontFamily.medium,
    color: colors.accent,
    fontSize: 14,
  },
  savedItemsRow: {
    gap: 12,
    paddingBottom: 4,
  },
  savedCard: {
    overflow: 'hidden',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  thumbnail: {
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbnailGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFFFFF',
    opacity: 0.035,
  },
  thumbnailEmoji: {
    fontSize: 60,
  },
  thumbnailPlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: '#100D0EAA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailSave: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: '#100D0EAA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedCardBody: {
    paddingHorizontal: 9,
    paddingTop: 8,
    paddingBottom: 9,
    gap: 8,
  },
  savedCardTitle: {
    fontFamily: FontFamily.heading,
    minHeight: 38,
    color: colors.text,
    fontSize: 13,
    lineHeight: 17,
    textTransform: 'capitalize',
  },
  savedCategory: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 18,
    backgroundColor: colors.surfaceRaised,
  },
  savedCategoryText: {
    fontFamily: FontFamily.medium,
    color: colors.cream,
    fontSize: 11,
  },
  addBanner: {
    minHeight: 140,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#55212F',
    borderRadius: 25,
    backgroundColor: '#28161C',
    marginTop: 38,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  bannerLogo: {
    width: '38%',
    minWidth: 84,
    height: 108,
  },
  bannerCopy: {
    flex: 1,
    paddingLeft: 8,
  },
  bannerTitle: {
    fontFamily: FontFamily.heading,
    color: colors.cream,
    fontSize: 20,
  },
  bannerDescription: {
    fontFamily: FontFamily.body,
    color: '#C6B9BB',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
    marginBottom: 9,
  },
  addButton: {
    minHeight: 42,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 15,
    borderRadius: 22,
    backgroundColor: colors.accentDark,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  addButtonText: {
    fontFamily: FontFamily.medium,
    color: colors.text,
    fontSize: 15,
  },
});
