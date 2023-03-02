import { WidgetProps } from '@rjsf/core';
import { useFragment, graphql } from 'react-relay';
import { AnalystSelectWidget_query$key } from '__generated__/AnalystSelectWidget_query.graphql';
import StyledSelect from '../../components/StyledDropdown';

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
