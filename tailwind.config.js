module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        red: {
          450: '#f06332',
        },
        qiqi: {
          500: '#10B981',
        },
      },
      backgroundImage: {
        'hallowen-qiqi': "url('../public/images/qiqi-hallowen.png')",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
