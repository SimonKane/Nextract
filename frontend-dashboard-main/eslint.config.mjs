import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Add default rules here if needed, or leave empty
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/display-name": "warn",
      "@typescript-eslint/no-wrapper-object-types": "warn",
      "prefer-const": "warn",
      "react-hooks/rules-of-hooks": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "react/no-children-prop": "warn",

    },

  },

];

export default eslintConfig;
