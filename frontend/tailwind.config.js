/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-bg":
          "radial-gradient(circle at 50% 50%, #107c10, rgba(196, 196, 196, 0) 100%),radial-gradient(circle at 50% 50%, #0078d4, rgba(196, 196, 196, 0) 100%),radial-gradient(circle at 50% 50%, rgba(255, 185, 0, 0.75), rgba(196, 196, 196, 0) 100%),radial-gradient(circle at 50% 50%, rgba(216, 59, 1, 0.75), rgba(196, 196, 196, 0) 100%)",
      },
      flexShrink: {
        2: "2",
      },
      boxShadow: {
        "search-bs":
          "0 3px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.08)",
        "avatar-bs": "0 2px 4px rgba(0, 0, 0, 0.18)",
        "focus-bs": "0 3px 12px 0 rgba(0, 0, 0, 0.15)",
        "login-bs": "0 2px 6px rgba(0, 0, 0, 0.2)",
        "login-hover-bs": "rgba(234, 100, 217, 0.1) 0px 0px 0px 4px",
        "navigate-bs": "0 6px 16px rgba(0, 0, 0, 0.12)",
        "select-bs": "0 0 0 2px rgb(0, 0, 0)",
      },
      height: {
        inherit: "inherit",
      },
      colors: {
        "custom-gray": "#DDD",
        "b-color": "#B0B0B0",
        "custom-focus": "#EBEBEB",
        "custom-text": "#6A6A6AAD",
        text: "#222222",
      },
      spacing: {
        "custom-32": "32px",
      },
      borderRadius: {
        custom: "32px",
      },
      flex: {
        "0.7-0-0": "0.7 0 0%",
        "2-0-0": "2 0 0%",
        "custom-50": "0 1 calc(50% - 6px)",
        "custom-33": "0 1 calc(33% - 9px)",
      },
      screens: {
        smd: "480px",
        xl: "1400px",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      });
    },
  ],
};
