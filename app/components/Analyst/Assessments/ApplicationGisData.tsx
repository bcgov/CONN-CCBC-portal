import styled from 'styled-components';

const StyledContainer = styled.section`
  background: ${(props) => props.theme.color.backgroundGrey};
  padding: 16px;
  border: 1.5px solid ${(props) => props.theme.color.components};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  overflow-x: scroll;
  width: 100%;
  position: relative;
  padding-top: 32px;

  display: flex;
  flex-direction: column;

  ${(props) => props.theme.breakpoint.largeUp} {
    flex-direction: row;
    padding-right: 128px;

    & table:first-child {
      margin-right: 16px;
    }
  }
`;

const StyledTable = styled.table`
  th {
    font-weight: 700;
    vertical-align: bottom;
    border-bottom: 0;

    & div {
      font-weight: 400;
    }
  }

  td {
    text-align: right;
    border-bottom: 0;
    white-space: nowrap;
  }

  th,
  td {
    padding: 4px 8px;
  }
`;

const StyledFirstTHead = styled.thead`
  white-space: nowrap;
  th {
    text-align: right;
    border-bottom: 1px solid #757575;
  }

  & th:first-child {
    border-bottom: none;
  }
`;

const StyledSecondTHead = styled.thead`
  th {
    text-align: center;
    border-bottom: 1px solid #757575;
  }
`;

const StyledLastUpdated = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
`;

interface Props {
  gisData: any;
}

const ApplicationGisData: React.FC<Props> = ({ gisData }) => {
  // const [eligible, setEligible] = useState();
  // const [eligibleIndigenous, setEligibleIndigenous] = useState();
  const {
    GIS_PERCENT_OVERBUILD,
    GIS_PERCENT_OVERLAP,
    GIS_TOTAL_ELIGIBLE_HH,
    GIS_TOTAL_ELIGIBLE_INDIG_HH,
    GIS_TOTAL_HH,
    GIS_TOTAL_INDIG_HH,
    GIS_TOTAL_INELIGIBLE_HH,
  } = gisData;

  return (
    <StyledContainer>
      <StyledTable>
        <StyledFirstTHead>
          <th aria-hidden />
          <th>
            Eligible <div>(Underserved)</div>
          </th>
          <th>
            Ineligible <div>(Pending & Served)</div>
          </th>
          <th>Total</th>
        </StyledFirstTHead>
        <tr>
          <td>GIS Analysis</td>
          <td>{GIS_TOTAL_ELIGIBLE_HH && GIS_TOTAL_ELIGIBLE_HH.toFixed(2)}</td>
          <td>
            {GIS_TOTAL_INELIGIBLE_HH && GIS_TOTAL_INELIGIBLE_HH.toFixed(2)}
          </td>
          <td>{GIS_TOTAL_HH && GIS_TOTAL_HH.toFixed(2)}</td>
        </tr>
        <tr>
          <td>In application</td>
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td>placeholder</td>
          <td />
          <td />
          <td />
        </tr>
      </StyledTable>
      <StyledTable>
        <StyledSecondTHead>
          <th>Eligible Indigenous</th>
          <th>Total Indigenous</th>
          <th>Overbuild</th>
          <th>Overlap</th>
        </StyledSecondTHead>
        <tr>
          <td>{GIS_TOTAL_ELIGIBLE_INDIG_HH}</td>
          <td>{GIS_TOTAL_INDIG_HH}</td>
          <td>{GIS_PERCENT_OVERBUILD}</td>
          <td>{GIS_PERCENT_OVERLAP}</td>
        </tr>
        <tr>
          <td />
          <td>placeholder</td>
          <td />
          <td />
        </tr>
        <tr>
          <td>placeholder</td>
          <td />
          <td />
          <td />
        </tr>
      </StyledTable>
      <StyledLastUpdated>
        GIS analysis last updated: <br />
        2023-03-01 12:00:00
      </StyledLastUpdated>
    </StyledContainer>
  );
};

export default ApplicationGisData;
