/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: "#2C3C58",
        red: "#DA0E29",
        darkRed: "#9A103C",
        yellow: "#FAD425",
        yellowHome: "#FCBB19"
      },
      fontFamily: {
        times: ['"Times New Roman"', 'Times', 'serif'],
        goldman: ['"Goldman"', 'sans-serif'],
        arial: ['Arial', 'sans-serif']
      },
      boxShadow: {
        custom: "0px 4px 4px 0px #00000040"
      },
      height: {
        "header-sm": "61px",
        // "header-md": "100.5px"
      },
      screens: {
        xs: '480px',
        // lg2: "1100px"
      },
      animation: {
        'spin-slow': 'spin 9s linear infinite',
      },
    },
  },
  plugins: [],
}

