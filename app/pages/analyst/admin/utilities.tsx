import { useState, useCallback, useMemo } from 'react';
import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import styled from 'styled-components';
import { DashboardTabs } from 'components/AnalystDashboard';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { Layout } from 'components';
import { AdminTabs } from 'components/Admin';
import { utilitiesQuery } from '__generated__/utilitiesQuery.graphql';
import DownloadLink from 'components/DownloadLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import FileHeader from 'components/Analyst/Project/ProjectInformation/FileHeader';
import Toast from 'components/Toast';
import excelValidateGenerator from 'lib/helpers/excelValidate';
import {
  displayExcelUploadErrors,
  renderCellLevelErrors,
  isCellLevelError,
} from 'components/Analyst/Project/ProjectInformation/widgets/ExcelImportFileWidget';
import { Alert } from '@button-inc/bcgov-theme';
import fetchWithTimeout from 'lib/helpers/fetchWithTimeout';

const getUtilitiesQuery = graphql`
  query utilitiesQuery {
    allApplications(
      first: 999
      filter: { archivedAt: { isNull: true } }
      orderBy: CCBC_NUMBER_ASC
    ) {
      edges {
        node {
          rowId
          ccbcNumber
          projectName
          organizationName
          projectInformation {
            jsonData
          }
          changeRequestDataByApplicationId(
            filter: { archivedAt: { isNull: true } }
            orderBy: AMENDMENT_NUMBER_DESC
            first: 1
          ) {
            edges {
              node {
                amendmentNumber
                jsonData
              }
            }
          }
          applicationSowDataByApplicationId(
            condition: { archivedAt: null }
            orderBy: AMENDMENT_NUMBER_DESC
            first: 1
          ) {
            nodes {
              amendmentNumber
              rowId
              jsonData
              sowTab1SBySowId {
                nodes {
                  jsonData
                  rowId
                }
              }
              sowTab2SBySowId {
                nodes {
                  jsonData
                  rowId
                }
              }
              sowTab7SBySowId {
                nodes {
                  jsonData
                  rowId
                }
              }
              sowTab8SBySowId {
                nodes {
                  jsonData
                  rowId
                }
              }
            }
          }
        }
      }
    }
    session {
      sub
      ...DashboardTabs_query
    }
  }
`;

const StyledContainer = styled.div`
  width: 100%;
`;

const StyledSection = styled.section`
  margin-bottom: 32px;
`;

const StyledDropdown = styled.select`
  text-overflow: ellipsis;
  color: ${(props) => props.theme.color.links};
  background-color: ${(props) => props.theme.color.white};
  border: 1px solid ${(props) => props.theme.color.borderGrey};
  padding: 8px;
  max-width: 100%;
  border-radius: 4px;
  margin-top: 0.25rem;
  position: relative;
  justify-content: left;
`;

const StyledSowInfo = styled.div`
  margin-top: 16px;
  padding: 16px;
  border: 1px solid ${(props) => props.theme.color.borderGrey};
  border-radius: 4px;
  background-color: ${(props) => props.theme.color.white};
`;

const StyledButton = styled.button`
  padding: 8px 16px;
  background-color: ${(props) => props.theme.color.primaryBlue};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 16px;

  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
`;

const StyledInfoRow = styled.div`
  margin-bottom: 12px;
`;

const StyledInfoLabel = styled.span`
  font-weight: 600;
  margin-right: 8px;
`;

const Utilities = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, utilitiesQuery>) => {
  const query = usePreloadedQuery(getUtilitiesQuery, preloadedQuery);
  const { allApplications, session } = query;

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isReimporting, setIsReimporting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [exactMatchMessage, setExactMatchMessage] = useState('');

  // Check if a project has a SOW uploaded
  const hasSowUploaded = useCallback((project: any) => {
    if (!project) return false;

    const changeRequestData =
      project.changeRequestDataByApplicationId?.edges?.[0]?.node;
    const projectInformationData = project.projectInformation?.jsonData;

    // Check if there's a change request with SOW
    if (
      changeRequestData?.jsonData?.statementOfWorkUpload?.length > 0
    ) {
      return true;
    }

    // Check if there's an original SOW
    if (projectInformationData?.statementOfWorkUpload?.length > 0) {
      return true;
    }

    return false;
  }, []);

  // Filter projects to only include those with SOW uploaded
  const projectsWithSow = useMemo(() => {
    return allApplications?.edges?.filter((edge) =>
      hasSowUploaded(edge.node)
    ) || [];
  }, [allApplications, hasSowUploaded]);

  const selectedProject = projectsWithSow.find(
    (edge) => edge.node.rowId.toString() === selectedProjectId
  )?.node;

  // Get latest SOW info
  const getLatestSowInfo = useCallback(() => {
    if (!selectedProject) return null;

    const changeRequestData =
      selectedProject.changeRequestDataByApplicationId?.edges?.[0]?.node;
    const projectInformationData = selectedProject.projectInformation?.jsonData;

    // Check if there's a change request with SOW
    if (
      changeRequestData?.jsonData?.statementOfWorkUpload?.length > 0
    ) {
      return {
        type: 'amendment',
        amendmentNumber: changeRequestData.amendmentNumber,
        sowFile: changeRequestData.jsonData.statementOfWorkUpload[0],
      };
    }

    // Check if there's an original SOW
    if (projectInformationData?.statementOfWorkUpload?.length > 0) {
      return {
        type: 'original',
        amendmentNumber: 0,
        sowFile: projectInformationData.statementOfWorkUpload[0],
      };
    }

    return null;
  }, [selectedProject]);

  const latestSowInfo = getLatestSowInfo();

  // Get existing SOW data for comparison
  const getExistingSowData = useCallback(() => {
    if (!selectedProject) return null;

    const sowData =
      selectedProject.applicationSowDataByApplicationId?.nodes?.[0];
    if (!sowData) return null;

    return {
      summary: sowData.jsonData,
      tab1: sowData.sowTab1SBySowId?.nodes?.map((n) => n.jsonData) || [],
      tab2: sowData.sowTab2SBySowId?.nodes?.map((n) => n.jsonData) || [],
      tab7: sowData.sowTab7SBySowId?.nodes?.map((n) => n.jsonData) || [],
      tab8: sowData.sowTab8SBySowId?.nodes?.map((n) => n.jsonData) || [],
      amendmentNumber: sowData.amendmentNumber,
    };
  }, [selectedProject]);

  const downloadFile = async (uuid: string, fileName: string): Promise<File> => {
    const encodedFileName = encodeURIComponent(fileName);
    // Use the blob endpoint to avoid CORS issues
    const url = `/api/s3/download-blob/${uuid}/${encodedFileName}`;
    const response = await fetch(url);
    
    // Check for AV status error
    if (response.status === 403) {
      const errorData = await response.json();
      if (errorData.avstatus === 'dirty') {
        throw new Error('File is quarantined and cannot be downloaded');
      }
    }
    
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  };

  const compareSowData = (existingData: any, validatedData: any): boolean => {
    if (!existingData || !validatedData) return false;

    try {
      // Compare summary data
      // Existing: existingData.summary is the jsonData from application_sow_data
      // Validated: validatedData.summary._jsonData is the parsed summary data
      const existingSummary = existingData.summary;
      const newSummary = validatedData.summary?._jsonData;

      if (!newSummary) return false;

      // Normalize and compare summary (remove any undefined/null differences)
      const normalizeForComparison = (obj: any) => {
        if (obj === null || obj === undefined) return null;
        if (Array.isArray(obj)) {
          return obj.map(normalizeForComparison).sort();
        }
        if (typeof obj === 'object') {
          const normalized: any = {};
          Object.keys(obj)
            .sort()
            .forEach((key) => {
              const value = normalizeForComparison(obj[key]);
              if (value !== undefined) {
                normalized[key] = value;
              }
            });
          return normalized;
        }
        return obj;
      };

      const normalizedExisting = normalizeForComparison(existingSummary);
      const normalizedNew = normalizeForComparison(newSummary);
      const summaryMatch =
        JSON.stringify(normalizedExisting) === JSON.stringify(normalizedNew);

      // Compare tab data
      // Existing: arrays of jsonData objects
      // Validated: arrays of data objects
      const existingTab1 = (existingData.tab1 || []).map(normalizeForComparison);
      const newTab1 = Array.isArray(validatedData.tab1)
        ? validatedData.tab1.map(normalizeForComparison)
        : [];
      const tab1Match =
        JSON.stringify(existingTab1.sort()) === JSON.stringify(newTab1.sort());

      const existingTab2 = (existingData.tab2 || []).map(normalizeForComparison);
      const newTab2 = Array.isArray(validatedData.tab2)
        ? validatedData.tab2.map(normalizeForComparison)
        : [];
      const tab2Match =
        JSON.stringify(existingTab2.sort()) === JSON.stringify(newTab2.sort());

      const existingTab7 = (existingData.tab7 || []).map(normalizeForComparison);
      const newTab7 = Array.isArray(validatedData.tab7)
        ? validatedData.tab7.map(normalizeForComparison)
        : [];
      const tab7Match =
        JSON.stringify(existingTab7.sort()) === JSON.stringify(newTab7.sort());

      const existingTab8 = (existingData.tab8 || []).map(normalizeForComparison);
      const newTab8 = Array.isArray(validatedData.tab8)
        ? validatedData.tab8.map(normalizeForComparison)
        : [];
      const tab8Match =
        JSON.stringify(existingTab8.sort()) === JSON.stringify(newTab8.sort());

      return (
        summaryMatch && tab1Match && tab2Match && tab7Match && tab8Match
      );
    } catch (error) {
      // If comparison fails, assume data is different
      return false;
    }
  };

  const handleReimport = async () => {
    if (!selectedProject || !latestSowInfo) return;

    setIsReimporting(true);
    setShowSuccessToast(false);
    setValidationErrors([]);
    setExactMatchMessage('');

    try {
      // Download the SOW file
      const file = await downloadFile(
        latestSowInfo.sowFile.uuid,
        latestSowInfo.sowFile.name
      );

      const apiPath = `/api/analyst/sow/${selectedProject.rowId}/${selectedProject.ccbcNumber}/${latestSowInfo.amendmentNumber}`;

      // Validate the file and get validated data structure
      const fileFormData = new FormData();
      fileFormData.append('file', file);

      const validateResponse = await fetchWithTimeout(
        `${apiPath}/?validate=true&operation=UPDATE`,
        {
          method: 'POST',
          body: fileFormData,
        }
      );

      const validateResult = await validateResponse.json();

      // Check for validation errors
      if (validateResponse.status !== 200 || Array.isArray(validateResult)) {
        // If it's an array, it's an error list
        if (Array.isArray(validateResult)) {
          setValidationErrors(
            validateResult.map((item) => ({ ...item, filename: file.name }))
          );
        } else {
          setValidationErrors([
            {
              error: 'Validation failed',
              level: 'database',
              filename: file.name,
            },
          ]);
        }
        setIsReimporting(false);
        return;
      }

      // Get existing data for comparison
      const existingData = getExistingSowData();

      // If we have existing data, compare it with validated data
      if (existingData && validateResult.validatedData) {
        const isExactMatch = compareSowData(
          existingData,
          validateResult.validatedData
        );

        if (isExactMatch) {
          setExactMatchMessage('Data is an exact match. No re-import needed.');
          setIsReimporting(false);
          return;
        }
      }

      // Perform the actual import
      const importFileFormData = new FormData();
      importFileFormData.append('file', file);

      const importResponse = await fetchWithTimeout(
        `${apiPath}/?validate=false&operation=UPDATE`,
        {
          method: 'POST',
          body: importFileFormData,
        }
      );

      const importResult = await importResponse.json();

      if (importResponse.status === 200 && !Array.isArray(importResult)) {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
      } else {
        const errorList = Array.isArray(importResult)
          ? importResult
          : [{ level: 'database', error: 'Import failed' }];
        setValidationErrors(
          errorList.map((item) => ({ ...item, filename: file.name }))
        );
      }
    } catch (error) {
      setValidationErrors([
        {
          error:
            'An error occurred during re-import. If the issue persists, contact the development team.',
          level: 'database',
          filename: latestSowInfo.sowFile.name,
        },
      ]);
    } finally {
      setIsReimporting(false);
    }
  };

  const cellLevelErrors = (validationErrors ?? []).filter((err) =>
    isCellLevelError(err)
  );
  const otherExcelErrors = (validationErrors ?? []).filter(
    (err) => !isCellLevelError(err)
  );

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
        <AdminTabs />
        <StyledSection>
          <h2>Utilities</h2>
          <div>
            <h3>SOW Re-importer</h3>
            <StyledLabel htmlFor="project-select">
              Select a CCBC Project:
            </StyledLabel>
            <StyledDropdown
              id="project-select"
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setValidationErrors([]);
                setExactMatchMessage('');
                setShowSuccessToast(false);
              }}
            >
              <option value="">-- Select a project --</option>
              {projectsWithSow.map((edge) => {
                const project = edge.node;
                return (
                  <option key={project.rowId} value={project.rowId}>
                    {project.ccbcNumber} - {project.projectName || project.organizationName}
                  </option>
                );
              })}
            </StyledDropdown>

            {latestSowInfo && (
              <StyledSowInfo>
                <StyledInfoRow>
                  <StyledInfoLabel>SOW Type:</StyledInfoLabel>
                  <span>
                    {latestSowInfo.type === 'amendment'
                      ? `Amendment #${latestSowInfo.amendmentNumber}`
                      : 'Original'}
                  </span>
                </StyledInfoRow>
                <StyledInfoRow>
                  <StyledInfoLabel>File:</StyledInfoLabel>
                  <DownloadLink
                    uuid={latestSowInfo.sowFile.uuid}
                    fileName={latestSowInfo.sowFile.name}
                  >
                    <FileHeader
                      icon={faFileExcel}
                      title={latestSowInfo.sowFile.name}
                    />
                  </DownloadLink>
                </StyledInfoRow>
                <StyledButton
                  onClick={handleReimport}
                  disabled={isReimporting}
                >
                  {isReimporting ? 'Re-importing...' : 'Re-import'}
                </StyledButton>
              </StyledSowInfo>
            )}

            {exactMatchMessage && (
              <Alert variant="info" content={exactMatchMessage} />
            )}

            {showSuccessToast && (
              <Toast timeout={5000}>
                Statement of work successfully imported
              </Toast>
            )}

            {cellLevelErrors.length > 0 && renderCellLevelErrors(cellLevelErrors)}
            {otherExcelErrors.length > 0 &&
              otherExcelErrors.flatMap(displayExcelUploadErrors)}
          </div>
        </StyledSection>
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(Utilities, getUtilitiesQuery, defaultRelayOptions);

