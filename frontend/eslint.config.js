import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },

    // --- THÊM PHẦN NÀY VÀO ---
    rules: {
      // Tắt các quy tắc React không cần thiết khi dùng JSX Transform mới
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // Đây là quy tắc bạn hỏi:
      // "warn" -> Chỉ báo vàng, không dừng build
      // "error" -> Báo đỏ và dừng build
      // "off" -> Tắt hoàn toàn
      "@typescript-eslint/no-unused-vars": "warn"
    }
    // -------------------------
  },
])