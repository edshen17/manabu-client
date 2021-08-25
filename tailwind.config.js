module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'noto-sans': ['"Noto Sans JP"'],
      },
      backgroundImage: {
        main: "url('../img/home.jpg')",
      },
    },
  },
  variants: {
    outline: ['focus'],
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
