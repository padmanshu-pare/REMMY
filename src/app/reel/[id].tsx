import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { savedItems } from '@/constants/reels';
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

export default function ReelDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = savedItems.find((savedItem) => savedItem.id === id);
  const backToSearch = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/search');
    }
  };

  return (
    <>
      <Stack.Screen options={{ animation: 'fade_from_bottom', animationDuration: 250 }} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.page}>
            <View style={styles.topBar}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to search results"
                onPress={backToSearch}
                style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
                <Icon
                  name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
                  size={19}
                  color={colors.cream}
                />
              </Pressable>
              <Text style={styles.eyebrow}>SAVED REEL</Text>
              <View style={styles.topBarSpacer} />
            </View>

            {item ? (
              <>
                <View style={[styles.hero, { backgroundColor: item.tint }]}>
                  <View style={styles.heroGlow} />
                  <Text style={styles.heroEmoji}>{item.icon}</Text>
                  <View style={styles.heroBookmark}>
                    <Icon
                      name={{ ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' }}
                      size={19}
                      color={colors.cream}
                    />
                  </View>
                  <View style={styles.heroPlay}>
                    <Icon
                      name={{ ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }}
                      size={26}
                      color={colors.cream}
                    />
                  </View>
                </View>

                <View style={styles.metadataRow}>
                  <View style={styles.categoryBadge}>
                    <Icon name={item.categoryIcon} size={15} color={colors.accent} />
                    <Text style={styles.categoryText}>{item.category}</Text>
                  </View>
                  <Text style={styles.savedDate}>{item.savedDate}</Text>
                </View>

                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>About this Reel</Text>
                <Text style={styles.aboutCopy}>
                  You saved this Reel to make it easy to find again. Here are the details REMMY
                  has stored for it.
                </Text>

                <View style={styles.detailsCard}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      <Icon
                        name={{ ios: 'square.stack.3d.up', android: 'category', web: 'category' }}
                        size={17}
                        color={colors.accent}
                      />
                    </View>
                    <View style={styles.detailCopy}>
                      <Text style={styles.detailLabel}>Category</Text>
                      <Text style={styles.detailValue}>{item.category}</Text>
                    </View>
                  </View>
                  <View style={styles.detailDivider} />
                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      <Icon
                        name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
                        size={17}
                        color={colors.accent}
                      />
                    </View>
                    <View style={styles.detailCopy}>
                      <Text style={styles.detailLabel}>Saved</Text>
                      <Text style={styles.detailValue}>{item.savedDate.replace('Saved ', '')}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.sectionTitle}>Search keywords</Text>
                <View style={styles.keywordRow}>
                  {item.keywords.split(' ').map((keyword) => (
                    <Link
                      key={keyword}
                      href={{ pathname: '/search', params: { q: keyword } }}
                      asChild>
                      <Pressable
                        accessibilityRole="button"
                        style={({ pressed }) => [
                          styles.keywordChip,
                          pressed && styles.pressed,
                        ]}>
                        <Text style={styles.keywordText}>{keyword}</Text>
                      </Pressable>
                    </Link>
                  ))}
                </View>

                <Pressable
                  accessibilityRole="button"
                  onPress={backToSearch}
                  style={({ pressed }) => [styles.returnButton, pressed && styles.pressed]}>
                  <Icon
                    name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
                    size={18}
                    color={colors.cream}
                  />
                  <Text style={styles.returnButtonText}>Back to search results</Text>
                </Pressable>
              </>
            ) : (
              <View style={styles.notFound}>
                <View style={styles.notFoundIcon}>
                  <Icon
                    name={{ ios: 'bookmark.slash', android: 'bookmark', web: 'bookmark' }}
                    size={25}
                    color={colors.accent}
                  />
                </View>
                <Text style={styles.title}>Reel not found</Text>
                <Text style={styles.description}>
                  This saved Reel may have been removed or is no longer available.
                </Text>
                <Link href="/search" asChild>
                  <Pressable style={styles.returnButton}>
                    <Text style={styles.returnButtonText}>Go to search</Text>
                  </Pressable>
                </Link>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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
    paddingTop: 18,
    paddingBottom: 40,
  },
  page: {
    width: '100%',
    maxWidth: 680,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  topBarSpacer: {
    width: 40,
  },
  eyebrow: {
    fontFamily: FontFamily.medium,
    color: colors.accent,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  hero: {
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroGlow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#FFFFFF',
    opacity: 0.05,
  },
  heroEmoji: {
    fontSize: 112,
  },
  heroBookmark: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#100D0EAA',
  },
  heroPlay: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#100D0EAA',
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surfaceRaised,
  },
  categoryText: {
    fontFamily: FontFamily.medium,
    color: colors.cream,
    fontSize: 12,
  },
  savedDate: {
    fontFamily: FontFamily.body,
    color: colors.muted,
    fontSize: 12,
  },
  title: {
    fontFamily: FontFamily.heading,
    color: colors.text,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  description: {
    fontFamily: FontFamily.body,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 7,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 25,
  },
  sectionTitle: {
    fontFamily: FontFamily.heading,
    color: colors.text,
    fontSize: 17,
    marginBottom: 10,
  },
  aboutCopy: {
    fontFamily: FontFamily.body,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  detailsCard: {
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: 24,
  },
  detailRow: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.surfaceRaised,
  },
  detailCopy: {
    gap: 3,
  },
  detailLabel: {
    fontFamily: FontFamily.body,
    color: colors.muted,
    fontSize: 11,
  },
  detailValue: {
    fontFamily: FontFamily.medium,
    color: colors.cream,
    fontSize: 13,
  },
  detailDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  keywordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 3,
  },
  keywordChip: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  keywordText: {
    fontFamily: FontFamily.medium,
    color: colors.cream,
    fontSize: 11,
  },
  returnButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: colors.accentDark,
    borderWidth: 1,
    borderColor: colors.accent,
    marginTop: 28,
  },
  returnButtonText: {
    fontFamily: FontFamily.medium,
    color: colors.cream,
    fontSize: 13,
  },
  pressed: {
    opacity: 0.75,
  },
  notFound: {
    alignItems: 'center',
    paddingTop: 70,
  },
  notFoundIcon: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: colors.surfaceRaised,
    marginBottom: 18,
  },
});
