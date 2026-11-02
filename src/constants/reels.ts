import type { SymbolViewProps } from 'expo-symbols';

export const categories = [
  {
    label: 'Coding',
    icon: { ios: 'chevron.left.forwardslash.chevron.right', android: 'code', web: 'code' },
  },
  {
    label: 'Recipes',
    icon: { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' },
  },
  {
    label: 'Places',
    icon: { ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' },
  },
  {
    label: 'Tools',
    icon: { ios: 'wrench.and.screwdriver', android: 'build', web: 'build' },
  },
] satisfies { label: string; icon: SymbolViewProps['name'] }[];

export const savedItems = [
  {
    id: 'react-performance-tips',
    title: 'React performance tips',
    category: 'Coding',
    icon: '💻',
    tint: '#38202B',
    description: 'Simple ways to make React apps feel faster.',
    keywords: 'react, javascript, performance, optimize',
    savedDate: 'Saved today',
    categoryIcon: categories[0].icon,
  },
  {
    id: 'creamy-pasta-recipe',
    title: 'Creamy pasta recipe',
    category: 'Recipes',
    icon: '🍝',
    tint: '#34251C',
    description: 'A quick, comforting weeknight pasta.',
    keywords: 'food, cooking, dinner, italian',
    savedDate: 'Saved yesterday',
    categoryIcon: categories[1].icon,
  },
  {
    id: 'best-cafes-indore',
    title: 'Best cafes in Indore',
    category: 'Places',
    icon: '☕',
    tint: '#30231D',
    description: 'Cozy coffee spots to try around the city.',
    keywords: 'coffee, travel, restaurants, food',
    savedDate: 'Saved 3 days ago',
    categoryIcon: categories[2].icon,
  },
];
