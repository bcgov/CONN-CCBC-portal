import { WidgetProps } from '@rjsf/utils';
import styled from 'styled-components';
import { StyledSourceSpan } from './DefaultWidget';

const LinkArrayWidget: React.FC<WidgetProps> = ({
  value,
  formContext,
  name,
  uiSchema,
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
  const StyledHint = styled.span`
    display: block;
    margin-top: 4px;
    margin-bottom: ${(props) => props.theme.spacing.large};
    color: ${(props) => props.theme.color.darkGrey};
    font-style: italic;
    font-size: 13px;
  `;
  const StyledLinksContainer = styled.div`
    margin-bottom: 16px;
  `;

  const help = uiSchema?.['ui:help'];
  const hasLinks = Array.isArray(value) && value.length > 0;
  const displayValue = hasLinks ? value : value?.toString() || undefined;

  return (
    <StyledLinksContainer>
      {hasLinks
        ? value.map((item, index) => (
            <>
              {item.link ? (
                <StyledLink
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.name}
                </StyledLink>
              ) : (
                <span>{item.name}</span>
              )}
              {index < value.length - 1 ? ', ' : ''}
            </>
          ))
        : displayValue}
      {formContext?.formDataSource?.[name] &&
        value !== null &&
        typeof value !== 'undefined' && (
          <StyledSourceSpan>
            {` (${formContext.formDataSource?.[name]})`}
          </StyledSourceSpan>
        )}
      {help && <StyledHint>{help}</StyledHint>}
    </StyledLinksContainer>
  );
};

export default LinkArrayWidget;
