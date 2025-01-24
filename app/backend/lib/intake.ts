import { Router } from 'express';
import { performQuery } from './graphql';
import getAuthRole from '../../utils/getAuthRole';

const currentIntakeQuery = `
  query currentIntake {
    openIntake {
      ccbcIntakeNumber
      hiddenCode
      rowId
    }
    session {
      ccbcUserBySub {
        rowId
        sessionSub
        intakeUsersByUserId {
          nodes {
            intakeId
          }
        }
      }
    }
  }
`;

const intakeUserMutation = `
    mutation intakeUser($input: CreateIntakeUserInput!) {
      createIntakeUser(input: $input) {
        clientMutationId
      }
    }
`;

const intake = Router();

intake.get('/api/intake', async (req, res) => {
  try {
    const { code } = req?.query || null;
    if (!code) {
      return res
        .status(400)
        .json({ error: 'Missing required query parameters' });
    }

    const authRole = getAuthRole(req);
    // not logged in
    if (authRole.pgRole === 'ccbc_guest') {
      res.redirect(`/applicantportal?redirect=/api/intake?code=${code}`);
    }
    // if a non-applicant is logged in, redirect to dashboard
    if (
      authRole.pgRole === 'ccbc_admin' ||
      authRole.pgRole === 'ccbc_analyst' ||
      authRole.pgRole === 'super_admin' ||
      authRole.pgRole === 'cbc_admin'
    ) {
      res.redirect('/analyst/dashboard');
    }

    // validate that the code and intake number matches the current open intake
    const currentIntake = await performQuery(currentIntakeQuery, null, req);
    const { hiddenCode } = currentIntake.data.openIntake;
    const intakeRowId = currentIntake.data.openIntake.rowId;
    const userRowId = currentIntake.data.session.ccbcUserBySub.rowId;
    if (hiddenCode !== code) {
      return res.status(400).json({ error: 'Invalid' });
    }

    // the code and intake match, grant applicant access
    const intakeUserInput = {
      input: {
        intakeUser: {
          intakeId: intakeRowId,
          userId: userRowId,
        },
      },
    };
    // first check if the user is already on the table
    // NOTE: adjust logic if there are future intakes
    const intakeUsers =
      currentIntake?.data?.session?.ccbcUserBySub?.intakeUsersByUserId?.nodes;
    if (intakeUsers.length > 0) {
      return res.redirect('/applicantportal/dashboard');
    }
    const userResult = await performQuery(
      intakeUserMutation,
      intakeUserInput,
      req
    );
    if (!userResult.errors) {
      return res.redirect('/applicantportal/dashboard');
    }
    throw new Error('Failed to create intake user');
  } catch {
    return res.status(500).json({
      error:
        'An error has occurred, please try again later. If the error persists please contact us. ',
    });
  }
});

export default intake;
