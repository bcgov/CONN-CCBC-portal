import { WidgetProps } from '@rjsf/utils';
import styled from 'styled-components';
import { StyledSourceSpan } from './DefaultWidget';

const LinkArrayWidget: React.FC<WidgetProps> = ({
  value,
  formContext,
  name,
}) => {
  const StyledLink = styled.a`
    color: ${(props) => props.theme.color.links};
    text-decoration-line: underline;
    word-break: break-word;
    width: fit-content;
    :hover {
      cursor: pointer;
    }
  `;
  return (
    <>
      {value &&
        Array.isArray(value) &&
        value.length > 0 &&
        value.map((item, index) => (
          <>
            <StyledLink
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.name}
            </StyledLink>
            {index < value.length - 1 ? ', ' : ''}
          </>
        ))}
      {formContext?.formDataSource?.[name] &&
        value !== null &&
        typeof value !== 'undefined' && (
          <StyledSourceSpan>
            {` (${formContext.formDataSource?.[name]})`}
          </StyledSourceSpan>
        )}
    </>
  );
};

export default LinkArrayWidget;
