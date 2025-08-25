import styled from 'styled-components';
import { DateTime } from 'luxon';

interface Props {
  altOptionalText: string;
  createdAt: string;
  htmlFor: string;
  hideOptional: boolean;
  label: string;
  required: boolean;
  showCreatedAt?: boolean;
  tagName?: 'label' | 'dt';
  bold: boolean;
}

const StyledFlex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${(props) => props.theme.breakpoint.smallUp} {
    flex-direction: row;
  }
`;

interface StyledDateProps {
  children: React.ReactNode;
  'data-testid'?: string;
}

const StyledDate = styled.div<StyledDateProps>`
  font-weight: 700;
  font-size: 14px;
`;
interface LabelProps {
  bold?: boolean;
  children?: React.ReactNode;
  htmlFor?: string;
}

const StyledLabel = styled.label<LabelProps>`
  font-weight: ${(props) => (props.bold ? 700 : 400)};
`;

const FieldLabel: React.FC<Props> = ({
  altOptionalText,
  bold,
  createdAt,
  hideOptional,
  htmlFor,
  label,
  required,
  showCreatedAt,
  tagName = 'label',
}) => {
  if (!label) {
    return null;
  }
  const optionalText = ` (${altOptionalText || 'optional'})`;
  const displayedLabel = `${
    label + (required || hideOptional ? '' : optionalText)
  } `;

  const createdAtFormatted =
    createdAt &&
    DateTime.fromISO(createdAt).toLocaleString(DateTime.DATETIME_MED);
  if (showCreatedAt && createdAt)
    return (
      <StyledFlex>
        <StyledLabel htmlFor={htmlFor} bold={bold}>
          {displayedLabel}
        </StyledLabel>
        <StyledDate data-testid="last-updated">
          Last updated: {createdAtFormatted}
        </StyledDate>
      </StyledFlex>
    );

  if (tagName === 'label')
    return (
      <StyledLabel htmlFor={htmlFor} bold={bold}>
        {displayedLabel}
      </StyledLabel>
    );

  return <dt>{displayedLabel}</dt>;
};

export default FieldLabel;
