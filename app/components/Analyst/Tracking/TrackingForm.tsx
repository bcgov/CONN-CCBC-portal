import { useState } from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
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

const StyledHeader = styled(BaseAccordion.Header)`
  border-bottom: 1px solid #d6d6d6;
  margin-bottom: 16px;
`;

const StyledBaseAccordion = styled(BaseAccordion)`
  border: none;

  h2 {
    margin-bottom: 0;
    display: flex;
    align-items: center;
    font-size: 24px;
  }

  header {
    padding-bottom: 0px;
  }

  // Some overrides for widget styles
  & div > div {
    margin: 0px;
  }

  .pg-select-wrapper {
    width: 100%;
    margin: 8px 0 !important;
  }

  .file-widget {
    margin-bottom: 8px;
    min-width: 340px;
  }

  .datepicker-widget {
    width: 100%;
  }
`;

const StyledToggleRight = styled(ToggleRight)`
  display: flex;
`;

const StyledBtn = styled(Button)`
  margin: 8px;
`;

const TrackingForm: React.FC<Props> = ({
  schema,
  title,
  uiSchema,
  ...rest
}) => {
  const [newFormData, setNewFormData] = useState({});

  return (
    <StyledBaseAccordion onToggle={() => {}} {...rest} defaultToggled>
      <StyledHeader>
        <h2>{title}</h2>
        <StyledToggleRight>
          <StyledBtn size="small">Save</StyledBtn>
          <StyledBtn size="small" variant="secondary">
            Cancel
          </StyledBtn>
          <BaseAccordion.ToggleOff>
            <FontAwesomeIcon icon={faPlus} fixedWidth />
          </BaseAccordion.ToggleOff>
          <BaseAccordion.ToggleOn>
            <FontAwesomeIcon icon={faMinus} fixedWidth />
          </BaseAccordion.ToggleOn>
        </StyledToggleRight>
      </StyledHeader>
      <BaseAccordion.Content>
        <FormBase
          schema={schema}
          uiSchema={uiSchema}
          noValidate
          formData={newFormData}
          theme={TrackingTheme}
          omitExtraData={false}
          onChange={(e) => {
            setNewFormData({ ...e.formData });
          }}
          // eslint-disable-next-line react/no-children-prop
          children
        />
      </BaseAccordion.Content>
    </StyledBaseAccordion>
  );
};
export default TrackingForm;
