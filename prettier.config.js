/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  tabWidth: 2,
  semi: true,
  arrowParens: 'avoid',
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '',
    '^~(/.*)$',
    '',
    '^[.]',
  ],
};

export default config;
