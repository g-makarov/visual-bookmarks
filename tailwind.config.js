/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  darkMode: 'class',
  important: 'body',
  theme: {
    colors: {
      current: 'currentColor',
      accent: 'hsl(var(--accent-color) / <alpha-value>)',
      primary: 'hsl(var(--primary-color) / <alpha-value>)',
      red: 'hsl(var(--red-color) / <alpha-value>)',
      green: 'hsl(var(--green-color) / <alpha-value>)',
      blue: 'hsl(var(--blue-color) / <alpha-value>)',
      white: 'hsl(var(--white-color) / <alpha-value>)',
      'black-1': 'hsl(var(--black-1-color) / <alpha-value>)',
      'black-2': 'hsl(var(--black-2-color) / <alpha-value>)',
      'gray-1': 'hsl(var(--gray-1-color) / <alpha-value>)',
      'gray-2': 'hsl(var(--gray-2-color) / <alpha-value>)',
      'gray-3': 'hsl(var(--gray-3-color) / <alpha-value>)',
      'gray-5': 'hsl(var(--gray-5-color) / <alpha-value>)',
      'gray-6': 'hsl(var(--gray-6-color) / <alpha-value>)',
      'gray-7': 'hsl(var(--gray-7-color) / <alpha-value>)',
    },
    fontSize: {
      h1: [
        'var(--h1-font-size)',
        {
          lineHeight: 'var(--h1-line-height)',
          fontWeight: 700,
        },
      ],
      h2: [
        'var(--h2-font-size)',
        {
          lineHeight: 'var(--h2-line-height)',
          fontWeight: 700,
        },
      ],
      h3: [
        'var(--h3-font-size)',
        {
          lineHeight: 'var(--h3-line-height)',
          fontWeight: 700,
        },
      ],
      h4: [
        'var(--h4-font-size)',
        {
          lineHeight: 'var(--h4-line-height)',
          fontWeight: 700,
        },
      ],
      p1: [
        'var(--p1-font-size)',
        {
          lineHeight: 'var(--p1-line-height)',
        },
      ],
      p2: [
        'var(--p2-font-size)',
        {
          lineHeight: 'var(--p2-line-height)',
        },
      ],
      p3: [
        'var(--p3-font-size)',
        {
          lineHeight: 'var(--p3-line-height)',
        },
      ],
      p4: [
        'var(--p4-font-size)',
        {
          lineHeight: 'var(--p4-line-height)',
        },
      ],
      p5: [
        'var(--p5-font-size)',
        {
          lineHeight: 'var(--p5-line-height)',
        },
      ],
      p6: [
        'var(--p6-font-size)',
        {
          lineHeight: 'var(--p6-line-height)',
        },
      ],
    },
  },
  plugins: [],
};
