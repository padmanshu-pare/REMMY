import AsyncStorage from '@react-native-async-storage/async-storage';

export const ONBOARDING_KEY = 'keepsy_onboarding_complete';

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch (error) {
    console.warn('Unable to read onboarding state', error);
    return false;
  }
}

export async function setOnboardingComplete(value: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, String(value));
  } catch (error) {
    console.warn('Unable to persist onboarding state', error);
  }
}
