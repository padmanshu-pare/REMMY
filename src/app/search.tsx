import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
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

function Icon({ name, size = 20, color = colors.text }: IconProps) {
  return <SymbolView name={name} size={size} tintColor={color} />;
}

const popularSearches = ['pasta', 'React tips', 'cafes'];
const searchEntrance = FadeInDown.duration(220);

export default function SearchScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(typeof q === 'string' ? q : '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return savedItems.filter((item) => {
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const searchableText = `${item.title} ${item.category} ${item.description} ${item.keywords}`;
      const matchesQuery =
        !normalizedQuery || searchableText.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  const showResults = query.trim().length > 0 || selectedCategory !== null;

  return (
    <>
      <Stack.Screen options={{ animation: 'fade_from_bottom', animationDuration: 250 }} />
      <Animated.View
        entering={searchEntrance}
        style={styles.animatedScreen}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.page}>
              <View style={styles.topBar}>
                <Link href="/" asChild>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Back to Home"
                    style={({ pressed }) => [
                      styles.backButton,
                      pressed && styles.backButtonPressed,
                    ]}>
                    <Icon
                      name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
                      size={19}
                      color={colors.cream}
                    />
                  </Pressable>
                </Link>
                <Text style={styles.eyebrow}>YOUR REEL LIBRARY</Text>
              </View>
              <Text style={styles.title}>Find that Reel</Text>
              <Text style={styles.subtitle}>
                Search by topic, place, or anything you remember.
              </Text>

              <View style={styles.searchBar}>
                <Icon
                  name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
                  size={22}
                  color={colors.cream}
                />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Try “pasta” or “React tips”"
                  placeholderTextColor={colors.muted}
                  returnKeyType="search"
                  autoCapitalize="none"
                  style={styles.searchInput}
                  accessibilityLabel="Search saved Reels"
                />
                {query.length > 0 && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Clear search"
                    hitSlop={10}
                    onPress={() => setQuery('')}>
                    <Icon
                      name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
                      size={20}
                      color={colors.muted}
                    />
                  </Pressable>
                )}
              </View>

              <View style={styles.categorySection}>
                <Text style={styles.sectionTitle}>Browse categories</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryRow}>
                  {categories.map((category) => {
                    const isSelected = selectedCategory === category.label;

                    return (
                      <Pressable
                        key={category.label}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                        onPress={() => setSelectedCategory(isSelected ? null : category.label)}
                        style={[
                          styles.categoryChip,
                          isSelected && styles.categoryChipSelected,
                        ]}>
                        <Icon
                          name={category.icon}
                          size={18}
                          color={isSelected ? colors.cream : colors.accent}
                        />
                        <Text
                          style={[
                            styles.categoryText,
                            isSelected && styles.categoryTextSelected,
                          ]}>
                          {category.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {showResults ? (
                <View style={styles.resultsSection}>
                  <View style={styles.resultsHeader}>
                    <Text style={styles.sectionTitle}>
                      {query.trim() ? 'Search results' : selectedCategory}
                    </Text>
                    <Text style={styles.resultCount}>
                      {filteredItems.length} {filteredItems.length === 1 ? 'Reel' : 'Reels'}
                    </Text>
                  </View>

                  {filteredItems.length > 0 ? (
                    <View style={styles.resultsList}>
                      {filteredItems.map((item) => (
                        <Link
                          key={item.id}
                          href={{ pathname: '/reel/[id]', params: { id: item.id } }}
                          asChild>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`View ${item.title}`}
                            style={({ pressed }) => [
                              styles.resultCard,
                              pressed && styles.resultCardPressed,
                            ]}>
                            <View style={[styles.thumbnail, { backgroundColor: item.tint }]}>
                              <Text style={styles.thumbnailEmoji}>{item.icon}</Text>
                              <View style={styles.playButton}>
                                <Icon
                                  name={{
                                    ios: 'play.fill',
                                    android: 'play_arrow',
                                    web: 'play_arrow',
                                  }}
                                  size={13}
                                  color={colors.cream}
                                />
                              </View>
                            </View>

                            <View style={styles.resultCopy}>
                              <Text numberOfLines={1} style={styles.resultTitle}>
                                {item.title}
                              </Text>
                              <Text numberOfLines={2} style={styles.resultDescription}>
                                {item.description}
                              </Text>
                              <View style={styles.resultMeta}>
                                <View style={styles.categoryBadge}>
                                  <Icon
                                    name={item.categoryIcon}
                                    size={13}
                                    color={colors.accent}
                                  />
                                  <Text style={styles.categoryBadgeText}>{item.category}</Text>
                                </View>
                                <Text style={styles.savedDate}>{item.savedDate}</Text>
                              </View>
                            </View>

                            <Icon
                              name={{
                                ios: 'bookmark.fill',
                                android: 'bookmark',
                                web: 'bookmark',
                              }}
                              size={17}
                              color={colors.cream}
                            />
                          </Pressable>
                        </Link>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.emptyState}>
                      <View style={styles.emptyIcon}>
                        <Icon
                          name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
                          size={26}
                          color={colors.accent}
                        />
                      </View>
                      <Text style={styles.emptyTitle}>No Reels found</Text>
                      <Text style={styles.emptyCopy}>
                        Try another word or choose a different category.
                      </Text>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => {
                          setQuery('');
                          setSelectedCategory(null);
                        }}
                        style={styles.resetButton}>
                        <Text style={styles.resetButtonText}>Clear filters</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.suggestionsSection}>
                  <View style={styles.suggestionsHeading}>
                    <Text style={styles.sectionTitle}>Popular searches</Text>
                    <Icon
                      name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
                      size={18}
                      color={colors.accent}
                    />
                  </View>
                  <View style={styles.suggestionList}>
                    {popularSearches.map((search) => (
                      <Pressable
                        key={search}
                        accessibilityRole="button"
                        onPress={() => setQuery(search)}
                        style={styles.suggestion}>
                        <Icon
                          name={{
                            ios: 'arrow.up.left',
                            android: 'north_west',
                            web: 'north_west',
                          }}
                          size={17}
                          color={colors.muted}
                        />
                        <Text style={styles.suggestionText}>{search}</Text>
                        <Icon
                          name={{
                            ios: 'arrow.up.left',
                            android: 'north_west',
                            web: 'north_west',
                          }}
                          size={15}
                          color={colors.muted}
                        />
                      </Pressable>
                    ))}
                  </View>
                  <Text style={styles.hint}>
                    Your saved Reels will show up here as soon as you search.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          <MainBottomNav active="search" />
        </SafeAreaView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  animatedScreen: {
    flex: 1,
  },
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
    paddingTop: 18,
    paddingBottom: 120,
  },
  page: {
    width: '100%',
    maxWidth: 680,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButtonPressed: {
    opacity: 0.75,
  },
  eyebrow: {
    fontFamily: FontFamily.medium,
    color: colors.accent,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  title: {
    fontFamily: FontFamily.heading,
    color: colors.text,
    fontSize: 30,
    letterSpacing: -0.7,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
    marginBottom: 23,
  },
  searchBar: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#8E1B3B',
    backgroundColor: colors.surface,
    shadowColor: colors.accent,
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    color: colors.text,
    fontFamily: FontFamily.body,
    fontSize: 14,
  },
  categorySection: {
    marginTop: 30,
  },
  sectionTitle: {
    fontFamily: FontFamily.heading,
    color: colors.text,
    fontSize: 18,
  },
  categoryRow: {
    gap: 9,
    paddingTop: 14,
  },
  categoryChip: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 13,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  categoryChipSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentDark,
  },
  categoryText: {
    fontFamily: FontFamily.medium,
    color: colors.text,
    fontSize: 12,
  },
  categoryTextSelected: {
    color: colors.cream,
  },
  suggestionsSection: {
    marginTop: 34,
  },
  suggestionsHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 9,
  },
  suggestionList: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  suggestion: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    color: colors.cream,
    fontSize: 14,
  },
  hint: {
    fontFamily: FontFamily.body,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 18,
  },
  resultsSection: {
    marginTop: 30,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  resultCount: {
    fontFamily: FontFamily.medium,
    color: colors.muted,
    fontSize: 12,
  },
  resultsList: {
    gap: 12,
  },
  resultCard: {
    minHeight: 104,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  resultCardPressed: {
    opacity: 0.78,
  },
  thumbnail: {
    width: 76,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 14,
  },
  thumbnailEmoji: {
    fontSize: 43,
  },
  playButton: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#100D0EAA',
  },
  resultCopy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  resultTitle: {
    fontFamily: FontFamily.heading,
    color: colors.text,
    fontSize: 14,
  },
  resultDescription: {
    fontFamily: FontFamily.body,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 15,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.surfaceRaised,
  },
  categoryBadgeText: {
    fontFamily: FontFamily.medium,
    color: colors.cream,
    fontSize: 9,
  },
  savedDate: {
    fontFamily: FontFamily.body,
    color: colors.muted,
    fontSize: 9,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 38,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: colors.surfaceRaised,
    marginBottom: 15,
  },
  emptyTitle: {
    fontFamily: FontFamily.heading,
    color: colors.text,
    fontSize: 17,
  },
  emptyCopy: {
    fontFamily: FontFamily.body,
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
  },
  resetButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.accentDark,
  },
  resetButtonText: {
    fontFamily: FontFamily.medium,
    color: colors.cream,
    fontSize: 12,
  },
});
