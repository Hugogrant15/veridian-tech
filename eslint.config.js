import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "dist-server", ".wrangler", "marketing", "documents"] },
  {
    files: ["**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: globals.browser },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.strict, reactHooks.configs.flat.recommended],
    plugins: { react: reactPlugin, "react-refresh": reactRefresh },
    languageOptions: { globals: globals.browser },
    settings: { react: { version: "19.2" } },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      "react/prop-types": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
);
