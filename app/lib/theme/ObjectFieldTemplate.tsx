import Grid from '@button-inc/bcgov-theme/Grid';
import FormBorder from './components/FormBorder';

const DefaultDescriptionField = (props: {
  id: string;
  description: string;
}) => <span id={props.id}>{props.description}</span>;

const ObjectFieldTemplate = (props: any) => {
  const DescriptionField = props.DescriptionField || DefaultDescriptionField;

  return (
    <Grid cols={10}>
      <Grid.Row>
        <Grid.Col span={10}>
          <FormBorder
            title={props.title ? props.title : props.uiSchema['ui:title']}
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
            {props.properties.map((prop: any) => prop.content)}
          </FormBorder>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
};

export default ObjectFieldTemplate;
