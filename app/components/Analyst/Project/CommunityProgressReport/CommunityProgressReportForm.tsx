import { useCallback, useState } from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import { ConnectionHandler, graphql, useFragment } from 'react-relay';
import communityProgressReport from 'formSchema/analyst/communityProgressReport';
import communityProgressReportUiSchema from 'formSchema/uiSchema/analyst/communityProgressReportUiSchema';
import { useCreateCommunityProgressReportMutation } from 'schema/mutations/project/createCommunityProgressReport';
import { useArchiveApplicationCommunityProgressReportMutation as useArchiveCpr } from 'schema/mutations/project/archiveApplicationCommunityProgressReport';
import excelValidateGenerator from 'lib/helpers/excelValidate';
import Toast from 'components/Toast';
import Modal from 'components/Modal';
import CommunityProgressView from './CommunityProgressView';
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

const StyledFlex = styled.div`
  display: flex;
  justify-content: center;

  button:first-child {
    margin-right: 16px;
  }
`;

interface FormData {
  progressReportFile?: any;
  dueDate?: string;
  dateReceived?: string;
}

const CommunityProgressReportForm = ({ application }) => {
  const queryFragment = useFragment(
    graphql`
      fragment CommunityProgressReportForm_application on Application {
        id
        rowId
        applicationCommunityProgressReportDataByApplicationId(
          filter: { archivedAt: { isNull: true } }
          first: 1000
        )
          @connection(
            key: "CommunityProgressReportForm_applicationCommunityProgressReportDataByApplicationId"
          ) {
          __id
          edges {
            node {
              __id
              id
              rowId
              excelDataId
              jsonData
              ...CommunityProgressView_query
            }
          }
        }
        ccbcNumber
      }
    `,
    application
  );
  const {
    applicationCommunityProgressReportDataByApplicationId:
      communityProgressData,
    rowId: applicationRowId,
  } = queryFragment;

  const [formData, setFormData] = useState({} as FormData);
  const [showModal, setShowModal] = useState(false);
  // store the current community progress data node for edit mode so we have access to row id and relay connection
  const [currentCommunityProgressData, setCurrentCommunityProgressData] =
    useState(null);
  const [isFormEditMode, setIsFormEditMode] = useState(false);
  const [createCommunityProgressReport] =
    useCreateCommunityProgressReportMutation();
  const [archiveCommunityProgressReport] = useArchiveCpr();
  const [excelFile, setExcelFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [
    communityProgressValidationErrors,
    setCommunityProgressValidationErrors,
  ] = useState([]);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const communityProgressConnectionId = communityProgressData?.__id;
  const communityProgressList = communityProgressData?.edges
    ?.filter((data) => {
      // filter null nodes from the list caused by relay connection update
      return data.node !== null;
    })
    .sort((a, b) => {
      // sort by date received
      const dateA = new Date(a.node.jsonData.dueDate);
      const dateB = new Date(b.node.jsonData.dueDate);

      return dateB.getTime() - dateA.getTime();
    });

  const apiPath = `/api/analyst/community-report/${applicationRowId}/${currentCommunityProgressData?.rowId}`;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateCommunityReport = useCallback(
    excelValidateGenerator(
      apiPath,
      setExcelFile,
      setCommunityProgressValidationErrors
    ),
    [setExcelFile]
  );

  const handleResetFormData = () => {
    setIsFormEditMode(false);
    setFormData({} as FormData);
    setCurrentCommunityProgressData(null);
    setExcelFile(null);
    setShowToast(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitting(true);

    validateCommunityReport(excelFile, false).then((res) => {
      // get the excel data row i from the response or the current community progress data
      const responseExcelDataId =
        res?.result?.data.createApplicationCommunityReportExcelData
          ?.applicationCommunityReportExcelData?.rowId;

      // get the excel data row id from the current community progress data if it exists
      const currentExcelDataId = currentCommunityProgressData?.excelDataId;

      // replace the current excel data id if a new excel file was uploaded since the previous data will be archived
      const excelDataId = responseExcelDataId || currentExcelDataId;

      /// save form data
      createCommunityProgressReport({
        variables: {
          connections: [communityProgressConnectionId],
          input: {
            _jsonData: formData,
            _applicationId: applicationRowId,
            _oldCommunityProgressReportId: currentCommunityProgressData?.rowId,
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
          if (currentCommunityProgressData?.id) {
            const connection = store.get(communityProgressConnectionId);

            store.delete(currentCommunityProgressData.id);
            ConnectionHandler.deleteNode(
              connection,
              currentCommunityProgressData.id
            );
          }
        },
      });
    });
  };

  const handleDelete = async () => {
    archiveCommunityProgressReport({
      variables: {
        input: {
          _communityProgressReportId: currentCommunityProgressData?.rowId,
        },
      },
      updater: (store) => {
        const connection = store.get(communityProgressConnectionId);
        const progressReportConnectionId = currentCommunityProgressData?.__id;

        store.delete(progressReportConnectionId);
        ConnectionHandler.deleteNode(connection, progressReportConnectionId);
      },
      onCompleted: () => {
        setShowModal(false);
        setCurrentCommunityProgressData(null);
      },
    });
  };

  return (
    <>
      {showToast && (
        <Toast timeout={5000}>
          Community progress report successfully imported
        </Toast>
      )}
      <Modal
        open={showModal}
        onClose={() => {
          setCurrentCommunityProgressData(null);
          setShowModal(false);
        }}
        title="Delete"
      >
        <StyledContainer>
          <p>
            Are you sure you want to delete this community progress report and
            all accompanying data?
          </p>
          <StyledFlex>
            <Button onClick={handleDelete}>Yes, delete</Button>
            <Button onClick={() => setShowModal(false)} variant="secondary">
              No, keep
            </Button>
          </StyledFlex>
        </StyledContainer>
      </Modal>
      <ProjectForm
        additionalContext={{
          applicationId: applicationRowId,
          validateExcel: validateCommunityReport,
          excelValidationErrors: communityProgressValidationErrors,
        }}
        schema={communityProgressReport}
        uiSchema={communityProgressReportUiSchema}
        formData={formData}
        theme={ProjectTheme}
        onSubmit={handleSubmit}
        formAnimationHeight={400}
        isFormAnimated
        isFormEditMode={isFormEditMode}
        setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
        saveBtnText={
          formData?.progressReportFile && excelFile ? 'Save & Import' : 'Save'
        }
        title="Community progress report"
        handleChange={(e) => {
          setFormData({ ...e.formData });
        }}
        submitting={isFormSubmitting}
        submittingText="Importing community progress report. Please wait."
        showEditBtn={false}
        saveBtnDisabled={isFormSubmitting}
        cancelBtnDisabled={isFormSubmitting}
        resetFormData={handleResetFormData}
        setFormData={setFormData}
        before={
          <AddButton
            isFormEditMode={isFormEditMode}
            onClick={() => setIsFormEditMode(true)}
            title="Add community progress report"
          />
        }
        saveDataTestId="save-community-progress-report"
      >
        {communityProgressList?.map(({ node }) => {
          return (
            <CommunityProgressView
              key={node.id}
              communityProgressReport={node}
              isFormEditMode={isFormEditMode}
              onShowDeleteModal={() => {
                setShowModal(true);
                setCurrentCommunityProgressData(node);
              }}
              onFormEdit={() => {
                setFormData(node.jsonData);
                setCurrentCommunityProgressData(node);
                setIsFormEditMode(true);
              }}
            />
          );
        })}
      </ProjectForm>
    </>
  );
};

export default CommunityProgressReportForm;
