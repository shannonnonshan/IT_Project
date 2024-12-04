export default {
  content: [
    './views/**/*.hbs',  // Đường dẫn tới các tệp .hbs
    './src/**/*.{js,ts}', 
    './views/layouts/component/**/*.hbs',
    './views/layouts/**/*.hbs',
  ],
  theme: {
    extend: {
      fontFamily: {
        spartan: ['"League Spartan"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
