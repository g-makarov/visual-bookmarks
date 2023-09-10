module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'unused-imports', 'simple-import-sort', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-use-before-define': 'off',

    // independent functions should have return type to avoid incorrect use of function
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': [
      'error',
      {
        allowArgumentsExplicitlyTypedAsAny: true,
      },
    ],

    '@typescript-eslint/array-type': ['error', { default: 'array' }],

    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
      {
        selector: 'parameter',
        format: ['camelCase'],
      },
      {
        selector: 'parameter',
        format: null,
        filter: {
          regex: '^_$',
          match: true,
        },
      },
    ],

    'no-plusplus': 'off',
    'arrow-body-style': 'off',

    // imports routine
    'sort-imports': 'off',
    'import/order': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'unused-imports/no-unused-imports-ts': 'error',

    'import/no-duplicates': 'off',
    'import/no-cycle': 'off',
    'import/extensions': 'off',

    'import/prefer-default-export': 'off',
    // 'import/no-default-export': 'error',

    // react
    'react/no-array-index-key': 'off',
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.tsx', '.jsx'],
      },
    ],
    "react/function-component-definition": "off",

    'prefer-destructuring': 'off',

    'prettier/prettier': 'error',

    // immer uses reassign
    'no-param-reassign': 'off',

    // use aliases instead of relative paths
    'no-restricted-imports': [
      'error',
      {
        patterns: ['../*'],
      },
    ],

    // use optional chaining instead
    '@typescript-eslint/no-non-null-assertion': 'error',

    'max-classes-per-file': 'off',

    'global-require': 'off',

    'no-console': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
