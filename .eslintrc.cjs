/** @type {import("eslint").Linter.Config} */
const config = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-floating-promises': 'off',

    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/non-nullable-type-assertion-style': 'off',
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'next/navigation',
            importNames: ['useRouter'],
            message: 'Use import from ~/navigation.',
          },
          {
            name: 'next-nprogress-bar',
            importNames: ['useRouter'],
            message: 'Use import from ~/navigation.',
          },
        ],
      },
    ],
  },
};

module.exports = config;
