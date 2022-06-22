import Grid from '@button-inc/bcgov-theme/Grid';
import FormBorder from './components/FormBorder';
import styled from 'styled-components';

const DefaultDescriptionField = (props: {
  id: string;
  description: string;
}) => <span id={props.id}>{props.description}</span>;

const StyledInline = styled('div')`
  display: flex;
  input {
    min-width: 90%;
  }
`;

const StyledFull = styled('div')`
  input {
    min-width: 50%;
  }
`;

const StyledLabel = styled('div')`
  margin-bottom: 4px;
`;

const ObjectFieldTemplate = (props: any) => {
  const DescriptionField = props.DescriptionField || DefaultDescriptionField;

  const getInlineKeys = () => {
    // Get array of inline keys so we can see if field exists in grid so we don't render it twice.
    const inlineKeys: string[] = [];

    props.uiSchema['ui:inline'].map((row: any) => {
      const rowKeys = Object.keys(row);
      inlineKeys.push(...rowKeys);
    });

    return inlineKeys;
  };

  const inlineKeys = getInlineKeys();

  return (
    <Grid cols={10}>
      <Grid.Row>
        <FormBorder
          title={
            props.uiSchema['ui:subtitle'] ||
            props.uiSchema['ui:title'] ||
            props.title
          }
          subtitle={props.uiSchema['ui:subtitle'] && true}
        >
          {props.description && (
            <h3>
              <DescriptionField
                id={`${props.idSchema.$id}__description`}
                description={props.description}
                formContext={props.formContext}
              />
            </h3>
          )}

          {props.properties.map((prop: any) => {
            const isInlineItem = inlineKeys.find((key) => key === prop.name);
            if (!isInlineItem) {
              return prop.content;
            }
          })}

          {props.uiSchema['ui:inline'].map((row: any, i: number) => {
            // check if row is in current page (props.properties) schema
            const title =
              props.properties.filter((prop: any) =>
                Object.keys(row).includes(prop.name)
              ).length > 1;

            // Check if row contains a single or 'full' element
            const isFull = row[Object.keys(row)[0]] === 'full';

            const mapRow = Object.keys(row).map((fieldName) => {
              return (
                <div key={fieldName}>
                  {
                    props.properties.find(
                      (prop: any) => prop.name === fieldName
                    )?.content
                  }
                </div>
              );
            });
            return (
              <div key={i}>
                {title && row.title && <StyledLabel>{row.title}</StyledLabel>}

                {isFull && <StyledFull>{mapRow}</StyledFull>}
                {!isFull && <StyledInline>{mapRow}</StyledInline>}
              </div>
            );
          })}
        </FormBorder>
      </Grid.Row>
    </Grid>
  );
};

export default ObjectFieldTemplate;
