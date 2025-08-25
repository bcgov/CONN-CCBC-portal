import styled from 'styled-components';
import { ObjectFieldTemplateProps } from '@rjsf/utils';

interface FlexProps {
  children?: React.ReactNode;
  direction: string;
}

const StyledFlex = styled.div<FlexProps>`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  & input {
    margin-right: 16px;
  }

  ${(props) => props.theme.breakpoint.mediumUp} {
    flex-direction: ${(props) =>
      props.direction ? props.direction : 'column'};
    gap: 8px;
    .pg-select-wrapper {
      width: 100%;
      min-width: 180px;
    }
  }

  .datepicker-widget {
    margin-bottom: 16px;
  }
`;

const StyledGrid = styled('div')`
  display: grid;
  min-width: 100%;
`;

const ProjectObjectFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  uiSchema,
  properties,
}) => {
  const uiOptions = uiSchema['ui:options'];
  const flexDirection = uiOptions?.flexDirection || 'column';
  const before = uiSchema?.['ui:before'];

  const uiInline = Array.isArray(uiSchema['ui:inline'])
    ? uiSchema['ui:inline']
    : [];

  const getInlineKeys = () => {
    // Get array of inline keys so we can see if field exists in grid so we don't render it twice.
    const inlineKeys: string[] = [];

    // eslint-disable-next-line array-callback-return
    uiInline.map((row: Record<string, string>) => {
      const rowKeys = Object.keys(row);
      inlineKeys.push(...rowKeys);
    });

    return inlineKeys;
  };

  const inlineKeys = getInlineKeys();

  return (
    <StyledFlex direction={String(flexDirection)}>
      {before}
      {uiInline.map((row: any, i: number) => {
        const rowKeys = Object.keys(row);

        const columns = row?.columns;
        const mapRow = (
          <StyledGrid
            style={{ gridTemplateColumns: `repeat(${columns || 1}, 1fr)` }}
          >
            {
              // eslint-disable-next-line array-callback-return, consistent-return
              rowKeys.map((fieldName) => {
                const content = properties.find(
                  (prop: any) => prop.name === fieldName
                )?.content;

                if (content) {
                  if (columns === 1) {
                    return <div key={fieldName}>{content}</div>;
                  }
                  return (
                    <div key={fieldName} style={{ paddingRight: '4px' }}>
                      {content}
                    </div>
                  );
                }
              })
            }
          </StyledGrid>
        );
        return <div key={rowKeys[i]}>{mapRow}</div>;
      })}

      {
        // eslint-disable-next-line array-callback-return, consistent-return
        properties.map((prop: any) => {
          const isInlineItem = inlineKeys.find((key) => key === prop.name);
          if (!isInlineItem) {
            return prop.content;
          }
        })
      }
    </StyledFlex>
  );
};

export default ProjectObjectFieldTemplate;
