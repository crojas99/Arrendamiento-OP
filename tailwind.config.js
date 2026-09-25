/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        tinta: '#14213D',      // barra lateral
        papel: '#F7F8FA',      // fondo
        grafito: '#1F2937',    // texto
        niebla: '#6B7280',     // texto secundario
        linea: '#E3E6EB',      // bordes
        placa: '#F5C518',      // amarillo de placa
      },
      fontFamily: { sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
