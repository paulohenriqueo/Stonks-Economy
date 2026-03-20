/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // controle manual (recomendado)
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./app/**/*.{js,ts,jsx,tsx,html}",
    "./app/components/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Base neutra (dark-first)
        background: {
          DEFAULT: "#0F172A",
          secondary: "#111827",
        },
        surface: {
          DEFAULT: "#1F2933",
          light: "#374151",
        },

        // 📝 Texto
        text: {
          primary: "#E5E7EB",
          secondary: "#6B7280",
          dark: "#111827", // usado no light mode
        },

        // 🔵 Azul (principal)
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          light: "#60A5FA",
          softer: "#93C5FD",
        },

        // 💰 Estados financeiros
        success: "#22C55E", // ganhos
        danger: "#EF4444",  // gastos/dívidas
        warning: "#F59E0B", // alertas

        // ☀️ Light mode
        light: {
          background: "#F9FAFB",
          surface: "#FFFFFF",
        },
      },

      // 🔲 Border radius mais moderno
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },

      // 🌫️ Sombras suaves (ótimas pro dark mode)
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.25)",
        card: "0 2px 10px rgba(0, 0, 0, 0.2)",
      },

      // ⚡ Transições mais suaves
      transitionDuration: {
        DEFAULT: "200ms",
      },
    },
  },
  plugins: [],
}