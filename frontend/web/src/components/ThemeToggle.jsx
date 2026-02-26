import { useState } from "react";
import { useThemeStore } from "../store/themeStore";
import { Sun, Moon, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { themeToggleVariants, containerVariants } from "../utils/animations";

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { key: "light", name: "Light", icon: Sun },
    { key: "dark", name: "Dark", icon: Moon },
    { key: "system", name: "System", icon: Monitor },
  ];

  const currentTheme = themes.find((t) => t.key === theme);
  const CurrentIcon = currentTheme?.icon;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    transition-all duration-200 ease-in-out
                    shadow-sm hover:shadow-md"
        aria-label="Toggle theme"
        variants={themeToggleVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <CurrentIcon className="w-5 h-5" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Dropdown */}
            <motion.div
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800
                          border border-gray-200 dark:border-gray-700
                          rounded-lg shadow-xl z-50
                          ring-1 ring-black ring-opacity-5"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <div className="p-2">
                {themes.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.key}
                      onClick={() => {
                        setTheme(item.key);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md
                                text-sm font-medium transition-colors duration-200
                                ${
                                  theme === item.key
                                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                }`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      whileHover={{ x: 4, backgroundColor: "var(--surface-alt)" }}
                    >
                      <Icon size={16} />
                      <span>{item.name}</span>
                      {theme === item.key && (
                        <motion.span
                          className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
                          animate={{ scale: [0, 1.2, 1] }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
