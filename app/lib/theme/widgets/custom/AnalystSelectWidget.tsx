import { WidgetProps } from '@rjsf/core';
import { useFragment, graphql } from 'react-relay';
import { AnalystSelectWidget_query$key } from '__generated__/AnalystSelectWidget_query.graphql';
import SelectWidget from '../SelectWidget';

interface AnalaystSelectWidgetProps extends WidgetProps {
  children: React.ReactNode;
}

const AnalystSelectWidget: React.FC<AnalaystSelectWidgetProps> = (props) => {
  const { schema, value, formContext } = props;
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

  const customOption = isInactiveOption && (
    <option style={{ display: 'none' }} value={value}>
      {value}
    </option>
  );

  return (
    <SelectWidget
      {...props}
      placeholder="Something to go here"
      schema={{ ...schema, enum: options }}
      customOption={customOption}
    />
  );
};

export default AnalystSelectWidget;
