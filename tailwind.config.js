/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}','./src/components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      'colors':{
        'primaryGrn':'#18685f',
        'SecondaryOrg':'#FF714C',
        'SecondaryGry':'#A0A1A0',
        'TextColorPrimary':'#0D3C36',
        'BackgroundColor':'#E8E8E8',
        'FieldStroke':'#0D3636'
      },
      'backgroundColor':{'primary':'#E8E8E8'},
      'fontFamily':{
        "rubik-light":["Rubik-Light",'sans-serif'],
        "rubik-regular":["Rubik-Regular",'sans-serif'],
        "rubik-medium":["Rubik-Medium",'sans-serif'],
        "rubik-semiBold":["Rubik-SemiBold",'sans-serif'],
        "rubik-bold":["Rubik-Bold",'sans-serif'],
      }
    },
  },
  plugins: [],
}
