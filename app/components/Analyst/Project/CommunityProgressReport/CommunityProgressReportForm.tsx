import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { ConnectionHandler, graphql, useFragment } from 'react-relay';
import isEqual from 'lodash.isequal';
import communityProgressReport from 'formSchema/analyst/communityProgressReport';
import communityProgressReportUiSchema from 'formSchema/uiSchema/analyst/communityProgressReportUiSchema';
import { useCreateCommunityProgressReportMutation } from 'schema/mutations/project/createCommunityProgressReport';
import { useArchiveApplicationCommunityProgressReportMutation as useArchiveCpr } from 'schema/mutations/project/archiveApplicationCommunityProgressReport';
import excelValidateGenerator from 'lib/helpers/excelValidate';
import { getFiscalQuarter, getFiscalYear } from 'utils/fiscalFormat';
import Toast from 'components/Toast';
import useModal from 'lib/helpers/useModal';
import useEmailNotification from 'lib/helpers/useEmailNotification';
import CommunityProgressView from './CommunityProgressView';
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
  overflow: hidden;
  max-height: 80px;
  transition: max-height 0.5s;
`;

const StyledBottom = styled.div`
  margin-bottom: 1em;
`;

interface FormData {
  progressReportFile?: any;
  dueDate?: string;
  dateReceived?: string;
}

interface Props {
  application: any;
  isExpanded?: boolean;
}

const FormHeader = (
  <>
    <div>
      This is the form indicating the stage of each of ISED&apos;s 1242
      communities which is done each Jun 1, Sep 1, Dec 1, and Mar 1. After
      pressing Save & Import, the data will be extracted.
    </div>
    <p>After uploading here, the data will be extracted</p>
  </>
);

const CommunityProgressReportForm: React.FC<Props> = ({
  application,
  isExpanded,
}) => {
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
    ccbcNumber,
    rowId: applicationRowId,
  } = queryFragment;

  const [formData, setFormData] = useState({} as FormData);
  const [initialFormData, setInitialFormData] = useState({} as FormData);
  // store the current community progress data node for edit mode so we have access to row id and relay connection
  const [currentCommunityProgressData, setCurrentCommunityProgressData] =
    useState(null);
  const [isFormEditMode, setIsFormEditMode] = useState(false);
  const [createCommunityProgressReport] =
    useCreateCommunityProgressReportMutation();
  const [archiveCommunityProgressReport] = useArchiveCpr();
  const { notifyDocumentUpload } = useEmailNotification();
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);
  // use this to live validate the form after the first submit attempt
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isFiscalError, setIsFiscalError] = useState(false);
  const [
    communityProgressValidationErrors,
    setCommunityProgressValidationErrors,
  ] = useState([]);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const deleteConfirmationModal = useModal();

  const isFormDirty = useMemo(() => {
    return !isEqual(formData, initialFormData);
  }, [formData, initialFormData]);

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

  const apiPath = `/api/analyst/community-report/${applicationRowId}/${currentCommunityProgressData?.excelDataId}`;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateCommunityReport = useCallback(
    excelValidateGenerator(
      apiPath,
      setExcelFile,
      setCommunityProgressValidationErrors
    ),
    [setExcelFile, apiPath]
  );

  const hasValidationErrors =
    communityProgressValidationErrors.length > 0 || excelFile === null;

  const fiscalQuarterList = communityProgressList
    ?.filter((data) => data.node.jsonData?.dueDate !== undefined)
    ?.filter((data) => data.node.rowId !== currentCommunityProgressData?.rowId)
    ?.map((data) => {
      const dueDate = data.node.jsonData?.dueDate;
      const fiscalYear = getFiscalYear(dueDate);
      const fiscalQuarter = getFiscalQuarter(dueDate);
      return `${fiscalYear} ${fiscalQuarter}`;
    });

  const handleResetFormData = () => {
    setIsFormEditMode(false);
    setFormData({} as FormData);
    setInitialFormData({} as FormData);
    setCurrentCommunityProgressData(null);
    setIsSubmitAttempted(false);
    setExcelFile(null);
    setShowToast(false);
    deleteConfirmationModal.close();
  };

  const handleSubmit = async (e) => {
    hiddenSubmitRef.current.click();
    e.preventDefault();
    setIsSubmitAttempted(true);

    if (!formData?.dueDate) return;
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
            notifyDocumentUpload(applicationRowId, {
              ccbcNumber,
              documentType: 'Community Progress Report',
              documentNames: [excelFile.name],
            });
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

  // check to see if the due date is in the same fiscal quarter as another report,
  // then pass the result to the fiscal error state and then to formContext to display
  // the error using ContextErrorWidget since this is a warning not a true error
  useEffect(() => {
    const dueDate = formData?.dueDate;
    if (!dueDate) setIsFiscalError(false);
    const fiscalDate = `${getFiscalYear(dueDate)} ${getFiscalQuarter(dueDate)}`;
    if (fiscalQuarterList?.includes(fiscalDate)) {
      setIsFiscalError(true);
    } else {
      setIsFiscalError(false);
    }
  }, [formData, fiscalQuarterList]);

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
        handleResetFormData();
      },
    });
  };
  const formOffset = communityProgressList?.length > 0 ? 68 : 30;
  return (
    <>
      {showToast && (
        <Toast timeout={5000}>
          Community progress report successfully imported
        </Toast>
      )}
      <ReportDeleteConfirmationModal
        id="community-progress-report-delete-confirm-dialog"
        onClose={() => {
          handleResetFormData();
          deleteConfirmationModal.close();
        }}
        onConfirm={handleDelete}
        reportType="community progress"
        {...deleteConfirmationModal}
      />
      <StyledProjectForm
        formAnimationHeightOffset={formOffset}
        additionalContext={{
          applicationId: applicationRowId,
          validateExcel: validateCommunityReport,
          excelValidationErrors: communityProgressValidationErrors,
          contextErrorWidgetMessage:
            isFiscalError &&
            'A community progress report has already been created for this quarter',
        }}
        schema={communityProgressReport}
        uiSchema={communityProgressReportUiSchema}
        formData={formData}
        theme={ProjectTheme}
        formHeader={FormHeader}
        onSubmit={handleSubmit}
        formAnimationHeight={600}
        isExpanded={isExpanded}
        isFormAnimated
        hiddenSubmitRef={hiddenSubmitRef}
        isFormEditMode={isFormEditMode}
        setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
        saveBtnText={
          formData?.progressReportFile && excelFile ? 'Save & Import' : 'Save'
        }
        title="Community progress reports"
        handleChange={(e) => {
          setFormData({ ...e.formData });
        }}
        submitting={
          !hasValidationErrors &&
          excelFile &&
          formData.progressReportFile &&
          isFormSubmitting
        }
        submittingText="Importing community progress report. Please wait."
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
                setIsSubmitAttempted(false);
                setCurrentCommunityProgressData(null);
                setInitialFormData({} as FormData);
                setIsFormEditMode(true);
              }}
              title="Add community progress report"
            />

            {!isFormEditMode && communityProgressList?.length > 0 && (
              <MetabaseLink
                href={`https://ccbc-metabase.apps.silver.devops.gov.bc.ca/dashboard/95-community-progress-report-prod?ccbc_number=${ccbcNumber}`}
                text="View project data in Metabase"
                testHref={`https://ccbc-metabase.apps.silver.devops.gov.bc.ca/dashboard/94-community-progress-report?ccbc_number=${ccbcNumber}`}
                width={326}
              />
            )}
          </StyledFlexDiv>
        }
        saveDataTestId="save-community-progress-report"
      >
        <StyledBottom>
          {communityProgressList?.map(({ node }) => {
            return (
              <CommunityProgressView
                key={node.id}
                communityProgressReport={node}
                isFormEditMode={isFormEditMode}
                onShowDeleteModal={() => {
                  deleteConfirmationModal.open();
                  setCurrentCommunityProgressData(node);
                }}
                onFormEdit={() => {
                  setFormData(node.jsonData);
                  setInitialFormData(node.jsonData);
                  setCurrentCommunityProgressData(node);
                  setIsFormEditMode(true);
                }}
              />
            );
          })}
        </StyledBottom>
      </StyledProjectForm>
    </>
  );
};

export default CommunityProgressReportForm;
