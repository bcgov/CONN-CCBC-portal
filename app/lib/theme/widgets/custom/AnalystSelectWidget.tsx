import { WidgetProps } from '@rjsf/core';
import { useFragment, graphql } from 'react-relay';
import { AnalystSelectWidgetFragment_query$key } from '__generated__/AnalystSelectWidgetFragment_query.graphql';
import SelectWidget from '../SelectWidget';

const AnalystSelectWidget: React.FC<WidgetProps> = (props) => {
  const { formContext, schema } = props;
  const { allAnalysts } = useFragment<AnalystSelectWidgetFragment_query$key>(
    graphql`
      fragment AnalystSelectWidget_query on Query {
        allAnalysts(orderBy: NATURAL) {
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
