import { WidgetProps } from '@rjsf/core';
import { useFragment, graphql } from 'react-relay';
import { Dropdown } from '@button-inc/bcgov-theme';
import styled from 'styled-components';
import { AnalystSelectWidget_query$key } from '__generated__/AnalystSelectWidget_query.graphql';

const StyledSelect = styled(Dropdown)`
  .pg-select-wrapper {
    margin: 12px 0;
    width: ${(props) => props.theme.width.inputWidthSmall};
  }
  .pg-select-wrapper:after {
    margin: 0.3em 0;
  }
  & select {
    margin: 0.25em 0;
  }

  select:disabled {
    background: inherit;
    border: 1px solid rgba(96, 96, 96, 0.3);
    opacity: 0;
  }

  & div:first-child {
    background: ${(props) => props.disabled && 'rgba(196, 196, 196, 0.3)'};
    border: ${(props) => props.disabled && ' 1px solid rgba(96, 96, 96, 0.3)'};
  }
`;

const AnalystSelectWidget: React.FC<WidgetProps> = (props) => {
  const {
    id,
    disabled,
    onChange,
    label,
    value,
    required,
    placeholder,
    formContext,
  } = props;
  const { allAnalysts } = useFragment<AnalystSelectWidget_query$key>(
    graphql`
      fragment AnalystSelectWidget_query on Query {
        allAnalysts(orderBy: NATURAL, condition: { active: true }) {
          nodes {
            rowId
            givenName
            familyName
          }
        }
      }
    `,
    formContext.query
  );

  const options = allAnalysts.nodes.map(
    (analyst) => `${analyst.givenName} ${analyst.familyName}`
  );

  const isInactiveOption =
    options.findIndex(
      // return true if an analyst matches or no assigned lead
      (analyst) => analyst === value || !value
    ) === -1;

  return (
    <StyledSelect
      id={id}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value || undefined)
      }
      disabled={disabled}
      placeholder={placeholder}
      size="medium"
      required={required}
      value={value}
      aria-label={label}
    >
      <option key={`option-placeholder-${id}`} value={undefined}>
        {placeholder}
      </option>
      {options &&
        options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      {isInactiveOption && (
        <option style={{ display: 'none' }} value={value}>
          {value}
        </option>
      )}
    </StyledSelect>
  );
};

export default AnalystSelectWidget;
