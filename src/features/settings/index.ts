import { createStore } from 'effector';

type SystemTheme = 'dark' | 'light';

interface UserSettings {
  theme: SystemTheme | 'system';
  colors: {
    accent: string;
    primary: string;
  };
}

// todo
export const $settings = createStore<UserSettings>({
  theme: 'system',
  colors: {
    accent: '#ff0000',
    primary: '#0000ff',
  },
});
