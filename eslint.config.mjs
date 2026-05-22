import { configs } from '@riveo/eslint-config';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(
  globalIgnores(['var/', 'packages/', 'dev/']),
  configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        allowDefaultProject: ['*.config.mjs'],
      },
    },
  },
);
