import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { BaseAccordion } from '@button-inc/bcgov-theme/Accordion';
import { FormBase } from 'components/Form';
import type { JSONSchema7 } from 'json-schema';
import TrackingTheme from './TrackingTheme';

interface Props {
  schema: JSONSchema7;
  title: string;
  uiSchema?: any;
}

const ToggleRight = styled.div`
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  font-size: 2em;
`;

const StyledBaseAccordion = styled(BaseAccordion)`
  border: none;
  border-bottom: 1px solid #d6d6d6;
  h2 {
    margin-bottom: 0;
    display: flex;
    align-items: center;
    font-size: 24px;
  }

  header {
    padding-bottom: 12.5px;
  }
`;

const StyledToggleRight = styled(ToggleRight)`
  display: flex;
`;

const TrackingForm: React.FC<Props> = ({
  schema,
  title,
  uiSchema,
  ...rest
}) => {
  const handleSubmit = async () => {};

  return (
    <StyledBaseAccordion onToggle={() => {}} {...rest}>
      <BaseAccordion.Header>
        <h2>{title}</h2>
        <StyledToggleRight>
          <BaseAccordion.ToggleOff>
            <FontAwesomeIcon icon={faPlus} fixedWidth />
          </BaseAccordion.ToggleOff>
          <BaseAccordion.ToggleOn>
            <FontAwesomeIcon icon={faMinus} fixedWidth />
          </BaseAccordion.ToggleOn>
        </StyledToggleRight>
      </BaseAccordion.Header>
      <BaseAccordion.Content>
        <FormBase
          schema={schema}
          uiSchema={uiSchema}
          noValidate
          theme={TrackingTheme}
          omitExtraData={false}
          onSubmit={handleSubmit}
        />
      </BaseAccordion.Content>
    </StyledBaseAccordion>
  );
};
export default TrackingForm;
