import styled from 'styled-components';

interface Props {
  action: string;
  communities: any[];
  isCbc?: boolean;
}

interface TableProps {
  children?: React.ReactNode;
  isCbc: boolean;
  isDeleted?: boolean;
}

interface StyledContainerProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const StyledCommunitiesContainer = styled.div<StyledContainerProps>`
  display: flex;
  align-items: center;
`;

const StyledLeftContainer = styled.div<TableProps>`
  padding-right: 2%;
  width: ${(props) => (props.isCbc ? '250px' : '300px')};
`;

const StyledTable = styled.table<TableProps>`
  th {
    border: none;
  }
  tbody > tr {
    border-bottom: thin dashed;
    text-decoration: ${(props) => (props.isDeleted ? 'line-through' : 'none')};
    border-color: ${(props) => props.theme.color.borderGrey};
    td {
      width: ${(props) => (props.isCbc ? '200px' : '350px')};
      max-width: ${(props) => (props.isCbc ? '200px' : '350px')};
      border: none;
    }
  }
`;

const StyledIdCell = styled.td`
  width: 100px !important;
  max-width: 100px;
`;

const CommunitiesHistoryTable: React.FC<Props> = ({
  action,
  communities,
  isCbc = true,
}) => {
  return (
    <StyledCommunitiesContainer
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <StyledLeftContainer
        isCbc={isCbc}
        isDeleted={action === 'Deleted'}
      >{`${action} community location data`}</StyledLeftContainer>
      <div>
        <StyledTable isCbc={isCbc} isDeleted={action === 'Deleted'}>
          <thead>
            <tr>
              <th>Economic Region</th>
              <th>Regional District</th>
              {isCbc && <th>Geographic Name</th>}
              {isCbc && <th>Type</th>}
              {isCbc && <th>ID</th>}
            </tr>
          </thead>
          <tbody>
            {communities?.map((community, index) => (
              <tr
                // eslint-disable-next-line react/no-array-index-key
                key={`${action}-${community.communities_source_data_id}-${index}`}
                data-key={`${action}-row-${index}`}
              >
                <td>{community.economic_region}</td>
                <td>{community.regional_district}</td>
                {isCbc && <td>{community.bc_geographic_name}</td>}
                {isCbc && <td>{community.geographic_type}</td>}
                {isCbc && (
                  <StyledIdCell>
                    {community.communities_source_data_id}
                  </StyledIdCell>
                )}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </div>
    </StyledCommunitiesContainer>
  );
};

export default CommunitiesHistoryTable;
