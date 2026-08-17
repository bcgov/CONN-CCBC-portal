const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const globals = require('globals');
const nextConfig = require('eslint-config-next');
const prettierConfig = require('eslint-config-prettier');
const relayPlugin = require('eslint-plugin-relay');
const jestPlugin = require('eslint-plugin-jest');
const cypressPlugin = require('eslint-plugin-cypress');
const tsParser = require('@typescript-eslint/parser');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

// eslint-config-next already registers react/react-hooks/import/jsx-a11y as
// flat-config plugins. airbnb's legacy shareable configs register their own
// (different) instances of those same plugins, which ESLint's flat config
// rejects ("Cannot redefine plugin"). Keep airbnb's rules/settings but drop
// those specific plugin registrations so it relies on the instances
// eslint-config-next already provides. @typescript-eslint is left alone:
// next only registers it for *.ts/*.tsx, while airbnb-typescript's rules
// apply file-type-agnostically, so its own registration is still needed.
const DUPLICATE_PLUGIN_KEYS = new Set([
  'react',
  'react-hooks',
  'import',
  'jsx-a11y',
]);

// airbnb-typescript@17 was written against @typescript-eslint/eslint-plugin
// v5-7. v8 removed several "extension" (formatting) rules in favor of
// @stylistic, e.g. lines-between-class-members. This project relies on
// Prettier for formatting anyway (eslint-config-prettier turns these rules
// off below), so drop any @typescript-eslint/* rule airbnb-typescript sets
// that no longer exists in the installed plugin, rather than crashing.
const tsPluginRuleNames = new Set(
  Object.keys(require('@typescript-eslint/eslint-plugin').rules)
);
const stripPlugins = (configs) =>
  configs.map(({ plugins, rules, ...rest }) => {
    const result = { ...rest };
    if (plugins) {
      const remainingPlugins = Object.fromEntries(
        Object.entries(plugins).filter(
          ([key]) => !DUPLICATE_PLUGIN_KEYS.has(key)
        )
      );
      if (Object.keys(remainingPlugins).length) {
        result.plugins = remainingPlugins;
      }
    }
    if (rules) {
      result.rules = Object.fromEntries(
        Object.entries(rules).filter(([key]) => {
          if (!key.startsWith('@typescript-eslint/')) return true;
          return tsPluginRuleNames.has(key.replace('@typescript-eslint/', ''));
        })
      );
    }
    return result;
  });

module.exports = [
  {
    ignores: [
      '.next/**',
      '.next-docs/**',
      'dist/**',
      '__generated__/**',
      'next-env.d.ts',
      'instrumentation.ts',
      '**/*.js',
      '!**/*.cy.js',
      '!**/e2e.js',
    ],
  },
  // airbnb before next: matches the old .eslintrc.js `extends` order
  // (airbnb, airbnb-typescript, next, ...), where later entries win for
  // overlapping rules — next's overrides (e.g. react/react-in-jsx-scope:
  // off, react/prop-types: off) must win over airbnb's stricter defaults.
  ...stripPlugins(compat.extends('airbnb', 'airbnb-typescript')),
  ...nextConfig,
  prettierConfig,
  {
    // Old .eslintrc.js set `parser` at the root, which always wins over
    // whatever a legacy `extends` entry (like next's own parser) sets.
    // Replicate that by placing this block last and setting the parser
    // explicitly so @typescript-eslint/parser is used project-wide.
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        // tsconfig.json excludes tests/ (next build's typecheck must not
        // cover test-only debt), but ESLint's type-aware rules still need
        // to see test files. tsconfig.eslint.json is the same project with
        // tests/ included, used only for this.
        project: 'tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      relay: relayPlugin,
    },
    rules: {
      // REQUIRED FIX — prevents ESLint crash
      '@next/next/no-html-link-for-pages': 'off',
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton'],
        },
      ],
      'arrow-body-style': 0,
      'no-underscore-dangle': 0,
      'no-continue': 0,
      'no-plusplus': 0,
      'dot-notation': 0,
      '@typescript-eslint/dot-notation': 0,
      'react/jsx-props-no-spreading': 0,
      'react/jsx-no-useless-fragment': [2, { allowExpressions: true }],
      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'relay/generated-flow-types': 0,
      'relay/must-colocate-fragment-spreads': 0,
      'relay/unused-fields': 0,
      'class-methods-use-this': 1,
      'react/require-default-props': 0,
      'no-console': ['error', { allow: ['error'] }],
    },
  },
  {
    files: ['tests/**/*'],
    plugins: { jest: jestPlugin },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      'jest/expect-expect': [
        'warn',
        {
          assertFunctionNames: ['expect', '*.expectMutationToBeCalled'],
        },
      ],
    },
  },
  {
    files: ['cypress/**/*.js'],
    plugins: { cypress: cypressPlugin, jest: jestPlugin },
    languageOptions: {
      // eslint-plugin-cypress doesn't ship a flat config; its legacy
      // `env: { 'cypress/globals': true }` maps to this globals set.
      globals: cypressPlugin.environments.globals.globals,
      parserOptions: {
        project: 'cypress/tsconfig.json',
      },
    },
    rules: {
      ...cypressPlugin.configs.recommended.rules,
      'jest/valid-expect-in-promise': 0,
      'jest/no-focused-tests': 2,
      'promise/prefer-await-to-then': 0,
      'no-unused-expressions': 0,
      'cypress/no-unnecessary-waiting': 0,
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
];
