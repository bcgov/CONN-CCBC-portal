import styled from 'styled-components';
import FormBase from 'components/Form/FormBase';
import rfiSchema from 'formSchema/analyst/rfiSchema';
import { rfiViewUiSchema } from 'formSchema/uiSchema/analyst/rfiUiSchema';
import RfiTheme from 'components/Analyst/RFI/RfiTheme';

interface Props {
  formData: any;
  rowId: number;
  rfiNumber: string;
  status: string;
}

const StyledContainer = styled.div`
  margin: 24px 0;
  border-top: 1px solid #d6d6d6;
`;

const StyledH4 = styled.h4`
  margin: 24px 0;
  font-weight: 400;
  font-size: 21px;
`;

const Hidden = () => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};

const RFI: React.FC<Props> = ({ formData, rfiNumber }) => {
  return (
    <StyledContainer>
      <StyledH4>{rfiNumber}</StyledH4>
      <FormBase
        theme={{
          ...RfiTheme,
          widgets: {
            ...RfiTheme.widgets,
            CheckboxWidget: Hidden,
          },
        }}
        schema={rfiSchema}
        uiSchema={rfiViewUiSchema}
        formData={formData}
        noValidate
        tagName="div"
        // Pass children to hide submit button
        // eslint-disable-next-line react/no-children-prop
        children
      />
    </StyledContainer>
  );
};

export default RFI;
