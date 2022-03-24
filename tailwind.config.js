/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'noto-sans': ['"Noto Sans JP"'],
      },
      height: {
        '10v': '10vh',
        '20v': '20vh',
        '30v': '30vh',
        '40v': '40vh',
        '50v': '50vh',
        '60v': '60vh',
        '70v': '70vh',
        '80v': '80vh',
        '90v': '90vh',
        '100v': '100vh',
      },
    },
  },
  variants: {
    outline: ['responsive', 'focus-within', 'focus'],
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['disabled'],
      cursor: ['disabled'],
      textColor: ['disabled'],
      boxShadow: ['disabled'],
      borderColor: ['disabled'],
      ringWidth: ['hover', 'active'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animatecss')({
      classes: ['animate__animated', 'animate__fadeIn', 'animate__fadeOut'],
      settings: {
        animatedSpeed: 300,
      },
    }),
  ],
};
