import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules', 'dist'] },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      sourceType: 'module',
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'warn',
    },
  },
];
