import { useThemeStore } from "../store/themeStore";

export default function ThemeTest() {
  const { theme, isDark, toggleTheme } = useThemeStore();

  return (
    <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        Theme Test
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
        Current Theme: <span className="font-medium">{theme}</span>
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Is Dark Mode:{" "}
        <span className="font-medium">{isDark ? "Yes" : "No"}</span>
      </p>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Toggle Theme
      </button>
    </div>
  );
}
