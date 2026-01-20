import { useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { ConnectionHandler, graphql, useFragment } from 'react-relay';
import isEqual from 'lodash.isequal';
import claimsSchema from 'formSchema/analyst/claims';
import claimsUiSchema from 'formSchema/uiSchema/analyst/claimsUiSchema';
import { useCreateClaimsMutation } from 'schema/mutations/project/createClaimsData';
import { useArchiveApplicationClaimsDataMutation as useArchiveClaims } from 'schema/mutations/project/archiveApplicationClaimsData';
import excelValidateGenerator from 'lib/helpers/excelValidate';
import Toast from 'components/Toast';
import useModal from 'lib/helpers/useModal';
import useEmailNotification from 'lib/helpers/useEmailNotification';
import ClaimsView from './ClaimsView';
import ProjectTheme from '../ProjectTheme';
import ProjectForm from '../ProjectForm';
import AddButton from '../AddButton';
import MetabaseLink from '../ProjectInformation/MetabaseLink';
import ReportDeleteConfirmationModal from '../ReportDeleteConfirmationModal';

const StyledProjectForm = styled(ProjectForm)`
  .datepicker-widget {
    width: 180px;
    margin-bottom: 0px;
  }
`;

const StyledFlexDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 8px;
  padding-left: 4px;
`;

const FormHeader = (
  <div>
    <p>
      Claims & progress reports are submitted by recipients for incurred or paid
      expenses during the previous quarter(s). While they are due 45 days after
      that quarter ends, recipients do not always submit claim & progress
      reports every quarter.{' '}
    </p>
    <p>
      All processing of claims takes place outside of the CCBC portal. After a
      claim is processed and paid, please upload the finalized and completed
      claim Excel file here.
    </p>
  </div>
);

interface FormData {
  claimsFile?: any;
  fromDate?: string;
  toDate?: string;
}

interface Props {
  application: any;
  isExpanded?: boolean;
}

const ClaimsForm: React.FC<Props> = ({ application, isExpanded }) => {
  const queryFragment = useFragment(
    graphql`
      fragment ClaimsForm_application on Application {
        id
        rowId
        ccbcNumber
        applicationClaimsDataByApplicationId(
          filter: { archivedAt: { isNull: true } }
          first: 1000
        ) @connection(key: "ClaimsForm_applicationClaimsDataByApplicationId") {
          __id
          edges {
            node {
              __id
              id
              rowId
              jsonData
              excelDataId
              applicationByApplicationId {
                applicationClaimsExcelDataByApplicationId {
                  nodes {
                    rowId
                    jsonData
                  }
                }
              }
              ...ClaimsView_query
            }
          }
        }
        ccbcNumber
      }
    `,
    application
  );
  const {
    applicationClaimsDataByApplicationId: claimsData,
    rowId: applicationRowId,
    ccbcNumber,
  } = queryFragment;

  const [formData, setFormData] = useState({} as FormData);
  const [initialFormData, setInitialFormData] = useState({} as FormData);
  // store the current community progress data node for edit mode so we have access to row id and relay connection
  const [currentClaimsData, setCurrentClaimsData] = useState(null);
  const [isFormEditMode, setIsFormEditMode] = useState(false);
  const [createClaims] = useCreateClaimsMutation();
  const [archiveClaims] = useArchiveClaims();
  const { notifyDocumentUpload } = useEmailNotification();
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);
  // use this to live validate the form after the first submit attempt
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [claimsValidationErrors, setClaimsValidationErrors] = useState([]);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const isFormDirty = useMemo(() => {
    return !isEqual(formData, initialFormData);
  }, [formData, initialFormData]);

  const deleteConfirmationModal = useModal();

  const claimsConnectionId = claimsData?.__id;

  const claimsList = claimsData?.edges?.filter((data) => {
    // filter null nodes from the list caused by relay connection update
    return data.node !== null;
  });

  const claimsListWithExcelData = claimsList?.map((edge) => {
    const excelData =
      edge?.node?.applicationByApplicationId?.applicationClaimsExcelDataByApplicationId?.nodes?.find(
        (node) => node.rowId === edge.node.excelDataId
      );
    return {
      ...edge,
      node: {
        ...edge.node,
        excelData,
      },
    };
  });

  const sortedClaimsList = claimsListWithExcelData?.sort((a, b) => {
    const claimA = a.node.excelData?.jsonData?.claimNumber;
    const claimB = b.node.excelData?.jsonData?.claimNumber;

    return claimB - claimA;
  });

  const apiPath = `/api/analyst/claims/${applicationRowId}/${ccbcNumber}/${currentClaimsData?.rowId}/${currentClaimsData?.excelDataId}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateClaims = useCallback(
    excelValidateGenerator(apiPath, setExcelFile, setClaimsValidationErrors),
    [apiPath, setExcelFile]
  );

  const handleResetFormData = () => {
    setCurrentClaimsData(null);
    setIsFormEditMode(false);
    setFormData({} as FormData);
    setInitialFormData({} as FormData);
    setIsSubmitAttempted(false);
    setExcelFile(null);
    setShowToast(false);
  };

  const handleSubmit = async (e) => {
    hiddenSubmitRef.current.click();
    e.preventDefault();
    setIsSubmitAttempted(true);
    /*   if (!formData?.fromDate) return; */
    setIsFormSubmitting(true);

    validateClaims(excelFile, false).then((res) => {
      // get the excel data row i from the response or the current claims data
      const responseExcelDataId =
        res?.result?.data.createApplicationClaimsExcelData
          ?.applicationClaimsExcelData?.rowId;

      // get the excel data row id from the current claims if it exists
      const currentExcelDataId = currentClaimsData?.excelDataId;

      // replace the current excel data id if a new excel file was uploaded since the previous data will be archived
      const excelDataId = responseExcelDataId || currentExcelDataId;

      /// save form data
      createClaims({
        variables: {
          connections: [claimsConnectionId],
          input: {
            _jsonData: formData,
            _applicationId: applicationRowId,
            _oldClaimsId: currentClaimsData?.rowId,
            _excelDataId: excelDataId,
          },
        },
        onCompleted: () => {
          handleResetFormData();
          setIsFormSubmitting(false);

          if (res?.status === 200) {
            setShowToast(true);
            notifyDocumentUpload(applicationRowId, {
              documentType: 'Claim & Progress Report',
              ccbcNumber,
              documentNames: [excelFile.name],
            });
          }
        },
        onError: () => {
          setIsFormSubmitting(false);
        },
        updater: (store) => {
          if (currentClaimsData?.id) {
            const connection = store.get(claimsConnectionId);

            store.delete(currentClaimsData.id);
            ConnectionHandler.deleteNode(connection, currentClaimsData.id);
          }
        },
      });
    });
  };

  const handleDelete = async () => {
    archiveClaims({
      variables: {
        input: {
          _claimsDataId: currentClaimsData?.rowId,
        },
      },
      updater: (store) => {
        const claimConnectionId = currentClaimsData?.__id;
        const connection = store.get(claimConnectionId);

        store.delete(claimConnectionId);
        ConnectionHandler.deleteNode(connection, claimConnectionId);
      },
      onCompleted: () => {
        deleteConfirmationModal.close();
        setCurrentClaimsData(null);
      },
    });
  };

  return (
    <>
      {showToast && (
        <Toast timeout={5000}>
          Claims & progress report excel data successfully imported
        </Toast>
      )}
      <ReportDeleteConfirmationModal
        {...deleteConfirmationModal}
        id="claims-progress-report-delete-confirm-dialog"
        onClose={() => {
          setCurrentClaimsData(null);
          deleteConfirmationModal.close();
        }}
        onConfirm={handleDelete}
        reportType="claim & progress"
      />

      <StyledProjectForm
        additionalContext={{
          applicationId: applicationRowId,
          validateExcel: validateClaims,
          excelValidationErrors: claimsValidationErrors,
        }}
        schema={claimsSchema}
        uiSchema={claimsUiSchema}
        formData={formData}
        formHeader={FormHeader}
        theme={ProjectTheme}
        onSubmit={handleSubmit}
        formAnimationHeight={600}
        formAnimationHeightOffset={claimsList.length > 0 ? 70 : 20}
        isExpanded={isExpanded}
        isFormAnimated
        hiddenSubmitRef={hiddenSubmitRef}
        isFormEditMode={isFormEditMode}
        setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
        saveBtnText={
          formData?.claimsFile && excelFile ? 'Save & Import' : 'Save'
        }
        title="Claims & progress reports"
        handleChange={(e) => {
          setFormData({ ...e.formData });
        }}
        submitting={isFormSubmitting}
        submittingText="Importing claim data. Please wait."
        showEditBtn={false}
        saveBtnDisabled={isFormSubmitting || !isFormDirty}
        cancelBtnDisabled={isFormSubmitting}
        resetFormData={handleResetFormData}
        liveValidate={isSubmitAttempted}
        setFormData={setFormData}
        before={
          <StyledFlexDiv>
            <AddButton
              isFormEditMode={isFormEditMode}
              onClick={() => {
                setCurrentClaimsData(null);
                setInitialFormData({} as FormData);
                setIsSubmitAttempted(false);
                setIsFormEditMode(true);
              }}
              title="Add claim"
            />
            {!isFormEditMode && claimsList?.length > 0 && (
              <MetabaseLink
                href={` https://ccbc-metabase.apps.silver.devops.gov.bc.ca/dashboard/98-claims-report-prod?ccbc_number=${ccbcNumber}`}
                text="View project data in Metabase"
                testHref={`https://ccbc-metabase.apps.silver.devops.gov.bc.ca/dashboard/97-claim-report-dashboard-test?ccbc_number =${ccbcNumber}`}
              />
            )}
          </StyledFlexDiv>
        }
        saveDataTestId="save-claims data"
      >
        {sortedClaimsList?.map(({ node }) => {
          return (
            <ClaimsView
              key={node.id}
              claim={node}
              isFormEditMode={isFormEditMode}
              onShowDeleteModal={() => {
                deleteConfirmationModal.open();
                setCurrentClaimsData(node);
              }}
              onFormEdit={() => {
                setFormData(node.jsonData);
                setInitialFormData(node.jsonData);
                setCurrentClaimsData(node);
                setIsFormEditMode(true);
              }}
            />
          );
        })}
      </StyledProjectForm>
    </>
  );
};

export default ClaimsForm;
