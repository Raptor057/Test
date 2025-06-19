// tailwind.config.js
import colors from 'tailwindcss/colors'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: colors.slate,
        gray: colors.gray,
        red: colors.red,
        green: colors.green,
        blue: colors.blue,
        yellow: colors.yellow,
        white: colors.white,
        black: colors.black,
      },
    },
  },
  plugins: [],
}
