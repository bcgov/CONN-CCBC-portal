import http from 'k6/http';
import exec from 'k6/execution';

export const options = {
  scenarios: {
    queries: {
      executor: 'constant-vus',
      vus: 1, // 1 user looping for 1 minute
      duration: '10s',
    },
    mutations: {
      startTime: '10s',
      executor: 'shared-iterations',
      vus: 1, // 1 user looping for 1 minute
      iterations: 10,
    },
  },
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
  },
  rps: 50,
};

// export const options = {
//   stages: [
//     { duration: '5m', target: 60 }, // simulate ramp-up of traffic from 1 to 60 users over 5 minutes.
//     { duration: '10m', target: 60 }, // stay at 60 users for 10 minutes
//     { duration: '3m', target: 100 }, // ramp-up to 100 users over 3 minutes (peak hour starts)
//     { duration: '2m', target: 100 }, // stay at 100 users for short amount of time (peak hour)
//     { duration: '3m', target: 60 }, // ramp-down to 60 users over 3 minutes (peak hour ends)
//     { duration: '10m', target: 60 }, // continue at 60 for additional 10 minutes
//     { duration: '5m', target: 0 }, // ramp-down to 0 users
//   ],
//   thresholds: {
//     http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
//   },
//   rps: 50,
// };

const numApplications = __ENV.NUM_APPLICATIONS;

export default function () {
  if (exec.scenario.name === 'queries') {
    const getParams = {
      cookies: {
        'mocks.auth_role': 'ccbc_auth_user',
      },
    };

    http.get(__ENV.APP_HOST + '/applicantportal/dashboard', getParams);

    http.get(
      __ENV.APP_HOST +
        `/applicantportal/form/${
          (exec.vu.iterationInInstance % numApplications) + 1
        }/1`,
      Object.assign({}, getParams, {
        tags: { name: '/applicantportal/form/[id]/[page]' },
      })
    );
  }

  if (exec.scenario.name === 'mutations') {
    const postParams = {
      cookies: {
        'mocks.auth_role': 'ccbc_auth_user',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const createApplicationPayload = JSON.stringify({
      id: 'createApplicationMutation',
      query: `
        mutation createApplicationMutation($input: CreateApplicationInput!) {
          createApplication(input: $input) {
            application {
              formData {
                rowId
              }
            }
          }
        }`,
      variables: { input: {} },
    });

    const res = http.post(
      __ENV.APP_HOST + '/graphql',
      createApplicationPayload,
      Object.assign({}, postParams, {
        tags: { name: 'createApplicationMutation' },
      })
    );

    const formDataRowId =
      res.json().data.createApplication.application.formData.rowId;

    const updateApplicationPayload = JSON.stringify({
      id: 'updateApplicationFormMutation',
      query: `
        mutation updateApplicationFormMutation($input: UpdateApplicationFormInput!) {
          updateApplicationForm(input: $input) {
            formData {
              id
              jsonData
              updatedAt
            }
          }
        }`,

      variables: {
        input: {
          jsonData: { projectInformation: { projectTitle: 'test' } },
          lastEditedPage: 'projectInformation',
          formDataRowId: formDataRowId,
        },
      },
    });

    http.post(
      __ENV.APP_HOST + '/graphql',
      updateApplicationPayload,
      Object.assign({}, postParams, {
        tags: { name: 'updateApplicationFormMutation' },
      })
    );
  }
}
