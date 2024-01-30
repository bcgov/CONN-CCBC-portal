import React, { useState } from 'react';
import styled from 'styled-components';
import { dashboardQuery$data } from '__generated__/dashboardQuery.graphql';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Row from './Row';
import ArchiveModal from './ArchiveModal';
import WithdrawModal from './WithdrawModal';

const StyledFontAwesome = styled(FontAwesomeIcon)`
  margin-left: 4px; ;
`;

const StyledTable = styled('table')`
  margin-bottom: 0px;
`;

const StyledTableHead = styled('thead')``;

const StyledTableHeadCell = styled('th')`
  padding: 12px;

  background: rgba(49, 49, 50, 0.1);
  &:first-child {
    padding: 12px;
  }
  &:last-child {
    padding: 12px;
    box-shadow: none;
  }
  font-weight: bold;

  box-shadow: inset -2px 0px white;
`;

type Props = {
  applications: Pick<dashboardQuery$data, 'allApplications'>;
};

const Table = ({ applications }: Props) => {
  const [currentApplication, setCurrentApplication] = useState(null);
  const [archiveId, setArchiveId] = useState({ rowId: null, id: null });

  const applicationNodes = applications.allApplications.edges
    .map((edge) => edge.node)
    .filter((node) => node !== null);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);

  return (
    <>
      <StyledTable>
        <StyledTableHead>
          <tr>
            <StyledTableHeadCell>
              CCBC ID
              <Tooltip title="A CCBC ID will be assigned when you submit the application">
                <StyledFontAwesome
                  icon={faCircleInfo}
                  fixedWidth
                  size="sm"
                  color="#345FA9"
                />
              </Tooltip>
            </StyledTableHeadCell>
            <StyledTableHeadCell>Intake</StyledTableHeadCell>
            <StyledTableHeadCell>Project title</StyledTableHeadCell>
            <StyledTableHeadCell>Status</StyledTableHeadCell>
            <StyledTableHeadCell>Actions</StyledTableHeadCell>
          </tr>
        </StyledTableHead>
        <tbody>
          {applicationNodes.map((application) => {
            return application ? (
              <Row
                application={application}
                key={application.owner}
                schema={application.formData.formByFormSchemaId.jsonSchema}
                onWithdraw={() => {
                  setCurrentApplication(application);
                  setWithdrawModalOpen(true);
                }}
                onDelete={() => {
                  setArchiveId({
                    rowId: application.rowId,
                    id: application.id,
                  });
                  setArchiveModalOpen(true);
                }}
              />
            ) : null;
          })}
        </tbody>
      </StyledTable>
      <ArchiveModal
        applications={applications}
        id={archiveId}
        modalOpen={archiveModalOpen}
        setModalOpen={setArchiveModalOpen}
      />
      <WithdrawModal
        application={currentApplication}
        setApplication={setCurrentApplication}
        modalOpen={withdrawModalOpen}
        setModalOpen={setWithdrawModalOpen}
      />
    </>
  );
};

export default Table;
