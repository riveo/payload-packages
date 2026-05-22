import { configs } from '@riveo/eslint-config';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(
  globalIgnores(['.next/', 'dist/', 'var/']),
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.config.mjs'],
        },
      },
    },
  },
  configs.recommended,
  configs.nextjs,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 0,
    },
  },
);
