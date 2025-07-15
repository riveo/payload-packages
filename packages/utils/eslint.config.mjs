import { eslintConfigNext } from '../../eslint.config.mjs';

const config = [
  {
    ignores: ['.next', 'dist', 'var'],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.config.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...eslintConfigNext,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 0,
    },
  },
];

export default config;
