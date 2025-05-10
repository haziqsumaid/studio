
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or null until client-side hydration is complete
    // to avoid hydration mismatch if theme is read from localStorage.
    return <Button variant="ghost" size="icon" className="w-9 h-9" disabled />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className="relative w-9 h-9 overflow-hidden"
    >
      <AnimatePresence initial={false} mode="wait">
        {theme === "light" ? (
          <motion.div
            key="sun"
            initial={{ y: -20, opacity: 0, scale: 0.5, rotate: -90 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, scale: 0.5, rotate: 90 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun size={20} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ y: -20, opacity: 0, scale: 0.5, rotate: -90 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, scale: 0.5, rotate: 90 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon size={20} />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
