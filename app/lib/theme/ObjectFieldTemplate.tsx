import styled from 'styled-components';
import { ObjectFieldTemplateProps } from '@rjsf/utils';
import FormBorder from './components/FormBorder';
import Description from './components/Description';

const StyledColumn = styled('div')`
  input,
  select {
    min-width: 100%;
  }
  padding: 0;

  div:first-child {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    min-height: 100%;
  }

  & label {
    min-height: 100%;
    display: flex;
  }
`;

const StyledLabel = styled('div')`
  margin-bottom: 4px;
`;

const StyledGrid = styled('div')`
  display: grid;
  min-width: 100%;
`;

const ObjectFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  uiSchema,
  schema,
  description,
  title,
  properties,
}) => {
  const uiInline = Array.isArray(uiSchema['ui:inline'])
    ? uiSchema['ui:inline']
    : [];

  const getInlineKeys = () => {
    // Get array of inline keys so we can see if field exists in grid so we don't render it twice.
    const inlineKeys: string[] = [];

    uiInline?.map((row: Record<string, string>) => {
      const rowKeys = Object.keys(row);
      return inlineKeys.push(...rowKeys);
    });

    return inlineKeys;
  };

  const inlineKeys = getInlineKeys();
  return (
    <FormBorder
      title={uiSchema['ui:subtitle'] ?? uiSchema['ui:title'] ?? title}
      subtitle={uiSchema['ui:subtitle']}
    >
      <Description rawDescription={description} schema={schema} />

      {uiInline?.map((row: any, i: number) => {
        const rowKeys = Object.keys(row);

        // check if row is in current page (props.properties) schema
        const rowTitle =
          properties.filter((prop: any) => Object.keys(row).includes(prop.name))
            .length > 1;

        const columns = row?.columns;
        const mapRow = (
          <StyledGrid
            style={{ gridTemplateColumns: `repeat(${columns || 1}, 1fr)` }}
          >
            {rowKeys.map((fieldName) => {
              const content = properties.find(
                (prop: any) => prop.name === fieldName
              )?.content;

              if (content) {
                if (columns === 1) {
                  return <div key={fieldName}>{content}</div>;
                }
                return (
                  <StyledColumn
                    style={{
                      gridColumn: row[fieldName],
                      marginRight: Object.keys(row).length > 2 ? '1em' : 0,
                    }}
                    key={fieldName}
                  >
                    {content}
                  </StyledColumn>
                );
              }
              return null;
            })}
          </StyledGrid>
        );
        return (
          <div key={rowKeys[i]}>
            {rowTitle && row.title && (
              <>
                {row.headline ? (
                  <h3>{row.title}</h3>
                ) : (
                  <StyledLabel>{row.title}</StyledLabel>
                )}
              </>
            )}

            {mapRow}
          </div>
        );
      })}

      {properties.map((prop: any) => {
        const isInlineItem = inlineKeys.find((key) => key === prop.name);
        if (isInlineItem) return null;

        return prop.content;
      })}
    </FormBorder>
  );
};

export default ObjectFieldTemplate;
