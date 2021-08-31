const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  purge: {
    content: ['./js/*.js', './src/*.vue', './src/**/*.vue'],
  },
  theme: {
    extend: {
      colors: {
        tmmgreen: {
          100: '#c6d7a7',
          200: '#bace95',
          300: '#afc683',
          400: '#98b660',
          500: '#8cae4e',
          600: '#7e9d46',
          700: '#708b3e',
          800: '#54682f',
          900: '#38461f',
        },
        gray: {
          '50': '#fafafa',
          ...colors.gray,
        },
      },
      spacing: {
        '72': '18rem',
        '76': '19rem',
        '80': '20rem',
        '84': '21rem',
        '88': '22rem',
        '96': '24rem',
        '104': '26rem',
        '108': '27rem',
        '140': '35rem',
      },
    },
  },
  // variants: {
  //   padding: ['last', 'responsive', 'hover', 'focus', 'first'],
  //   borderStyle: ['last', 'first', 'responsive', 'hover', 'focus', 'even', 'odd'],
  //   borderWidth: ['last', 'first', 'responsive', 'hover', 'focus'],
  //   borderColor: [
  //     'last',
  //     'responsive',
  //     'hover',
  //     'focus',
  //     'first',
  //     'focus-within',
  //     'even',
  //     'odd',
  //   ],
  //   backgroundColor: ['last', 'first', 'hover', 'focus', 'even', 'odd'],
  //   shadow: ['hover', 'focus', 'focus-within'],
  // },
  plugins: [],
}
