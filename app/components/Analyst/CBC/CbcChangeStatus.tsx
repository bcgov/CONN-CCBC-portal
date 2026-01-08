import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import statusStyles from 'data/statusStyles';
import { useUpdateCbcDataByRowIdMutation } from 'schema/mutations/cbc/updateCbcData';
import { useState } from 'react';

interface DropdownProps {
  statusStyles: {
    primary: string;
    backgroundColor: string;
    pillWidth: string;
  };
}

const StyledDropdown = styled.select<DropdownProps>`
  color: ${(props) => props.statusStyles?.primary};
  border: none;
  border-radius: 16px;
  appearance: none;
  padding: 6px 12px;
  height: 32px;
  width: ${(props) => props.statusStyles?.pillWidth};
  background: ${(props) => `
  ${props.statusStyles?.backgroundColor} url("data:image/svg+xml;utf8,
  <svg viewBox='0 0 140 140' width='24' height='24' xmlns='http://www.w3.org/2000/svg'>
    <g><path d='m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z' fill='${props.statusStyles?.primary.replace('#', '%23')}'/></g>
  </svg>")
  no-repeat;
`};
  background-position: right 5px top 5px;

  :focus {
    outline: none;
  }
`;

const StyledOption = styled.option`
  color: ${(props) => props.theme.color.text};
  background-color: ${(props) => props.theme.color.white};
`;

const getStatus = (status) => {
  if (status === 'Conditionally Approved') {
    return 'conditionally_approved';
  }
  if (status === 'Reporting Complete') {
    return 'complete';
  }
  if (status === 'Agreement Signed') {
    return 'approved';
  }
  return status?.toLowerCase();
};

const convertToCbcStatus = (status) => {
  if (status === 'conditionally_approved') {
    return 'Conditionally Approved';
  }
  if (status === 'complete') {
    return 'Reporting Complete';
  }
  if (status === 'approved') {
    return 'Agreement Signed';
  }
  if (status === 'withdrawn') {
    return 'Withdrawn';
  }
  return status?.toLowerCase();
};

interface Props {
  cbc: any;
  status: string;
  statusList: any;
  isFormEditable: boolean;
}

const CbcChangeStatus: React.FC<Props> = ({
  cbc,
  status,
  statusList,
  isFormEditable,
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment CbcChangeStatus_query on Cbc {
        cbcDataByCbcId(first: 500) @connection(key: "CbcData__cbcDataByCbcId") {
          __id
          edges {
            node {
              id
              jsonData
              sharepointTimestamp
              rowId
              projectNumber
              updatedAt
              updatedBy
            }
          }
        }
      }
    `,
    cbc
  );
  const [updateStatus] = useUpdateCbcDataByRowIdMutation();
  const [currentStatus, setCurrentStatus] = useState(getStatus(status));

  const handleChange = (e) => {
    const newStatus = e.target.value;
    const cbcDataId = queryFragment?.cbcDataByCbcId?.edges[0].node.rowId;
    updateStatus({
      variables: {
        input: {
          rowId: cbcDataId,
          cbcDataPatch: {
            jsonData: {
              ...queryFragment?.cbcDataByCbcId?.edges[0].node.jsonData,
              projectStatus: convertToCbcStatus(newStatus),
            },
          },
        },
      },
      onCompleted: () => {
        setCurrentStatus(newStatus);
      },
      debounceKey: 'cbc_change_status',
    });
  };

  return (
    <StyledDropdown
      data-testid="change-status"
      onChange={(e) => {
        // eslint-disable-next-line no-void
        void (() => handleChange(e))();
      }}
      statusStyles={statusStyles[getStatus(status)]}
      value={currentStatus}
      id="change-status"
    >
      {statusList?.map((statusType) => {
        const { description, name, id } = statusType;

        return (
          <StyledOption value={name} key={id} disabled={!isFormEditable}>
            {description}
          </StyledOption>
        );
      })}
    </StyledDropdown>
  );
};

export default CbcChangeStatus;
