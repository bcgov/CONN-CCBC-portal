import styled from 'styled-components';

const StyledLabel = styled('label')`
  color: rgba(49, 49, 50, 0.7);
  display: inline-block;
  margin-top: 8px;
  // color: ${(props) => props.theme.color.descriptionGrey};
`;

const Label = ({ children }: any) => <StyledLabel>{children}</StyledLabel>;

export default Label;
