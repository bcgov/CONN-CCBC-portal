import styled from 'styled-components';
import { useCreateAssessmentMutation } from '../../schema/mutations/assessment/createAssessment';

const StyledDropdown = styled.select`
  text-overflow: ellipsis;
  max-width: 100%;

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

  let backgroundColor: string;
  let color = '#FFFFFF';
  let border = '3px';
  let borderRadius = '5px';
  if (jsonData?.nextStep === 'Assessment complete') {
    backgroundColor = '#2E8540';
    if (jsonData?.decision?.length > 0) {
      backgroundColor = '#345FA9';
    }
  } else if (jsonData?.nextStep === 'Needs RFI') {
    color = '#313132';
    backgroundColor = '#F8E78F';
  } else if ((jsonData?.nextStep === 'Not started' && lead) || lead) {
    backgroundColor = '#DBE6F0';
    color = '#313132';
  } else if (jsonData?.nextStep === 'Needs 2nd review') {
    backgroundColor = '#F8E78F';
    color = '#313132';
  } else {
    backgroundColor = 'inherit';
    color = 'inherit';
    border = 'none';
    borderRadius = 'unset';
  }

  return (
    <StyledDropdown
      data-testid="assign-lead"
      onChange={handleChange}
      style={{ backgroundColor, color, border, borderRadius }}
    >
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
