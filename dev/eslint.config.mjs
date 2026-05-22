import { configs } from '@riveo/eslint-config';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfig(
  globalIgnores([
    '.next/',
    'dist/',
    'var/',
    'src/app/(payload)/*',
    'src/payload-types.ts',
  ]),
  {
    languageOptions: {
      globals: { ...globals.node },
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
    files: ['./migrations/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'none',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': 0,
    },
  },
);
