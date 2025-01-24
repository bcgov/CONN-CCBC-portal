import { Router } from 'express';
import { performQuery } from './graphql';

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
    const intakeId = req?.query?.intake as string;
    if (!code || !intake) {
      return res
        .status(400)
        .json({ error: 'Missing required query parameters' });
    }
    const parsedIntake = parseInt(intakeId, 10);

    // validate that the code and intake number matches the current open intake
    const currentIntake = await performQuery(currentIntakeQuery, null, req);
    const { hiddenCode } = currentIntake.data.openIntake;
    const { ccbcIntakeNumber } = currentIntake.data.openIntake;
    const intakeRowId = currentIntake.data.openIntake.rowId;
    const userRowId = currentIntake.data.session.ccbcUserBySub.rowId;
    if (hiddenCode !== code || ccbcIntakeNumber !== parsedIntake) {
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
