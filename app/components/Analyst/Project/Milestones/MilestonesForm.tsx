import { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import { ConnectionHandler, graphql, useFragment } from 'react-relay';
import milestonesSchema from 'formSchema/analyst/milestones';
import milestonesUiSchema from 'formSchema/uiSchema/analyst/milestonesUiSchema';
import { useCreateMilestoneMutation } from 'schema/mutations/project/createMilestoneData';
import { useArchiveApplicationMilestoneDataMutation as useArchiveMilestone } from 'schema/mutations/project/archiveApplicationMilestoneData';
import excelValidateGenerator from 'lib/helpers/excelValidate';
import Toast from 'components/Toast';
import Modal from 'components/Modal';
import MilestonesView from './MilestonesView';
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

const StyledFormHeader = styled.div`
  p {
    margin-bottom: 8px;
  }
  ul {
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

const StyledViewHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 2fr 1fr;
  color: #757575;
  font-size: 14px;
  font-weight: 700;
`;

const FormHeader = (
  <StyledFormHeader>
    <p>
      As part of the project monitoring and claims process, the submission of
      milestone documentation is required at key points of the project’s
      lifecycle. Each project site that is listed in the Statement of Work has 3
      milestone events:
    </p>
    <ul>
      <li>Milestone 1: Network design is complete</li>
      <li>Milestone 2: Network build is complete</li>
      <li>Milestone 3: Broadband service is available</li>
    </ul>
    <p>
      A CCBC analyst or ISED technical officer prepares the Milestone reports
      and sends it to the recipient approximately 4 weeks prior to the due date.
      After the recipient submits, analysts and officers review the evidence
      submitted.
    </p>
    <p>
      If necessary, clarifications are requested from the recipient. Once the
      milestone report is processed it can be uploaded here.
    </p>
  </StyledFormHeader>
);

interface FormData {
  dueDate?: string;
  milestoneFile?: any;
  evidenceOfCompletionFile?: any;
}

interface Props {
  application: any;
  isExpanded?: boolean;
}

const MilestonesForm: React.FC<Props> = ({ application, isExpanded }) => {
  const queryFragment = useFragment(
    graphql`
      fragment MilestonesForm_application on Application {
        id
        rowId
        ccbcNumber
        applicationMilestoneDataByApplicationId(
          filter: { archivedAt: { isNull: true } }
          first: 1000
        )
          @connection(
            key: "MilestonesForm_applicationMilestoneDataByApplicationId"
          ) {
          __id
          edges {
            node {
              __id
              id
              rowId
              jsonData
              excelDataId
              ...MilestonesView_query
            }
          }
        }
        applicationMilestoneExcelDataByApplicationId(
          filter: { archivedAt: { isNull: true } }
          first: 1000
        ) {
          edges {
            node {
              id
              jsonData
              rowId
            }
          }
        }
        ccbcNumber
      }
    `,
    application
  );
  const {
    applicationMilestoneDataByApplicationId: milestoneData,
    applicationMilestoneExcelDataByApplicationId: { edges: excelDataEdges },
    rowId: applicationRowId,
    ccbcNumber,
  } = queryFragment;

  const [formData, setFormData] = useState({} as FormData);
  const [showModal, setShowModal] = useState(false);
  // store the current community progress data node for edit mode so we have access to row id and relay connection
  const [currentMilestoneData, setCurrentMilestoneData] = useState(null);
  const [isFormEditMode, setIsFormEditMode] = useState(false);
  const [createMilestone] = useCreateMilestoneMutation();
  const [archiveMilestone] = useArchiveMilestone();
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);
  // use this to live validate the form after the first submit attempt
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [milestoneValidationErrors, setMilestoneValidationErrors] = useState(
    []
  );
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [milestonesExcelDataList, setMilestonesExcelDataList] =
    useState(excelDataEdges);
  const milestonesConnectionId = milestoneData?.__id;
  const milestonesList = milestoneData?.edges
    ?.filter((data) => {
      // filter null nodes from the list caused by relay connection update
      return data.node !== null;
    })
    .sort((a, b) => {
      // sort by due date
      const dateA = new Date(a.node.jsonData.dueDate);
      const dateB = new Date(b.node.jsonData.dueDate);

      return dateB.getTime() - dateA.getTime();
    });

  const apiPath = `/api/analyst/milestone/${applicationRowId}/${ccbcNumber}/${currentMilestoneData?.rowId}`;

  const hasValidationErrors =
    milestoneValidationErrors.length > 0 || excelFile === null;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateMilestone = useCallback(
    excelValidateGenerator(apiPath, setExcelFile, setMilestoneValidationErrors),
    [setExcelFile]
  );

  const handleResetFormData = () => {
    setIsFormEditMode(false);
    setFormData({} as FormData);
    setCurrentMilestoneData(null);
    setIsSubmitAttempted(false);
    setExcelFile(null);
    setShowToast(false);
  };

  const handleSubmit = async (e) => {
    setIsSubmitAttempted(true);
    hiddenSubmitRef.current.click();
    if (!formData?.dueDate) return;
    e.preventDefault();
    setIsFormSubmitting(true);

    validateMilestone(excelFile, false).then((res) => {
      // get the excel data row i from the response or the current milestone data
      const responseExcelData =
        res?.result?.data?.createApplicationMilestoneExcelData
          ?.applicationMilestoneExcelData;

      // get the excel data row id from the current milestone if it exists
      const currentExcelDataId = currentMilestoneData?.excelDataId;

      // replace the current excel data id if a new excel file was uploaded since the previous data will be archived
      const excelDataId = responseExcelData?.rowId || currentExcelDataId;

      /// save form data
      createMilestone({
        variables: {
          connections: [milestonesConnectionId],
          input: {
            _jsonData: formData,
            _applicationId: applicationRowId,
            _oldMilestoneId: currentMilestoneData?.rowId || null,
            _excelDataId: excelDataId,
          },
        },
        onCompleted: () => {
          // add the new milestone excel data to the list if it exists so it can be instantly displayed
          // since relay store doesn't like two store updates in the same mutation
          // otherwise the user will have to refresh the page to see the new data
          if (responseExcelData?.id) {
            setMilestonesExcelDataList([
              ...milestonesExcelDataList,
              {
                node: responseExcelData,
              },
            ]);
          }

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
          if (currentMilestoneData?.id) {
            const connection = store.get(milestonesConnectionId);

            store.delete(currentMilestoneData.id);
            ConnectionHandler.deleteNode(connection, currentMilestoneData.id);
          }
        },
      });
    });
  };

  const handleDelete = async () => {
    archiveMilestone({
      variables: {
        input: {
          _milestoneId: currentMilestoneData?.rowId,
        },
      },
      updater: (store) => {
        const milestoneConnectionId = currentMilestoneData?.__id;
        const connection = store.get(milestoneConnectionId);

        store.delete(milestoneConnectionId);
        ConnectionHandler.deleteNode(connection, milestoneConnectionId);
      },
      onCompleted: () => {
        handleResetFormData();
      },
    });
  };

  return (
    <>
      {showToast && (
        <Toast timeout={5000}>
          Milestone report excel data successfully imported
        </Toast>
      )}
      <Modal
        open={showModal}
        onClose={() => {
          setCurrentMilestoneData(null);
          setShowModal(false);
        }}
        title="Delete"
      >
        <StyledContainer>
          <p>
            Are you sure you want to delete this milestone report and all
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
          validateExcel: validateMilestone,
          excelValidationErrors: milestoneValidationErrors,
        }}
        schema={milestonesSchema}
        uiSchema={milestonesUiSchema}
        formData={formData}
        formHeader={FormHeader}
        theme={ProjectTheme}
        onSubmit={handleSubmit}
        formAnimationHeight={1600}
        isExpanded={isExpanded}
        isFormAnimated
        hiddenSubmitRef={hiddenSubmitRef}
        isFormEditMode={isFormEditMode}
        setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
        saveBtnText={
          formData?.milestoneFile && excelFile ? 'Save & Import' : 'Save'
        }
        title="Milestone reports"
        handleChange={(e) => {
          setFormData({ ...e.formData });
        }}
        submitting={
          !hasValidationErrors &&
          excelFile &&
          formData?.milestoneFile &&
          isFormSubmitting
        }
        submittingText="Importing milestone data. Please wait."
        showEditBtn={false}
        saveBtnDisabled={isFormSubmitting}
        cancelBtnDisabled={isFormSubmitting}
        resetFormData={handleResetFormData}
        liveValidate={isSubmitAttempted && isFormEditMode}
        setFormData={setFormData}
        before={
          <AddButton
            isFormEditMode={isFormEditMode}
            onClick={() => {
              setShowToast(false);
              setIsSubmitAttempted(false);
              setIsFormEditMode(true);
            }}
            title="Add milestone report"
          />
        }
        saveDataTestId="save-milestones-data"
      >
        {milestonesList.length > 0 && (
          <StyledViewHeader>
            <span />
            <span />
            <span>% Project Milestone Complete</span>
            <span />
          </StyledViewHeader>
        )}
        {milestonesList?.map(({ node }) => {
          return (
            <MilestonesView
              key={node.id}
              milestone={node}
              milestoneExcelData={milestonesExcelDataList.find(
                (data) => data.node.rowId === node.excelDataId
              )}
              isFormEditMode={isFormEditMode}
              onShowDeleteModal={() => {
                setShowModal(true);
                setCurrentMilestoneData(node);
              }}
              onFormEdit={() => {
                setFormData(node.jsonData);
                setCurrentMilestoneData(node);
                setIsFormEditMode(true);
              }}
            />
          );
        })}
      </StyledProjectForm>
    </>
  );
};

export default MilestonesForm;
