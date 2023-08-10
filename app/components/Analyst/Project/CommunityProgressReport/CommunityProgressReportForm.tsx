import { useCallback, useState } from 'react';
import { ConnectionHandler, graphql, useFragment } from 'react-relay';
import communityProgressReport from 'formSchema/analyst/communityProgressReport';
import communityProgressReportUiSchema from 'formSchema/uiSchema/analyst/communityProgressReportUiSchema';
import { useCreateCommunityProgressReportMutation } from 'schema/mutations/project/createCommunityProgressReport';
import excelValidateGenerator from 'lib/helpers/excelValidate';
import Toast from 'components/Toast';
import CommunityProgressView from './CommunityProgressView';
import ProjectTheme from '../ProjectTheme';
import ProjectForm from '../ProjectForm';
import AddButton from '../AddButton';

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
              id
              rowId
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
    rowId,
  } = queryFragment;

  const [formData, setFormData] = useState({} as FormData);
  // store the current community progress data node for edit mode so we have access to row id and relay connection
  const [currentCommunityProgressData, setCurrentCommunityProgressData] =
    useState(null);
  const [isFormEditMode, setIsFormEditMode] = useState(false);
  const [createCommunityProgressReport] =
    useCreateCommunityProgressReportMutation();
  const [excelFile, setExcelFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
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

  const apiPath = `/api/analyst/community-report/${rowId}`;

  // will need to pass in something like setValidationErrors as a third argument in the validation ticket
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateCommunityReport = useCallback(
    excelValidateGenerator(apiPath, setExcelFile),
    [setExcelFile]
  );

  const handleResetFormData = () => {
    setIsFormEditMode(false);
    setFormData({} as FormData);
    setCurrentCommunityProgressData(null);
    setExcelFile(null);
    setShowToast(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFormSubmitting(true);

    validateCommunityReport(excelFile, false).then((r) => {
      /// save form data
      createCommunityProgressReport({
        variables: {
          connections: [communityProgressConnectionId],
          input: {
            _jsonData: formData,
            _applicationId: rowId,
            _oldCommunityProgressReportId: currentCommunityProgressData?.rowId,
          },
        },
        onCompleted: () => {
          handleResetFormData();

          if (r?.status === 200) {
            setShowToast(true);
          }

          setIsFormSubmitting(false);
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

  return (
    <ProjectForm
      additionalContext={{
        applicationId: rowId,
        validateExcel: validateCommunityReport,
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
      resetFormData={handleResetFormData}
      setFormData={setFormData}
      showEditBtn={false}
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
            onFormEdit={() => {
              setFormData(node.jsonData);
              setCurrentCommunityProgressData(node);
              setIsFormEditMode(true);
            }}
          />
        );
      })}
      {showToast && (
        <Toast timeout={5000}>
          Community progress report successfully imported
        </Toast>
      )}
    </ProjectForm>
  );
};

export default CommunityProgressReportForm;
