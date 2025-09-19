import React, { useState, useEffect } from "react";

const Settings = () => {
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");
  const [theme, setTheme] = useState("light");


  // Load saved preferences
  useEffect(() => {
    document.title = "ShopEase - Settings";
    const savedLang = localStorage.getItem("language");
    const savedCurrency = localStorage.getItem("currency");
    const savedTheme = localStorage.getItem("theme");

    if (savedLang) setLanguage(savedLang);
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem("language", language);
    localStorage.setItem("currency", currency);
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [language, currency, theme]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
        Settings ⚙️
      </h2>

      {/* Language Selector */}
      <div className="space-y-2">
        <label className="block text-gray-700 dark:text-gray-300 font-medium">
          Language 🌍
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
        >
          <option value="en">English</option>
          <option value="bn">Bangla</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      {/* Currency Selector */}
      <div className="space-y-2">
        <label className="block text-gray-700 dark:text-gray-300 font-medium">
          Currency 💰
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
        >
          <option value="USD">USD ($)</option>
          <option value="BDT">BDT (৳)</option>
          <option value="EUR">EUR (€)</option>
          <option value="INR">INR (₹)</option>
        </select>
      </div>

      {/* Theme Switch */}
      <div className="flex items-center justify-between">
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          Theme 🎨
        </span>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="px-4 py-2 rounded-lg shadow-md bg-gray-200 dark:bg-gray-600 dark:text-white"
        >
          {theme === "light" ? "Switch to Dark 🌙" : "Switch to Light ☀️"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
