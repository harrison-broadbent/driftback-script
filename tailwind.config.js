/** @type {import('tailwindcss').Config} */
export default {
  // Use a prefix so our classes do not conflict with the host page.
  prefix: ' ',
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
