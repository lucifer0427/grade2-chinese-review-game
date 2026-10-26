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
          cream: '#FFFBEB',    // 溫暖米黃底色
          paper: '#FEF3C7',    // 柔和牛皮紙
          orange: '#FB923C',   // 柿子暖橘
          green: '#86EFAC',    // 森林嫩綠
          greenDark: '#16A34A',// 深森綠
          blue: '#93C5FD',     // 晴空粉藍
          blueDark: '#2563EB', // 墨水深藍
          pink: '#F472B6',     // 櫻花粉紅
          wood: '#78350F',     // 原木色字體
          brown: '#92400E',
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
