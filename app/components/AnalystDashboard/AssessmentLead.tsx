import styled from 'styled-components';
import { useCreateAssessmentMutation } from '../../schema/mutations/assessment/createAssessment';

const StyledDropdown = styled.select`
  text-overflow: ellipsis;
  background-color: inherit;
  border: none;
  max-width: 100%;
  margin-left: -4px; // Optical - to align with the table header cell

  &:focus {
    border: none;
    outline: none;
  }
`;

interface Props {
  allAnalysts: any;
  applicationId: number;
  assessmentType: string;
  jsonData: any;
}

const AssignLead: React.FC<Props> = ({
  allAnalysts,
  applicationId,
  assessmentType,
  jsonData,
}) => {
  const [createAssessment] = useCreateAssessmentMutation();
  const handleChange = (e) => {
    const analyst = e.target.value;
    const newJsonData = {
      ...jsonData,
      assignedTo: analyst,
    };

    createAssessment({
      variables: {
        input: {
          _assessmentType: assessmentType,
          _jsonData: newJsonData,
          _applicationId: applicationId,
        },
      },
    });
  };

  const lead = jsonData?.assignedTo;

  const analystList = Object.keys(allAnalysts);

  return (
    <StyledDropdown data-testid="assign-lead" onChange={handleChange}>
      <option key="Unassigned" selected={!lead} value={null}>
        Unassigned
      </option>
      {analystList.map((analystKey) => {
        const analyst = allAnalysts[analystKey]?.node;
        const analystName = `${analyst.givenName} ${analyst.familyName}`;
        if (analyst.active || lead === analystName) {
          return (
            <option
              key={analystName}
              value={analyst.rowId}
              selected={lead === analystName}
              disabled={!analyst.active}
              hidden={!analyst.active}
            >
              {analystName}
            </option>
          );
        }
        return null;
      })}
    </StyledDropdown>
  );
};

export default AssignLead;
