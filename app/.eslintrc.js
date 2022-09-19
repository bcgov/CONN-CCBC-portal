module.exports = {
  root: true,
  extends: ['airbnb-typescript', 'next', 'plugin:relay/strict', 'prettier'],
  env: { es6: true, browser: true, node: true },
  plugins: ['jest', 'relay'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
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
