import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import { useCreateProjectTypeMutation } from 'schema/mutations/application/createProjectType';

const StyledDropdown = styled.select`
  text-overflow: ellipsis;
  color: ${(props) => props.theme.color.links};
  background-color: ${(props) => props.theme.color.white};
  border: 1px solid ${(props) => props.theme.color.borderGrey};
  padding: 0 8px;
  max-width: 100%;
  border-radius: 4px;
`;

const AssignProjectType = ({ application }) => {
  const queryFragment = useFragment(
    graphql`
      fragment AssignProjectType_query on Application {
        rowId
        applicationProjectTypesByApplicationId(
          orderBy: CREATED_AT_DESC
          first: 1
        ) {
          nodes {
            id
            projectType
          }
        }
      }
    `,
    application
  );
  const { applicationProjectTypesByApplicationId, rowId } = queryFragment;
  const { id, projectType: applicationProjectType } =
    applicationProjectTypesByApplicationId.nodes?.[0] || {};

  const [createProjectType] = useCreateProjectTypeMutation();

  const handleAssignProjectType = (e) => {
    const projectType = e.target.value || null;

    createProjectType({
      variables: {
        input: {
          _applicationId: rowId,
          _projectType: projectType,
        },
      },
      updater: (store) => {
        const record = store.get(id);
        record.setValue(projectType, 'projectType');
      },
    });
  };

  const options = [
    { key: null, value: null },
    { key: 'Last Mile', value: 'lastMile' },
    { key: 'Last-Mile & Transport', value: 'lastMileAndTransport' },
    { key: 'Transport', value: 'transport' },
  ];
  return (
    <StyledDropdown
      id="assign-project-type"
      onChange={handleAssignProjectType}
      data-testid="assign-project_type"
    >
      {options.map((option) => {
        return (
          <option
            key={option.key}
            value={option.value}
            selected={applicationProjectType === option.value}
          >
            {option.key}
          </option>
        );
      })}
    </StyledDropdown>
  );
};

export default AssignProjectType;
