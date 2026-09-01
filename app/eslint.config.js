const globals = require('globals');
const jest = require('eslint-plugin-jest');
const relay = require('eslint-plugin-relay');
const tsParser = require('@typescript-eslint/parser');
const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const scopedExtends = (files, ...configs) =>
  compat.extends(...configs).map((config) => ({ ...config, files }));

module.exports = [
  ...compat.extends(
    'airbnb',
    'airbnb-typescript',
    'next',
    'plugin:relay/recommended',
    'prettier'
  ),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      sourceType: 'module',

      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },

    plugins: {
      jest,
      relay,
    },

    rules: {
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

      'react/jsx-no-useless-fragment': [
        2,
        {
          allowExpressions: true,
        },
      ],

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

      'no-console': [
        'error',
        {
          allow: ['error'],
        },
      ],
    },
  },
  ...scopedExtends(['tests/**/*'], 'plugin:jest/recommended'),
  {
    files: ['tests/**/*'],

    rules: {
      'jest/expect-expect': [
        'warn',
        {
          assertFunctionNames: ['expect', '*.expectMutationToBeCalled'],
        },
      ],
    },
  },
  ...scopedExtends(['cypress/**/*.js'], 'plugin:cypress/recommended'),
  {
    files: ['cypress/**/*.js'],

    languageOptions: {
      parserOptions: {
        project: 'cypress/tsconfig.json',
      },
    },

    rules: {
      'jest/valid-expect-in-promise': 0,
      'jest/no-focused-tests': 2,
      'promise/prefer-await-to-then': 0,
      'no-unused-expressions': 0,
      'cypress/no-unnecessary-waiting': 0,

      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],
    },
  },
  {
    ignores: [
      '**/*.js',
      '!**/*.cy.js',
      '!**/e2e.js',
      '**/instrumentation.ts',
      'next-env.d.ts',
    ],
  },
];
