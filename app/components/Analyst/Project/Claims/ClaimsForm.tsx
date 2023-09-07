import { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import { ConnectionHandler, graphql, useFragment } from 'react-relay';
import claimsSchema from 'formSchema/analyst/claims';
import claimsUiSchema from 'formSchema/uiSchema/analyst/claimsUiSchema';
import { useCreateClaimsMutation } from 'schema/mutations/project/createClaimsData';
import { useArchiveApplicationClaimsDataMutation as useArchiveClaims } from 'schema/mutations/project/archiveApplicationClaimsData';
import excelValidateGenerator from 'lib/helpers/excelValidate';
import Toast from 'components/Toast';
import Modal from 'components/Modal';
import ClaimsView from './ClaimsView';
import ProjectTheme from '../ProjectTheme';
import ProjectForm from '../ProjectForm';
import AddButton from '../AddButton';

const StyledContainer = styled.div`
  text-align: center;
  max-width: 400px;

  p {
    margin-top: 16px;
  }
`;

const StyledProjectForm = styled(ProjectForm)`
  .datepicker-widget {
    width: 180px;
    margin-bottom: 0px;
  }
`;

const StyledFlex = styled.div`
  display: flex;
  justify-content: center;

  button:first-child {
    margin-right: 16px;
  }
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

const ClaimsForm = ({ application }) => {
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
  const [showModal, setShowModal] = useState(false);
  // store the current community progress data node for edit mode so we have access to row id and relay connection
  const [currentClaimsData, setCurrentClaimsData] = useState(null);
  const [isFormEditMode, setIsFormEditMode] = useState(false);
  const [createClaims] = useCreateClaimsMutation();
  const [archiveClaims] = useArchiveClaims();
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);
  // use this to live validate the form after the first submit attempt
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [claimsValidationErrors, setClaimsValidationErrors] = useState([]);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

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
        setShowModal(false);
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
      <Modal
        open={showModal}
        onClose={() => {
          setCurrentClaimsData(null);
          setShowModal(false);
        }}
        title="Delete"
      >
        <StyledContainer>
          <p>
            Are you sure you want to delete this claim & progress report and all
            accompanying data?
          </p>
          <StyledFlex>
            <Button onClick={handleDelete}>Yes, delete</Button>
            <Button onClick={() => setShowModal(false)} variant="secondary">
              No, keep
            </Button>
          </StyledFlex>
        </StyledContainer>
      </Modal>
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
        isFormAnimated
        hiddenSubmitRef={hiddenSubmitRef}
        isFormEditMode={isFormEditMode}
        setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
        saveBtnText={
          formData?.claimsFile && excelFile ? 'Save & Import' : 'Save'
        }
        title="Claims"
        handleChange={(e) => {
          setFormData({ ...e.formData });
        }}
        submitting={isFormSubmitting}
        submittingText="Importing claim data. Please wait."
        showEditBtn={false}
        saveBtnDisabled={isFormSubmitting}
        cancelBtnDisabled={isFormSubmitting}
        resetFormData={handleResetFormData}
        liveValidate={isSubmitAttempted}
        setFormData={setFormData}
        before={
          <AddButton
            isFormEditMode={isFormEditMode}
            onClick={() => {
              setCurrentClaimsData(null);
              setIsSubmitAttempted(false);
              setIsFormEditMode(true);
            }}
            title="Add claim"
          />
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
                setShowModal(true);
                setCurrentClaimsData(node);
              }}
              onFormEdit={() => {
                setFormData(node.jsonData);
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
