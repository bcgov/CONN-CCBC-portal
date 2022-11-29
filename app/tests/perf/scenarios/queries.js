/* eslint-disable */
import http from 'k6/http';
import exec from 'k6/execution';

const numApplications = __ENV.NUM_APPLICATIONS;

const queries = () => {
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
};

export default queries;
