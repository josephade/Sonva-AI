"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/30 backdrop-blur-xl border-b border-border font-[Inter]">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16 relative">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
            <span className="text-xl font-extrabold tracking-tight">
              Sonva AI
            </span>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            {["Product", "Book Demo"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="
                  text-sm font-medium
                  hover:text-primary
                  no-underline hover:no-underline active:no-underline focus:no-underline
                  transition-colors
                "
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Right: Login Button */}
          <div className="flex items-center space-x-4">
            <motion.a
              href="#login"
              whileHover={{ scale: 1.1, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="
                hidden md:inline-block px-4 py-2 rounded-lg text-sm font-semibold text-primary
                border border-primary/40 hover:bg-primary/10
                no-underline hover:no-underline active:no-underline focus:no-underline
                transition-all
              "
            >
              Login
            </motion.a>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden py-4 space-y-4 border-t border-border"
          >
            <a
              href="#product"
              className="
                block text-sm font-medium
                hover:text-primary
                no-underline hover:no-underline active:no-underline focus:no-underline
                transition-colors
              "
            >
              Product
            </a>
            <a
              href="#demo"
              className="
                block text-sm font-medium
                hover:text-primary
                no-underline hover:no-underline active:no-underline focus:no-underline
                transition-colors
              "
            >
              Uses
            </a>
            <a
              href="#login"
              className="
                block text-sm font-semibold text-primary border border-primary/40 px-4 py-2 rounded-lg
                hover:bg-primary/10
                no-underline hover:no-underline active:no-underline focus:no-underline
                transition-all
              "
            >
              Login
            </a>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
