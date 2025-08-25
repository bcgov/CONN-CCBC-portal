import styled from 'styled-components';
import assessmentPillStyles from 'data/assessmentPillStyles';
import { useCreateAssessmentMutation } from 'schema/mutations/assessment/createAssessment';
import { useEffect, useState } from 'react';

interface StyledDropdownProps {
  children?: React.ReactNode;
  'data-testid'?: string;
  onChange?: (e: any) => void;
  style?: React.CSSProperties;
}

const StyledDropdown = styled.select<StyledDropdownProps>`
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
  assessmentConnection: any;
}

const AssignLead: React.FC<Props> = ({
  allAnalysts,
  applicationId,
  assessmentType,
  jsonData,
  assessmentConnection,
}) => {
  const [createAssessment] = useCreateAssessmentMutation();
  const [leadState, setLeadState] = useState(null);

  useEffect(() => {
    setLeadState(
      jsonData?.assignedTo === '' || jsonData?.assignedTo === 'Unassigned'
        ? null
        : jsonData?.assignedTo
    );
  }, [jsonData]);

  const handleChange = (e) => {
    const analyst = e.target.value === '' ? null : e.target.value;
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
        connections: [assessmentConnection],
      },
    });
  };

  const analystList = Object.keys(allAnalysts);

  let backgroundColor: string;
  let color = '#FFFFFF';
  let border = '3px';
  let borderRadius = '5px';
  if (jsonData?.nextStep === 'Assessment complete') {
    backgroundColor =
      assessmentPillStyles['Assessment complete'].backgroundColor;
  } else if (jsonData?.nextStep === 'Needs RFI') {
    color = assessmentPillStyles['Needs RFI'].primary;
    backgroundColor = assessmentPillStyles['Needs RFI'].backgroundColor;
  } else if (jsonData?.nextStep === 'Needs 2nd review') {
    backgroundColor = assessmentPillStyles['Needs 2nd review'].backgroundColor;
    color = assessmentPillStyles['Needs 2nd review'].primary;
    // Assigned
  } else if ((jsonData?.nextStep === 'Not started' && leadState) || leadState) {
    backgroundColor = assessmentPillStyles.Assigned.backgroundColor;
    color = assessmentPillStyles.Assigned.primary;
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
      <option key="Unassigned" selected={!leadState} value={null}>
        {/* Empty Label */}
      </option>
      {analystList.map((analystKey) => {
        const analyst = allAnalysts[analystKey]?.node;
        const analystName = `${analyst.givenName} ${analyst.familyName}`;
        if (analyst.active || leadState === analystName) {
          return (
            <option
              key={analystName}
              value={analystName}
              selected={leadState?.trim() === analystName.trim()}
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
