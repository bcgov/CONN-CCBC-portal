import { WidgetProps } from '@rjsf/utils';
import Checkbox from '@button-inc/bcgov-theme/Checkbox';
import styled from 'styled-components';
import kmzAndPdfLinks from 'data/zoneKmzLinksIntake3';
import kmzAndPdfLinksIntake4 from 'data/zoneKmzLinksIntake4';

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.links};
  text-decoration-line: underline;
`;

const StyledDiv = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;

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

const StyledContainer = styled('div')`
  margin-top: 8px;
  margin-bottom: 16px;
`;

const CheckboxesWidget: React.FC<WidgetProps> = ({
  disabled,
  id,
  onChange,
  label,
  options,
  value,
  required,
  formContext,
}) => {
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
    4: kmzAndPdfLinksIntake4,
    5: kmzAndPdfLinksIntake4,
  };

  const downloadLinks = downloadLinksDict[intakeNumber];

  const { enumOptions, singleSelection, kmzLink }: any = options;

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
    <StyledContainer>
      {enumOptions?.map(
        (option: { value: string; label: string }, i: number) => {
          const checked = value.indexOf(option.value) !== -1;
          return (
            <StyledDiv
              key={option.value}
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
  );
};

export default CheckboxesWidget;
