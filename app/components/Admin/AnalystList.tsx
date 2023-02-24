import styled from 'styled-components';
import { useUpdateAnalystMutation } from 'schema/mutations/analyst/updateAnalyst';
import AnalystListRow from './AnalystListRow';

interface Props {
  analysts: any;
}

const StyledTable = styled.table`
  max-width: 350px;

  & label {
    padding-left: 0em;
  }

  & th,
  td {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }

  // A lot of css to use border radius on a table:
  border-spacing: 0;
  border-collapse: separate;

  td {
    border-top: 0;
  }

  tr {
    td:nth-child(2) {
      border-left: 0;
    }
  }

  th:nth-child(1) {
    border-top-left-radius: 4px;
  }

  th:nth-child(2) {
    border-left: 0;
    text-align: center;
    border-top-right-radius: 4px;
  }

  tr:nth-last-child(1) {
    td:nth-child(1) {
      border-bottom-left-radius: 4px;
    }
    td:nth-child(2) {
      border-bottom-right-radius: 4px;
    }
  }
`;

const StyledTh = styled.th`
  background: ${(props) => props.theme.color.backgroundGrey};
  border: 1px #b9b9b9 solid;
`;

const AnalystList: React.FC<Props> = ({ analysts }) => {
  const [updateAnalyst] = useUpdateAnalystMutation();

  return (
    <StyledTable>
      <tr>
        <StyledTh>Analyst</StyledTh>
        <StyledTh>Active</StyledTh>
      </tr>
      {analysts &&
        analysts.map((analyst) => {
          const { familyName, givenName } = analyst;

          return (
            <AnalystListRow
              analyst={analyst}
              updateAnalyst={updateAnalyst}
              key={`${familyName} ${givenName}`}
            />
          );
        })}
    </StyledTable>
  );
};

export default AnalystList;
