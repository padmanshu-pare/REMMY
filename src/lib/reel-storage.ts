import AsyncStorage from '@react-native-async-storage/async-storage';

import { savedItems } from '@/constants/reels';

const SAVED_REELS_KEY = 'remmy_saved_reels_v1';

export type SavedReel = (typeof savedItems)[number] & {
  isBookmarked?: boolean;
  note?: string;
  instagramUrl?: string;
};

function isSavedReel(value: unknown): value is SavedReel {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'title' in value &&
    typeof value.title === 'string' &&
    'category' in value &&
    typeof value.category === 'string' &&
    'icon' in value &&
    typeof value.icon === 'string' &&
    'tint' in value &&
    typeof value.tint === 'string' &&
    'description' in value &&
    typeof value.description === 'string' &&
    'keywords' in value &&
    typeof value.keywords === 'string' &&
    'savedDate' in value &&
    typeof value.savedDate === 'string' &&
    'categoryIcon' in value &&
    typeof value.categoryIcon === 'object' &&
    value.categoryIcon !== null &&
    (!('isBookmarked' in value) || typeof value.isBookmarked === 'boolean') &&
    (!('note' in value) || typeof value.note === 'string') &&
    (!('instagramUrl' in value) || typeof value.instagramUrl === 'string')
  );
}

export async function getSavedReels(): Promise<SavedReel[]> {
  const storedValue = await AsyncStorage.getItem(SAVED_REELS_KEY);
  if (storedValue === null) {
    const initialItems: SavedReel[] = savedItems.map((item) => ({ ...item }));
    await AsyncStorage.setItem(SAVED_REELS_KEY, JSON.stringify(initialItems));
    return initialItems;
  }

  let parsedValue: unknown;
  try {
    parsedValue = JSON.parse(storedValue);
  } catch {
    throw new Error('Saved Reel data is invalid. Clear app storage to reset your sample library.');
  }

  if (!Array.isArray(parsedValue) || !parsedValue.every(isSavedReel)) {
    throw new Error('Saved Reel data has an unexpected format. Clear app storage to reset it.');
  }

  const migratedItems = parsedValue.map((item) =>
    item.keywords.includes(',')
      ? item
      : { ...item, keywords: item.keywords.split(/\s+/).filter(Boolean).join(', ') }
  );
  if (migratedItems.some((item, index) => item !== parsedValue[index])) {
    await AsyncStorage.setItem(SAVED_REELS_KEY, JSON.stringify(migratedItems));
  }

  return migratedItems;
}

export async function updateSavedReel(
  id: string,
  updates: Partial<Pick<SavedReel, 'category' | 'categoryIcon' | 'keywords' | 'note' | 'instagramUrl' | 'isBookmarked'>>
): Promise<SavedReel> {
  const items = await getSavedReels();
  const itemToUpdate = items.find((item) => item.id === id);
  if (!itemToUpdate) {
    throw new Error('This Reel is no longer in your saved library.');
  }

  const updatedItem = { ...itemToUpdate, ...updates };
  await AsyncStorage.setItem(
    SAVED_REELS_KEY,
    JSON.stringify(items.map((item) => (item.id === id ? updatedItem : item)))
  );

  return updatedItem;
}

export async function deleteSavedReel(id: string): Promise<void> {
  const items = await getSavedReels();
  const updatedItems = items.filter((item) => item.id !== id);
  if (updatedItems.length === items.length) {
    throw new Error('This Reel is no longer in your saved library.');
  }

  await AsyncStorage.setItem(SAVED_REELS_KEY, JSON.stringify(updatedItems));
}
