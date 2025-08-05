/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'cypress';

const happoTask = require('happo-cypress/task');

export default defineConfig({
  video: false,
  pageLoadTimeout: 100000,
  retries: 0,
  fixturesFolder: '../db/data',
  e2e: {
    setupNodeEvents(on, config) {
      happoTask.register(on);
      return config;
    },
    baseUrl: 'http://localhost:3000/',
  },
});
