import { graphql, useFragment } from 'react-relay';
import statusStyles from 'data/statusStyles';
import { useUpdateCbcDataByRowIdMutation } from 'schema/mutations/cbc/updateCbcData';
import { useEffect, useState } from 'react';
import {
  StyledStatusPillDropdown as StyledDropdown,
  StyledStatusPillDropdownOption as StyledOption,
} from 'components/Analyst/StyledStatusPillDropdown';

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
  const normalizedFromProp = getStatus(status);
  const [currentStatus, setCurrentStatus] = useState(normalizedFromProp);

  useEffect(() => {
    setCurrentStatus(getStatus(status));
  }, [status]);

  const pillStyles =
    statusStyles[currentStatus as keyof typeof statusStyles] ??
    statusStyles[normalizedFromProp as keyof typeof statusStyles] ??
    statusStyles.closed;

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
      $statusStyles={pillStyles}
      value={currentStatus ?? ''}
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
