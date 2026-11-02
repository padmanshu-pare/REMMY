import * as Linking from 'expo-linking';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categories } from '@/constants/reels';
import { FontFamily } from '@/constants/theme';
import {
  deleteSavedReel,
  getSavedReels,
  type SavedReel,
  updateSavedReel,
} from '@/lib/reel-storage';

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
  const [item, setItem] = useState<SavedReel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [noteDraft, setNoteDraft] = useState('');
  const [instagramUrlDraft, setInstagramUrlDraft] = useState('');
  const [categoryDraft, setCategoryDraft] = useState('');
  const [keywordsDraft, setKeywordsDraft] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadReel = async () => {
      try {
        const reels = await getSavedReels();
        const savedReel = reels.find((reel) => reel.id === id) ?? null;
        if (isActive) {
          setItem(savedReel);
          setNoteDraft(savedReel?.note ?? '');
          setInstagramUrlDraft(savedReel?.instagramUrl ?? '');
          setCategoryDraft(savedReel?.category ?? '');
          setKeywordsDraft(
            savedReel?.keywords
              .split(/[,\s]+/)
              .filter(Boolean)
              .join(', ') ?? ''
          );
        }
      } catch (error) {
        console.error('Unable to load saved Reel details', error);
        if (isActive) {
          setErrorMessage('Could not load this Reel. Please try again.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadReel();
    return () => {
      isActive = false;
    };
  }, [id]);

  const backToSearch = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/search');
    }
  };

  const saveChanges = async (
    updates: Partial<SavedReel>,
    successMessage: string
  ): Promise<boolean> => {
    if (!item) {
      return false;
    }

    setIsSaving(true);
    setErrorMessage('');
    setStatusMessage('');
    try {
      const updatedReel = await updateSavedReel(item.id, updates);
      setItem(updatedReel);
      if ('note' in updates) {
        setNoteDraft(updatedReel.note ?? '');
      }
      if ('instagramUrl' in updates) {
        setInstagramUrlDraft(updatedReel.instagramUrl ?? '');
      }
      if ('category' in updates) {
        setCategoryDraft(updatedReel.category);
      }
      if ('keywords' in updates) {
        setKeywordsDraft(updatedReel.keywords);
      }
      setStatusMessage(successMessage);
      return true;
    } catch (error) {
      console.error('Unable to update saved Reel', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not save your changes. Please try again.'
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const isInstagramUrlValid =
    /^https:\/\/(?:www\.)?instagram\.com\/(?:reel|reels|p)\/[\w-]+\/?(?:\?.*)?$/i.test(
      instagramUrlDraft.trim()
    );

  const openInstagramReel = async () => {
    if (!isInstagramUrlValid) {
      setErrorMessage('Add a valid Instagram Reel URL in Edit details first.');
      return;
    }

    try {
      await Linking.openURL(instagramUrlDraft.trim());
      setErrorMessage('');
    } catch (error) {
      console.error('Unable to open Instagram Reel', error);
      setErrorMessage('Instagram could not open this link. Check the URL and try again.');
    }
  };

  const removeReel = async () => {
    if (!item) {
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    try {
      await deleteSavedReel(item.id);
      backToSearch();
    } catch (error) {
      console.error('Unable to delete saved Reel', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not remove this Reel. Please try again.'
      );
      setIsSaving(false);
      setIsConfirmingDelete(false);
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

            {isLoading ? (
              <View style={styles.loadingState}>
                <Text style={styles.description}>Loading Reel details...</Text>
              </View>
            ) : item ? (
              <>
                <View style={[styles.hero, { backgroundColor: item.tint }]}>
                  <View style={styles.heroGlow} />
                  <Text style={styles.heroEmoji}>{item.icon}</Text>
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

                <View style={styles.actionRow}>
                  <Pressable
                    accessibilityRole="button"
                    disabled={isSaving}
                    onPress={() =>
                      void saveChanges(
                        { isBookmarked: !item.isBookmarked },
                        item.isBookmarked ? 'Bookmark removed.' : 'Reel bookmarked.'
                      )
                    }
                    style={({ pressed }) => [
                      styles.actionButton,
                      item.isBookmarked && styles.actionButtonActive,
                      pressed && styles.pressed,
                    ]}>
                    <Icon
                      name={
                        item.isBookmarked
                          ? { ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' }
                          : { ios: 'bookmark', android: 'bookmark_border', web: 'bookmark_border' }
                      }
                      size={17}
                      color={item.isBookmarked ? colors.cream : colors.muted}
                    />
                    <Text
                      style={[
                        styles.actionButtonText,
                        item.isBookmarked && styles.actionButtonTextActive,
                      ]}>
                      {item.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !isInstagramUrlValid || isSaving }}
                    disabled={!isInstagramUrlValid || isSaving}
                    onPress={() => void openInstagramReel()}
                    style={[
                      styles.actionButton,
                      isInstagramUrlValid && styles.actionButtonActive,
                    ]}>
                    <Icon
                      name={{ ios: 'arrow.up.right', android: 'open_in_new', web: 'open_in_new' }}
                      size={17}
                      color={isInstagramUrlValid ? colors.cream : colors.muted}
                    />
                    <Text
                      style={[
                        styles.actionButtonText,
                        isInstagramUrlValid && styles.actionButtonTextActive,
                      ]}>
                      Open Instagram
                    </Text>
                  </Pressable>
                </View>
                {!isInstagramUrlValid ? (
                  <Text style={styles.urlHint}>
                    Add a valid Instagram link in Edit details to open the original Reel.
                  </Text>
                ) : null}

                <View style={styles.divider} />

                {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
                {statusMessage ? <Text style={styles.statusMessage}>{statusMessage}</Text> : null}

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
                  {item.keywords
                    .split(',')
                    .map((keyword) => keyword.trim())
                    .filter(Boolean)
                    .map((keyword) => (
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

                <View style={styles.sectionHeadingRow}>
                  <Text style={styles.sectionTitle}>Your notes</Text>
                  <Text style={styles.optionalLabel}>ON THIS DEVICE</Text>
                </View>
                <TextInput
                  accessibilityLabel="Personal Reel notes"
                  value={noteDraft}
                  onChangeText={setNoteDraft}
                  placeholder="Add a reminder or your own takeaways..."
                  placeholderTextColor={colors.muted}
                  multiline
                  textAlignVertical="top"
                  style={styles.notesInput}
                />
                <Pressable
                  accessibilityRole="button"
                  disabled={isSaving}
                  onPress={() => void saveChanges({ note: noteDraft.trim() }, 'Note saved.')}
                  style={({ pressed }) => [
                    styles.smallActionButton,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={styles.smallActionButtonText}>
                    {isSaving ? 'Saving...' : 'Save note'}
                  </Text>
                </Pressable>

                <View style={styles.manageSection}>
                  <Text style={styles.sectionTitle}>Manage Reel</Text>
                  {!isEditing ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        setCategoryDraft(item.category);
                        setKeywordsDraft(
                          item.keywords
                            .split(/[,\s]+/)
                            .filter(Boolean)
                            .join(', ')
                        );
                        setInstagramUrlDraft(item.instagramUrl ?? '');
                        setIsEditing(true);
                        setStatusMessage('');
                      }}
                      style={({ pressed }) => [
                        styles.manageButton,
                        pressed && styles.pressed,
                      ]}>
                      <Icon
                        name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                        size={17}
                        color={colors.cream}
                      />
                      <Text style={styles.manageButtonText}>Edit category, tags & link</Text>
                      <Icon
                        name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                        size={17}
                        color={colors.muted}
                      />
                    </Pressable>
                  ) : (
                    <View style={styles.editPanel}>
                      <Text style={styles.inputLabel}>Category</Text>
                      <View style={styles.editCategoryRow}>
                        {categories.map((category) => {
                          const isSelected = categoryDraft === category.label;
                          return (
                            <Pressable
                              key={category.label}
                              accessibilityRole="button"
                              accessibilityState={{ selected: isSelected }}
                              onPress={() => setCategoryDraft(category.label)}
                              style={[
                                styles.editCategoryChip,
                                isSelected && styles.editCategoryChipSelected,
                              ]}>
                              <Icon
                                name={category.icon}
                                size={15}
                                color={isSelected ? colors.cream : colors.accent}
                              />
                              <Text
                                style={[
                                  styles.editCategoryText,
                                  isSelected && styles.editCategoryTextSelected,
                                ]}>
                                {category.label}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>

                      <Text style={styles.inputLabel}>Tags (comma separated)</Text>
                      <TextInput
                        accessibilityLabel="Edit Reel tags"
                        value={keywordsDraft}
                        onChangeText={setKeywordsDraft}
                        placeholder="tutorial, ideas, inspiration"
                        placeholderTextColor={colors.muted}
                        autoCapitalize="none"
                        style={styles.editInput}
                      />

                      <Text style={styles.inputLabel}>Instagram Reel URL</Text>
                      <TextInput
                        accessibilityLabel="Instagram Reel URL"
                        value={instagramUrlDraft}
                        onChangeText={setInstagramUrlDraft}
                        placeholder="https://www.instagram.com/reel/..."
                        placeholderTextColor={colors.muted}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="url"
                        style={styles.editInput}
                      />

                      <View style={styles.editActions}>
                        <Pressable
                          accessibilityRole="button"
                          disabled={isSaving}
                          onPress={() => {
                            setIsEditing(false);
                            setCategoryDraft(item.category);
                            setKeywordsDraft(
                              item.keywords
                                .split(/[,\s]+/)
                                .filter(Boolean)
                                .join(', ')
                            );
                            setInstagramUrlDraft(item.instagramUrl ?? '');
                          }}
                          style={styles.cancelEditButton}>
                          <Text style={styles.cancelEditText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                          accessibilityRole="button"
                          disabled={isSaving}
                          onPress={() => {
                            const selectedCategory = categories.find(
                              (category) => category.label === categoryDraft
                            );
                            const url = instagramUrlDraft.trim();
                            if (url && !/^https:\/\/(?:www\.)?instagram\.com\/(?:reel|reels|p)\/[\w-]+\/?(?:\?.*)?$/i.test(url)) {
                              setErrorMessage('Enter a valid Instagram Reel URL or leave it blank.');
                              return;
                            }
                            void saveChanges(
                              {
                                category: categoryDraft,
                                categoryIcon: selectedCategory?.icon ?? item.categoryIcon,
                                keywords: keywordsDraft
                                  .split(',')
                                  .map((keyword) => keyword.trim())
                                  .filter(Boolean)
                                  .join(', '),
                                instagramUrl: url,
                              },
                              'Reel details updated.'
                            ).then((didSave) => {
                              if (didSave) {
                                setIsEditing(false);
                              }
                            });
                          }}
                          style={({ pressed }) => [
                            styles.smallActionButton,
                            pressed && styles.pressed,
                          ]}>
                          <Text style={styles.smallActionButtonText}>
                            {isSaving ? 'Saving...' : 'Save changes'}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  )}

                  {!isConfirmingDelete ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => setIsConfirmingDelete(true)}
                      style={({ pressed }) => [
                        styles.deleteButton,
                        pressed && styles.pressed,
                      ]}>
                      <Icon
                        name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                        size={17}
                        color="#FF8A9B"
                      />
                      <Text style={styles.deleteButtonText}>Remove from saved Reels</Text>
                    </Pressable>
                  ) : (
                    <View style={styles.deleteConfirmation}>
                      <Text style={styles.deleteConfirmationTitle}>Remove this Reel?</Text>
                      <Text style={styles.deleteConfirmationCopy}>
                        This will remove it from your saved library.
                      </Text>
                      <View style={styles.editActions}>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => setIsConfirmingDelete(false)}
                          style={styles.cancelEditButton}>
                          <Text style={styles.cancelEditText}>Keep Reel</Text>
                        </Pressable>
                        <Pressable
                          accessibilityRole="button"
                          disabled={isSaving}
                          onPress={() => void removeReel()}
                          style={({ pressed }) => [
                            styles.confirmDeleteButton,
                            pressed && styles.pressed,
                          ]}>
                          <Text style={styles.confirmDeleteText}>
                            {isSaving ? 'Removing...' : 'Remove'}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
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
                  {errorMessage ||
                    'This saved Reel may have been removed or is no longer available.'}
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
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  urlHint: {
    fontFamily: FontFamily.body,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 9,
  },
  actionButton: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  actionButtonActive: {
    borderColor: '#713044',
    backgroundColor: colors.accentDark,
  },
  actionButtonText: {
    fontFamily: FontFamily.medium,
    color: colors.muted,
    fontSize: 11,
  },
  actionButtonTextActive: {
    color: colors.cream,
  },
  errorMessage: {
    fontFamily: FontFamily.medium,
    color: '#FF8A9B',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  statusMessage: {
    fontFamily: FontFamily.medium,
    color: '#8DD8A6',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
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
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 26,
  },
  optionalLabel: {
    fontFamily: FontFamily.medium,
    color: colors.muted,
    fontSize: 9,
    letterSpacing: 1.1,
    marginBottom: 10,
  },
  notesInput: {
    minHeight: 108,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.cream,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 20,
  },
  smallActionButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.accentDark,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  smallActionButtonText: {
    fontFamily: FontFamily.medium,
    color: colors.cream,
    fontSize: 12,
  },
  manageSection: {
    marginTop: 28,
    paddingTop: 22,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  manageButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 14,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  manageButtonText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    color: colors.cream,
    fontSize: 12,
  },
  editPanel: {
    gap: 10,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: 12,
  },
  inputLabel: {
    fontFamily: FontFamily.medium,
    color: colors.cream,
    fontSize: 12,
    marginTop: 3,
  },
  editCategoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 4,
  },
  editCategoryChip: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
  },
  editCategoryChipSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentDark,
  },
  editCategoryText: {
    fontFamily: FontFamily.medium,
    color: colors.muted,
    fontSize: 10,
  },
  editCategoryTextSelected: {
    color: colors.cream,
  },
  editInput: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    color: colors.cream,
    fontFamily: FontFamily.body,
    fontSize: 12,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  cancelEditButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelEditText: {
    fontFamily: FontFamily.medium,
    color: colors.muted,
    fontSize: 12,
  },
  deleteButton: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    marginTop: 9,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#54252F',
    backgroundColor: '#211518',
  },
  deleteButtonText: {
    fontFamily: FontFamily.medium,
    color: '#FF8A9B',
    fontSize: 12,
  },
  deleteConfirmation: {
    padding: 15,
    marginTop: 10,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#713044',
    backgroundColor: '#211518',
  },
  deleteConfirmationTitle: {
    fontFamily: FontFamily.heading,
    color: colors.cream,
    fontSize: 14,
  },
  deleteConfirmationCopy: {
    fontFamily: FontFamily.body,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  confirmDeleteButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#8E1B3B',
  },
  confirmDeleteText: {
    fontFamily: FontFamily.medium,
    color: colors.cream,
    fontSize: 12,
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
  loadingState: {
    alignItems: 'center',
    paddingTop: 80,
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
