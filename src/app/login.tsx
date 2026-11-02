import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontFamily, Spacing } from '@/constants/theme';

export default function LoginScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Image
          source={require('@/assets/images/remmy-logo.png')}
          contentFit="contain"
          style={styles.logo}
          accessibilityLabel="REMMY logo"
        />
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue saving and searching your memories.</Text>

        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryText}>Log in</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Sign up</Text>
        </Pressable>

        <Link href="/" asChild>
          <Pressable style={styles.linkButton}>
            <Text style={styles.linkText}>Continue to home</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#151515',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  card: {
    backgroundColor: '#2E2E3A',
    borderRadius: 24,
    padding: 24,
  },
  logo: {
    width: 144,
    height: 144,
    alignSelf: 'center',
    marginBottom: 18,
  },
  title: {
    fontFamily: FontFamily.heading,
    color: '#F7F7FF',
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    color: '#4B607F',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#93032E',
    borderRadius: 16,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: {
    fontFamily: FontFamily.medium,
    color: '#F7F7FF',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#4B607F',
    backgroundColor: 'transparent',
    borderRadius: 16,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryText: {
    fontFamily: FontFamily.medium,
    color: '#F7F7FF',
    fontSize: 16,
  },
  linkButton: {
    alignItems: 'center',
    paddingTop: 8,
  },
  linkText: {
    fontFamily: FontFamily.medium,
    color: '#FEF5E4',
  },
});
