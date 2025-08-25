import { WidgetProps } from '@rjsf/utils';
import Checkbox from '@button-inc/bcgov-theme/Checkbox';
import styled from 'styled-components';
import kmzAndPdfLinks from 'data/zoneKmzLinksIntake3';
import kmzAndPdfLinksIntake4And5 from 'data/zoneKmzLinksIntake4And5';

interface StyledLinkProps {
  children?: React.ReactNode;
  target?: string;
  href?: string;
}

const StyledLink = styled('a')<StyledLinkProps>`
  margin: 0 8px;
  text-decoration: underline;
`;

interface StyledDivProps {
  children?: React.ReactNode;
  direction: 'row' | 'column';
  style?: React.CSSProperties;
}

const StyledDiv = styled.div<StyledDivProps>`
  display: flex;
  flex-direction: ${(props) => props.direction};
  align-items: ${(props) =>
    props.direction === 'row' ? 'center' : 'flex-start'};
  margin-top: 8px;
  margin-right: ${(props) => (props.direction === 'row' ? 'none' : '24px')};

  & span {
    border-radius: 2px;
  }

  & label {
    padding-left: 1em;
  }

  & div {
    padding-right: 8px;
  }
`;

interface StyledContainerProps {
  children?: React.ReactNode;
  direction: 'row' | 'column';
}

const StyledContainer = styled.div<StyledContainerProps>`
  margin-top: 8px;
  margin-bottom: 16px;
  display: ${(props) => (props.direction === 'row' ? 'auto' : 'flex')};
`;

interface StyledRowProps {
  children?: React.ReactNode;
  reviewEditMode: boolean;
}

const StyledRow = styled.div<StyledRowProps>`
  border-top: ${(props) =>
    props.reviewEditMode ? '1px solid rgba(0, 0, 0, 0.16)' : 'none'};
  padding: ${(props) =>
    props.reviewEditMode ? props.theme.spacing.medium : 'inherit'};
`;

const CheckboxesWidget: React.FC<WidgetProps> = ({
  disabled,
  id,
  onChange,
  uiSchema,
  label,
  options,
  value,
  required,
  formContext,
}) => {
  const reviewEditMode =
    formContext.reviewMode && uiSchema?.['ui:hidetitleineditmode'];

  function selectValue(val: any, selected: any, all: any) {
    const at = all.indexOf(val);
    const updated = selected.slice(0, at).concat(val, selected.slice(at));
    return updated.sort((a: any, b: any) => all.indexOf(a) > all.indexOf(b));
  }

  function deselectValue(val: any, selected: any) {
    return selected.filter((v: any) => v !== val);
  }

  const intakeNumber = formContext?.intakeNumber;

  const downloadLinksDict = {
    3: kmzAndPdfLinks,
    4: kmzAndPdfLinksIntake4And5,
    5: kmzAndPdfLinksIntake4And5,
  };

  const downloadLinks = downloadLinksDict[intakeNumber];

  const {
    enumOptions,
    singleSelection,
    kmzLink,
    checkboxDirection = 'row',
  }: any = options;

  const handleCheckboxChange = (option: any, checked: boolean) => {
    if (singleSelection) {
      onChange(checked ? [option.value] : []);
    } else {
      const all = enumOptions.map((enumOption: any) => enumOption.value);
      if (checked) {
        onChange(selectValue(option.value, value, all));
      } else {
        onChange(deselectValue(option.value, value));
      }
    }
  };

  return (
    <StyledRow reviewEditMode={reviewEditMode}>
      {reviewEditMode && label}
      <StyledContainer direction={checkboxDirection}>
        {enumOptions?.map(
          (option: { value: string; label: string }, i: number) => {
            const checked = value.indexOf(option.value) !== -1;
            return (
              <StyledDiv
                key={option.value}
                direction={checkboxDirection}
                style={{ opacity: disabled && '0.6' }}
              >
                <Checkbox
                  id={`${id}-${i}`}
                  onChange={(event: any) =>
                    handleCheckboxChange(option, event.target.checked)
                  }
                  checked={checked}
                  value={value}
                  required={required}
                  aria-label={label}
                  disabled={disabled}
                />
                <div>{option.label}</div>
                {kmzLink && downloadLinks?.[parseInt(option.value, 10)] && (
                  <div>
                    <StyledLink
                      target="_blank"
                      href={downloadLinks?.[parseInt(option.value, 10)]?.kmz}
                    >
                      kmz
                    </StyledLink>
                    |
                    <StyledLink
                      target="_blank"
                      href={downloadLinks?.[parseInt(option.value, 10)]?.pdf}
                    >
                      pdf
                    </StyledLink>
                  </div>
                )}
              </StyledDiv>
            );
          }
        )}
      </StyledContainer>
    </StyledRow>
  );
};

export default CheckboxesWidget;
