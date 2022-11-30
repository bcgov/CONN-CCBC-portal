/* eslint-disable */
import exec from 'k6/execution';
import mutations from './scenarios/mutations.js';
import queries from './scenarios/queries.js';
import uploadsSmall from './scenarios/uploads_small.js';
import uploadsLarge from './scenarios/uploads_large.js';

// Smoke testing options, use those when updating the script
// export const options = {
//   scenarios: {
//     queries: {
//       executor: 'constant-vus',
//       vus: 1, // 1 user looping for 1 minute
//       duration: '10s',
//     },
//     mutations: {
//       startTime: '10s',
//       executor: 'shared-iterations',
//       vus: 1, // 1 user looping for 10 iterations
//       iterations: 10,
//     },
//     uploads: {
//       startTime: '20s',
//       executor: 'shared-iterations',
//       vus: 1, // 1 user looping for 10 iterations
//       iterations: 1,
//     },
//   },
//   thresholds: {
//     http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
//   },
//   rps: 50,
// };

export const options = {
  scenarios: {
    queries: {
      executor: 'ramping-vus',
      stages: [
        { duration: '5m', target: 60 }, // simulate ramp-up of traffic from 1 to 60 users over 5 minutes.
        { duration: '10m', target: 60 }, // stay at 60 users for 10 minutes
        { duration: '3m', target: 100 }, // ramp-up to 100 users over 3 minutes (peak hour starts)
        { duration: '2m', target: 100 }, // stay at 100 users for short amount of time (peak hour)
        { duration: '3m', target: 60 }, // ramp-down to 60 users over 3 minutes (peak hour ends)
        { duration: '10m', target: 60 }, // continue at 60 for additional 10 minutes
        { duration: '2m', target: 0 }, // ramp-down to 0 users
      ],
    },
    mutations: {
      startTime: '35m',
      executor: 'shared-iterations',
      vus: 50, // 50 user looping for 1000 iterations
      iterations: 1000,
    },
  },
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
  },
  rps: 50, // don't increase this without consulting platform services first
};

// Use this to run upload tests
// export const options = {
//   scenarios: {
//     uploadsSmall: {
//       executor: 'ramping-vus',
//       stages: [
//         { duration: '5m', target: 5 }, // simulate ramp-up of traffic from 1 to 5 users over 5 minutes.
//         { duration: '10m', target: 5 }, // stay at 5 users for 10 minutes
//         { duration: '3m', target: 10 }, // ramp-up to 10 users over 3 minutes (peak hour starts)
//         { duration: '2m', target: 10 }, // stay at 10 users for short amount of time (peak hour)
//         { duration: '3m', target: 20 }, // ramp-down to 20 users over 3 minutes (peak hour ends)
//         { duration: '10m', target: 20 }, // continue at 20 for additional 10 minutes,
//         { duration: '3m', target: 30 }, // ramp-down to 30 users over 3 minutes (peak hour ends)
//         { duration: '10m', target: 30 }, // continue at 30 for additional 10 minutes
//         { duration: '2m', target: 0 }, // ramp-down to 0 users
//       ],
//     },
//     uploadsLarge: {
//       executor: 'ramping-vus',
//       stages: [
//         { duration: '5m', target: 2 }, // simulate ramp-up of traffic from 1 to 2 users over 5 minutes.
//         { duration: '10m', target: 2 }, // stay at 2 users for 10 minutes
//         { duration: '3m', target: 4 }, // ramp-up to 4 users over 3 minutes (peak hour starts)
//         { duration: '2m', target: 4 }, // stay at 4 users for short amount of time (peak hour)
//         { duration: '3m', target: 6 }, // ramp-down to 6 users over 3 minutes (peak hour ends)
//         { duration: '10m', target: 6 }, // continue at 6 for additional 10 minutes,
//         { duration: '3m', target: 10 }, // ramp-down to 10 users over 3 minutes (peak hour ends)
//         { duration: '10m', target: 10 }, // continue at 10 for additional 10 minutes
//         { duration: '2m', target: 0 }, // ramp-down to 0 users
//       ],
//     },
//   },
//   rps: 50, // don't increase this without consulting platform services first
// };

export default function () {
  if (exec.scenario.name === 'queries') {
    queries();
  }

  if (exec.scenario.name === 'mutations') {
    mutations();
  }

  if (exec.scenario.name === 'uploadsSmall') {
    uploadsSmall();
  }

  if (exec.scenario.name === 'uploadsLarge') {
    uploadsLarge();
  }
}
