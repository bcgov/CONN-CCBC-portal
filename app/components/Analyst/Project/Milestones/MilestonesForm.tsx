import { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import { ConnectionHandler, graphql, useFragment } from 'react-relay';
import milestonesSchema from 'formSchema/analyst/milestones';
import milestonesUiSchema from 'formSchema/uiSchema/analyst/milestonesUiSchema';
import { useCreateMilestoneMutation } from 'schema/mutations/project/createMilestoneData';
/* import { useArchiveApplicationMilestoneDataMutation as useArchiveClaims } from 'schema/mutations/project/archiveApplicationMilestoneData'; */
import excelValidateGenerator from 'lib/helpers/excelValidate';
import Toast from 'components/Toast';
import Modal from 'components/Modal';
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
  claimsFile?: any;
  fromDate?: string;
  toDate?: string;
}

const MilestonesForm = ({ application }) => {
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
    rowId: applicationRowId,
    ccbcNumber,
  } = queryFragment;

  const [formData, setFormData] = useState({} as any);
  const [showModal, setShowModal] = useState(false);
  // store the current community progress data node for edit mode so we have access to row id and relay connection
  const [currentMilestoneData, setCurrentMilestoneData] = useState(null);
  const [isFormEditMode, setIsFormEditMode] = useState(false);
  const [createMilestone] = useCreateMilestoneMutation();
  /*   const [archiveMilestone] = useArchiveMilestone(); */
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);
  const [excelFile, setExcelFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [milestoneValidationErrors, setMilestoneValidationErrors] = useState(
    []
  );
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const milestonesConnectionId = milestoneData?.__id;
  // const milestoneList = milestoneData?.edges?.filter((data) => {
  //   // filter null nodes from the list caused by relay connection update
  //   return data.node !== null;
  // });
  //
  const apiPath = `/api/analyst/milestone/${applicationRowId}/${ccbcNumber}/${currentMilestoneData?.rowId}`;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateMilestone = useCallback(
    excelValidateGenerator(apiPath, setExcelFile, setMilestoneValidationErrors),
    [setExcelFile]
  );

  const handleResetFormData = () => {
    setIsFormEditMode(false);
    setFormData({} as FormData);
    setCurrentMilestoneData(null);
    setExcelFile(null);
    setShowToast(false);
  };

  const handleSubmit = async (e) => {
    hiddenSubmitRef.current.click();
    if (!formData?.dueDate) return;
    e.preventDefault();
    setIsFormSubmitting(true);

    validateMilestone(excelFile, false).then((res) => {
      // get the excel data row i from the response or the current claims data
      const responseExcelDataId =
        res?.result?.data.createApplicationMilestoneExcelData
          ?.applicationMilestoneExcelData?.rowId;

      // get the excel data row id from the current claims if it exists
      const currentExcelDataId = currentMilestoneData?.excelDataId;

      // replace the current excel data id if a new excel file was uploaded since the previous data will be archived
      const excelDataId = responseExcelDataId || currentExcelDataId;

      /// save form data
      createMilestone({
        variables: {
          connections: [milestonesConnectionId],
          input: {
            _jsonData: formData,
            _applicationId: applicationRowId,
            _oldMilestoneId: currentMilestoneData?.rowId,
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
    // archiveMilestone({
    //   variables: {
    //     input: {
    //       _claimsDataId: currentMilestoneData?.rowId,
    //     },
    //   },
    //   updater: (store) => {
    //     const milestoneConnectionId = currentMilestoneData?.__id;
    //     const connection = store.get(milestoneConnectionId);
    //
    //     store.delete(milestoneConnectionId);
    //     ConnectionHandler.deleteNode(connection, milestoneConnectionId);
    //   },
    //   onCompleted: () => {
    //     setShowModal(false);
    //     setCurrentMilestoneData(null);
    //   },
    // });
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
        formAnimationHeight={600}
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
        submitting={isFormSubmitting}
        submittingText="Importing milestone data. Please wait."
        showEditBtn={false}
        saveBtnDisabled={isFormSubmitting}
        cancelBtnDisabled={isFormSubmitting}
        resetFormData={handleResetFormData}
        setFormData={setFormData}
        before={
          <AddButton
            isFormEditMode={isFormEditMode}
            onClick={() => {
              setIsFormEditMode(true);
            }}
            title="Add milestone report"
          />
        }
        saveDataTestId="save-milestones-data"
      >
        {/* map milestones here */}
      </StyledProjectForm>
    </>
  );
};

export default MilestonesForm;
