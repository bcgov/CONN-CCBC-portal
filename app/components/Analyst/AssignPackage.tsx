import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import { useCreatePackageMutation } from 'schema/mutations/application/createPackage';

interface StyledDropdownProps {
  children?: React.ReactNode;
  id?: string;
  onChange?: (e: any) => void;
  'data-testid'?: string;
}

const StyledDropdown = styled.select<StyledDropdownProps>`
  text-overflow: ellipsis;
  color: ${(props) => props.theme.color.links};
  background-color: ${(props) => props.theme.color.white};
  border: 1px solid ${(props) => props.theme.color.borderGrey};
  padding: 0 8px;
  max-width: 100%;
  border-radius: 4px;
`;

const AssignPackage = ({ application }) => {
  const queryFragment = useFragment(
    graphql`
      fragment AssignPackage_query on Application {
        rowId
        applicationPackagesByApplicationId(orderBy: CREATED_AT_DESC, first: 1) {
          nodes {
            package
          }
        }
      }
    `,
    application
  );
  const { applicationPackagesByApplicationId, rowId } = queryFragment;
  const applicationPackage =
    applicationPackagesByApplicationId.nodes?.[0]?.package;

  const [createPackage] = useCreatePackageMutation();

  const handleAssignPackage = (e) => {
    const packageNumber = parseInt(e.target.value, 10) || null;

    createPackage({
      variables: {
        input: {
          _applicationId: rowId,
          _package: packageNumber,
        },
      },
    });
  };

  const options = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <StyledDropdown
      id="assign-package"
      onChange={handleAssignPackage}
      data-testid="assign-package"
    >
      {options.map((option) => {
        return (
          <option
            key={option}
            value={option}
            selected={applicationPackage === option}
          >
            {option}
          </option>
        );
      })}
    </StyledDropdown>
  );
};

export default AssignPackage;
