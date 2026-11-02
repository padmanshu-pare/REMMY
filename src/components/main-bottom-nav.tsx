import { Link } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontFamily } from '@/constants/theme';

const colors = {
  border: '#34272B',
  cream: '#F6E9DA',
  accent: '#D62754',
  accentDark: '#64152B',
  muted: '#A99DA0',
};

type IconProps = {
  name: SymbolViewProps['name'];
  color?: string;
};

function Icon({ name, color = colors.cream }: IconProps) {
  return <SymbolView name={name} size={23} tintColor={color} />;
}

export function MainBottomNav({ active }: { active: 'home' | 'search' }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.nav}>
        <Link href="/" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Home"
            style={StyleSheet.flatten([styles.item, active === 'home' && styles.itemActive])}>
            <Icon
              name={{ ios: 'house.fill', android: 'home', web: 'home' }}
              color={active === 'home' ? colors.cream : colors.muted}
            />
            <Text style={[styles.label, active === 'home' && styles.labelActive]}>Home</Text>
          </Pressable>
        </Link>

        <Link href="/search" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search"
            style={StyleSheet.flatten([styles.item, active === 'search' && styles.itemActive])}>
            <Icon
              name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
              color={active === 'search' ? colors.cream : colors.muted}
            />
            <Text style={[styles.label, active === 'search' && styles.labelActive]}>Search</Text>
          </Pressable>
        </Link>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add a Reel"
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
          <Icon name={{ ios: 'plus', android: 'add', web: 'add' }} color={colors.cream} />
        </Pressable>

        <View style={styles.item}>
          <Icon name={{ ios: 'bookmark', android: 'bookmark', web: 'bookmark' }} />
          <Text style={styles.label}>Library</Text>
        </View>
        <View style={styles.item}>
          <Icon name={{ ios: 'person', android: 'person', web: 'person' }} />
          <Text style={styles.label}>Profile</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  nav: {
    width: '100%',
    maxWidth: 680,
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 30,
    backgroundColor: '#191516',
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
  },
  item: {
    minWidth: 54,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    borderRadius: 24,
  },
  itemActive: {
    minWidth: 70,
    backgroundColor: colors.accentDark,
  },
  label: {
    fontFamily: FontFamily.medium,
    color: colors.muted,
    fontSize: 10,
  },
  labelActive: {
    color: colors.cream,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  pressed: {
    opacity: 0.75,
  },
});
