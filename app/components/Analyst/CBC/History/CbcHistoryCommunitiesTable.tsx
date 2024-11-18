import styled from 'styled-components';

interface Props {
  action: string;
  communities: any[];
}

const StyledCommunitiesContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledLeftContainer = styled.div`
  padding-right: 2%;
  width: 250px;
`;

const StyledTable = styled.table`
  th {
    border: none;
  }
  tbody > tr {
    border-bottom: thin dashed;
    border-color: ${(props) => props.theme.color.borderGrey};
    td {
      width: 200px;
      max-width: 200px;
      border: none;
    }
  }
`;

const StyledIdCell = styled.td`
  width: 100px !important;
  max-width: 100px;
`;

const CbcHistoryCommunitiesTable: React.FC<Props> = ({
  action,
  communities,
}) => {
  return (
    <StyledCommunitiesContainer
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <StyledLeftContainer>{`${action} community location data`}</StyledLeftContainer>
      <div>
        <StyledTable>
          <thead>
            <tr>
              <th>Economic Region</th>
              <th>Regional District</th>
              <th>Geographic Name</th>
              <th>Type</th>
              <th>ID</th>
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
                <td>{community.bc_geographic_name}</td>
                <td>{community.geographic_type}</td>
                <StyledIdCell>
                  {community.communities_source_data_id}
                </StyledIdCell>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </div>
    </StyledCommunitiesContainer>
  );
};

export default CbcHistoryCommunitiesTable;
