import { WidgetProps } from '@rjsf/core';
import { useFragment, graphql } from 'react-relay';
import { AnalystSelectWidget_query$key } from '__generated__/AnalystSelectWidget_query.graphql';
import SelectWidget from '../SelectWidget';

const AnalystSelectWidget: React.FC<WidgetProps> = (props) => {
  const { formContext, schema } = props;
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

  return <SelectWidget {...props} schema={{ ...schema, enum: options }} />;
};

export default AnalystSelectWidget;
