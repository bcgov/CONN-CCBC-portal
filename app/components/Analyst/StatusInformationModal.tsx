import Image from 'next/image';
import styled from 'styled-components';
import Chip from '@mui/material/Chip';
import Modal from 'components/Modal';

const StyledTable = styled.table`
  border: none;
  margin-left: auto;
  margin-right: auto;
  max-width: 1000px;
  padding-right: 75px;
  padding-left: 75px;
  th,
  td {
    border: none;
    padding-bottom: 2px;
    padding-top: 2px;
  }
`;

interface Props {
  id?: string;
  title?: string;
  close: () => void;
  isOpen: boolean;
}

const StatusInformationModal: React.FC<Props> = ({
  id = 'status-information-modal',
  title = 'Description of Statuses and Triggers',
  isOpen,
  close,
}) => {
  return (
    <Modal id={id} onClose={close} open={isOpen} title={title}>
      <div style={{ height: '150px' }}>
        <Image
          src="/images/stateMachine.svg"
          alt="The happy path for a project from application to completion. The external status is what an applicant sees and the internal status is what you the analyst sees. After an intake closes, both internal and external status are Received. After eligibility screening is assigned, the internal status can be changed to Screening but the external status remains Received. After it is determined to be eligible, the internal status can be changed to Assessment but the external status remains Received. If it is in the selection package for the Minister, the internal status can be changed to Recommendation but the external status remains Received. After the Minister states Approved in Annex A of the selection package, the internal status can be changed to Conditionally Approved. The external status can only be changed to Conditionally Approved when the applicant responds to the Letter of Conditional Approval, accepting the offer. When the Funding Agreement is signed by both the Recipient and the Province, the internal and external statuses can be changed to Agreement Signed. After a final implementation report is received and the final claim is processed, both statuses can be changed to Complete."
          width={1000}
          height={150}
        />
      </div>
      <div>
        <StyledTable>
          <thead>
            <tr>
              <th
                style={{ fontFamily: 'BCSans, Verdana, Arial, sans-serif' }}
                colSpan={2}
              >
                Other statuses
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Chip
                  label="On hold"
                  sx={{
                    bgcolor: '#FFECC2',
                    color: '#A37000',
                    fontFamily: 'BCSans, Verdana, Arial, sans-serif',
                  }}
                />
              </td>
              <td>
                Application is not rejected, but is not being actively reviewed.
                For example, an applicant has been given 30 days to send a
                community letter of support, and they haven&apos;t finished by
                the deadline.
              </td>
            </tr>
            <tr>
              <td>
                <Chip
                  label="Closed"
                  sx={{
                    bgcolor: '#E8E8E8',
                    color: '#414141',
                    fontFamily: 'BCSans, Verdana, Arial, sans-serif',
                  }}
                />
              </td>
              <td>
                Application rejected, not eligible, or not longer being
                processed.
              </td>
            </tr>
            <tr>
              <td>
                <Chip
                  label="Withdrawn"
                  sx={{
                    bgcolor: '#E8E8E8',
                    color: '#414141',
                    fontFamily: 'BCSans, Verdana, Arial, sans-serif',
                  }}
                />
              </td>
              <td>
                Applicant has withdrawn their submitted application and should
                not be reviewed or assessed by NWBC and ISED.
              </td>
            </tr>
            <tr>
              <td>
                <Chip
                  label="Cancelled"
                  sx={{
                    bgcolor: '#E8E8E8',
                    color: '#414141',
                    fontFamily: 'BCSans, Verdana, Arial, sans-serif',
                  }}
                />
              </td>
              <td>Project deliverables not achieved.</td>
            </tr>
            <tr>
              <td>
                <Chip
                  label="Draft"
                  sx={{
                    bgcolor: '#606060e6',
                    color: '#FFFFFF',
                    fontFamily: 'BCSans, Verdana, Arial, sans-serif',
                  }}
                />
              </td>
              <td>
                Applicant has created an application, visible only to
                applicants.
              </td>
            </tr>
            <tr>
              <td>
                <Chip
                  label="Submitted"
                  sx={{
                    bgcolor: '#345FA9',
                    color: '#FFFFFF',
                    fontFamily: 'BCSans, Verdana, Arial, sans-serif',
                  }}
                />
              </td>
              <td>
                Application submitted on final page of form, but can still be
                edited until the intake closes.
              </td>
            </tr>
          </tbody>
        </StyledTable>
      </div>
    </Modal>
  );
};

export default StatusInformationModal;
