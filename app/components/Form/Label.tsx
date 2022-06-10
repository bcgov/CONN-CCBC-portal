import styled from 'styled-components';
const StyledLabel = styled('label')``;

const Label = ({ children }: any) => {
  return <StyledLabel>{children}</StyledLabel>;
};

export default Label;
