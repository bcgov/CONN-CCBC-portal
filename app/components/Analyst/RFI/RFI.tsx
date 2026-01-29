import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import { IChangeEvent } from '@rjsf/core';
import FormBase from 'components/Form/FormBase';
import rfiSchema from 'formSchema/analyst/rfiSchema';
import { rfiViewUiSchema } from 'formSchema/uiSchema/analyst/rfiUiSchema';
import { RfiViewTheme } from 'components/Analyst/RFI/RfiTheme';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useUpdateRfiJsonDataMutation } from 'schema/mutations/application/updateRfiJsonData';
import useEmailNotification from 'lib/helpers/useEmailNotification';

interface Props {
  id: string;
  rfiDataByRfiDataId: any;
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

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: baseline;
  gap: 24px;
  // justify-content: space-between;
`;

const StyledFontAwesome = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.color.links};
  cursor: pointer;
`;

const RFI: React.FC<Props> = ({ rfiDataByRfiDataId, id }) => {
  const router = useRouter();
  const applicationId = router.query.applicationId as string;

  const queryFragment = useFragment(
    graphql`
      fragment RFI_query on RfiData {
        jsonData
        rfiNumber
        rowId
        applicationByApplicationId {
          ccbcNumber
          rowId
        }
      }
    `,
    rfiDataByRfiDataId
  );

  const { jsonData, rfiNumber, rowId } = queryFragment;
  const ccbcNumber = queryFragment.applicationByApplicationId?.ccbcNumber;
  const appRowId = queryFragment.applicationByApplicationId?.rowId;

  const [updateRfiJsonData] = useUpdateRfiJsonDataMutation();
  const { notifyDocumentUpload } = useEmailNotification();

  const handleClickEditButton = () => {
    router.push(`/analyst/application/${applicationId}/rfi/${rowId}`);
  };

  const handleChange = (e: IChangeEvent<any>) => {
    // Check if email correspondence files were uploaded
    const oldEmailFiles = jsonData?.rfiEmailCorrespondance || [];
    const newEmailFiles = e.formData?.rfiEmailCorrespondance || [];
    
    // Detect new file uploads
    const hasNewFiles = newEmailFiles.length > oldEmailFiles.length;
    const newFiles = hasNewFiles 
      ? newEmailFiles.slice(oldEmailFiles.length) 
      : [];

    updateRfiJsonData({
      variables: {
        input: {
          id,
          rfiDataPatch: {
            jsonData: e.formData,
          },
        },
      },
      optimisticResponse: {
        jsonData: e.formData,
      },
      onCompleted: () => {
        // Send email notification if new files were uploaded
        if (hasNewFiles && newFiles.length > 0) {
          const fileNames = newFiles.map((file: any) => file.name);
          const fileDetails = newFiles.map((file: any) => ({
            name: file.name,
            type: file.type || 'Unknown',
            uploadedAt: file.uploadedAt,
          }));

          notifyDocumentUpload(appRowId?.toString() || applicationId, {
            ccbcNumber,
            documentType: 'Email Correspondence',
            documentNames: fileNames,
            fileDetails,
            timestamp: new Date().toLocaleString(),
            rfiNumber,
          });
        }
      },
      onError: (err) => {
        // eslint-disable-next-line no-console
        console.log('Error updating RFI', err);
      },
      updater: (store, data) => {
        store
          .get(rfiDataByRfiDataId.id)
          .setLinkedRecord(store.get(data.updateRfiData.rfiData.id), 'rfiData');
      },
    });
  };

  return (
    <StyledContainer>
      <HeadingContainer>
        <StyledH4>{rfiNumber}</StyledH4>
        <StyledFontAwesome
          aria-label={`Edit ${rfiNumber}`}
          onClick={handleClickEditButton}
          icon={faPen}
          fixedWidth
        />
      </HeadingContainer>
      <FormBase
        theme={RfiViewTheme}
        schema={rfiSchema}
        uiSchema={rfiViewUiSchema}
        onChange={handleChange}
        formData={jsonData}
        noValidate
        tagName="div"
        formContext={{ applicationId, rfiId: rowId, skipUnsavedWarning: true }}
        // Pass children to hide submit button
        // eslint-disable-next-line react/no-children-prop
        children
      />
    </StyledContainer>
  );
};

export default RFI;
