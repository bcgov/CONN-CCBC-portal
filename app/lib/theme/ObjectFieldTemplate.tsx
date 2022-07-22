import FormBorder from './components/FormBorder';
import styled from 'styled-components';
import { ObjectFieldTemplateProps } from '@rjsf/core';

const DefaultDescriptionField = (props: {
  id: string;
  description: string;
}) => <span id={props.id}>{props.description}</span>;

const StyledColumn = styled('div')`
  input,
  select {
    min-width: 100%;
  }
`;

const StyledLabel = styled('div')`
  margin-bottom: 4px;
`;

const StyledGrid = styled('div')`
  display: grid;
  min-width: 100%;
`;
const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
  const DescriptionField = props.DescriptionField || DefaultDescriptionField;
  const uiInline = props.uiSchema['ui:inline'];

  const getInlineKeys = () => {
    // Get array of inline keys so we can see if field exists in grid so we don't render it twice.
    const inlineKeys: string[] = [];

    uiInline &&
      uiInline.map((row: Record<string, string>) => {
        const rowKeys = Object.keys(row);
        inlineKeys.push(...rowKeys);
      });

    return inlineKeys;
  };

  const inlineKeys = getInlineKeys();
  return (
    <FormBorder
      title={
        props.uiSchema['ui:subtitle'] ||
        props.uiSchema['ui:title'] ||
        props.title
      }
      subtitle={props.uiSchema['ui:subtitle']}
    >
      {props.description && (
        <h3>
          <DescriptionField
            id={`${props.idSchema.$id}__description`}
            description={props.description}
          />
        </h3>
      )}

      {uiInline &&
        uiInline.map((row: any, i: number) => {
          const rowKeys = Object.keys(row);
          // check if row is in current page (props.properties) schema
          const title =
            props.properties.filter((prop: any) =>
              Object.keys(row).includes(prop.name)
            ).length > 1;

          const columns = row?.columns;
          const mapRow = (
            <StyledGrid
              style={{ gridTemplateColumns: `repeat(${columns || 1}, 1fr)` }}
            >
              {rowKeys.map((fieldName, i) => {
                const content = props.properties.find(
                  (prop: any) => prop.name === fieldName
                )?.content;

                if (content)
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
              })}
            </StyledGrid>
          );

          return (
            <div key={rowKeys[i]}>
              {title && row.title && <StyledLabel>{row.title}</StyledLabel>}

              {mapRow}
            </div>
          );
        })}

      {props.properties.map((prop: any) => {
        const isInlineItem = inlineKeys.find((key) => key === prop.name);
        if (!isInlineItem) {
          return prop.content;
        }
      })}
    </FormBorder>
  );
};

export default ObjectFieldTemplate;
