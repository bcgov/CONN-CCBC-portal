import styled from 'styled-components';

const StyledLabel = styled('label')`
  color: ${(props) => props.theme.color.descriptionGrey};
`;

const Label = ({ children }: any) => {
  return <StyledLabel>{children}</StyledLabel>;
};

export default Label;
