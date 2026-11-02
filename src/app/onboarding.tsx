import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { FontFamily, Spacing } from '@/constants/theme';
import { setOnboardingComplete } from '@/lib/storage';

const slides = [
  {
    id: '1',
    title: 'Save it. Then forget where you saved it?',
    description:
      "Your saved Reels pile up. The useful ones get lost. Finding them again shouldn't be a struggle.",
  },
  {
    id: '2',
    title: 'REMMY remembers what matters.',
    description:
      'Save a Reel. REMMY organises the useful information it can access, so your collection becomes more than a list of links.',
  },
  {
    id: '3',
    title: 'Find it by describing what you remember.',
    description:
      'Search naturally. Find the tutorial, recipe, or idea you\'re looking for without scrolling through everything.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList<(typeof slides)[number]>>(null);
  const [index, setIndex] = useState(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
    setIndex(nextIndex);
  };

  const completeOnboarding = async () => {
    await setOnboardingComplete(true);
    router.replace('/login');
  };

  const goToNext = () => {
    const nextIndex = Math.min(index + 1, slides.length - 1);
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    setIndex(nextIndex);
  };

  const isLast = index === slides.length - 1;

  return (
    <View style={styles.screen}>
      <View style={styles.progressRow}>
        {slides.map((item, itemIndex) => (
          <Animated.View
            key={item.id}
            style={[
              styles.progressDot,
              itemIndex === index && { backgroundColor: '#FEF5E4' },
              itemIndex !== index && { backgroundColor: '#2E2E3A' },
            ]}
          />
        ))}
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(slide) => slide.id}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <Image
              source={require('@/assets/images/remmy-logo.png')}
              contentFit="contain"
              style={styles.logo}
              accessibilityLabel="REMMY logo"
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.actions}>
        <Pressable style={styles.secondaryButton} onPress={() => completeOnboarding()}>
          <Text style={styles.secondaryText}>Skip</Text>
        </Pressable>

        {isLast ? (
          <Pressable style={styles.primaryButton} onPress={() => completeOnboarding()}>
            <Text style={styles.primaryText}>Get Started</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.primaryButton} onPress={goToNext}>
            <Text style={styles.primaryText}>Continue</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.stepText}>{index + 1} OF {slides.length}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#151515',
    paddingHorizontal: Spacing.four,
    paddingTop: 56,
    paddingBottom: 32,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 28,
  },
  progressDot: {
    width: 38,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#2E2E3A',
  },
  page: {
    width: 330,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  logo: {
    width: 190,
    height: 190,
    marginBottom: 20,
  },
  title: {
    fontFamily: FontFamily.heading,
    fontSize: 26,
    lineHeight: 34,
    textAlign: 'center',
    color: '#F7F7FF',
    marginBottom: 16,
  },
  description: {
    fontFamily: FontFamily.body,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#4B607F',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#93032E',
    minHeight: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryText: {
    fontFamily: FontFamily.medium,
    color: '#F7F7FF',
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2E2E3A',
    minHeight: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryText: {
    fontFamily: FontFamily.medium,
    color: '#F7F7FF',
    fontSize: 16,
  },
  footerRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  stepText: {
    fontFamily: FontFamily.medium,
    color: '#4B607F',
    fontSize: 12,
    letterSpacing: 1.2,
  },
});
