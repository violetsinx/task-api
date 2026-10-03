import eslint from '@eslint/js';

const nodeGlobals = {
  console: 'readonly',
  process: 'readonly',
};

export default [
  {
    ignores: ['node_modules/**', 'coverage/**', 'prisma/generated/**'],
  },
  eslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: nodeGlobals,
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];
