import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {files: ["src/*.{js,mjs,cjs,ts}"]},
  {ignores: ["dist/**/*"]},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {rules: {"@typescript-eslint/no-require-imports": 0}},
];