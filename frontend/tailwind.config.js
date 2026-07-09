/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#2563EB", foreground: "#FFFFFF" },
        background: "#F8FAFC",
        card: "#FFFFFF",
        border: "hsl(214.3 31.8% 91.4%)",
        muted: { DEFAULT: "#F1F5F9", foreground: "#64748B" },
        destructive: { DEFAULT: "#EF4444", foreground: "#FFFFFF" },
        success: "#22C55E",
        warning: "#F59E0B",
      },
      borderRadius: { DEFAULT: "16px", lg: "16px", md: "12px", sm: "8px" },
      fontFamily: { sans: ["Inter", "sans-serif"] },
    },
  },
  plugins: [],
};
