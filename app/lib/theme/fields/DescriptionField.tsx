import styled from 'styled-components';
const StyledDiv = styled('div')`
  font-size: 21px;
  font-weight: 400;
  line-height: 24.61px;
`;

const DescriptionField = ({ id, description }: any) => {
  if (!description) {
    return null;
  }

  return <StyledDiv id={id}>{description}</StyledDiv>;
};

export default DescriptionField;
