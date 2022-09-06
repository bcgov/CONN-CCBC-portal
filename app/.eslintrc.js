module.exports = {
  root: true,
  extends: ['airbnb-typescript', 'next', 'plugin:relay/strict', 'prettier'],
  env: { es6: true, browser: true, node: true },
  plugins: ['jest', 'relay'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  rules: {
    // Todo: fix and remove most of these
    '@typescript-eslint/no-shadow': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-expressions': 'warn',
    '@typescript-eslint/dot-notation': 'warn',
    '@typescript-eslint/lines-between-class-members': 'warn',
    '@typescript-eslint/no-use-before-define': 'warn',
    '@typescript-eslint/return-await': 'warn',
    'relay/unused-fields': 'warn',
    'relay/generated-flow-types': 'warn',
    'relay/must-colocate-fragment-spreads': 'warn',
    'import/no-extraneous-dependencies': 'warn',
    'import/extensions': 'warn',
  },
  overrides: [
    {
      files: ['tests/**/*'],
      extends: 'plugin:jest/recommended',
      rules: {
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
      extends: ['plugin:cypress/recommended'],
      parserOptions: {
        project: 'cypress/tsconfig.json',
      },
      rules: {
        'jest/valid-expect-in-promise': 0,
        'jest/no-focused-tests': 2,
        'promise/prefer-await-to-then': 0,
        'no-unused-expressions': 0,
        'cypress/no-unnecessary-waiting': 0,
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true },
        ],
      },
    },
  ],
};
