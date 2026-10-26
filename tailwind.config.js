/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        storybook: {
          cream: '#F0FDF4',    // 清新外野草皮淺綠底色
          paper: '#FEF3C7',    // 內野紅土米黃
          orange: '#EA580C',   // 紅土橘紅
          green: '#22C55E',    // 球場翠綠
          greenDark: '#15803D',// 球場深綠
          blue: '#38BDF8',     // 晴空藍
          blueDark: '#1E3A8A', // 記分板深海軍藍
          pink: '#E11D48',     // 棒球縫線紅
          wood: '#451A03',     // 球棒深胡桃木色
          brown: '#9A3412',    // 紅土棕
        }
      },
      fontFamily: {
        zhuyin: ['"BpmfIansui"', '"源泉圓體"', '"PingFang TC"', '"Microsoft JhengHei"', 'sans-serif'],
      },
      boxShadow: {
        'pop': '0 6px 0 0 rgba(0, 0, 0, 0.15)',
        'pop-active': '0 2px 0 0 rgba(0, 0, 0, 0.15)',
        'card': '0 8px 24px -4px rgba(120, 53, 15, 0.12)',
      }
    },
  },
  plugins: [],
}
