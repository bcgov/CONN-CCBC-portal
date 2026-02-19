import Link from 'next/link';
import { useRouter } from 'next/router';
import { IChangeEvent } from '@rjsf/core';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import FormBase from 'components/Form/FormBase';
import rfiSchema from 'formSchema/analyst/rfiSchema';
import rfiUiSchema from 'formSchema/uiSchema/analyst/rfiUiSchema';
import { useCreateRfiMutation } from 'schema/mutations/application/createRfi';
import { graphql, useFragment } from 'react-relay';
import { RfiForm_RfiData$key } from '__generated__/RfiForm_RfiData.graphql';
import { useUpdateWithTrackingRfiMutation } from 'schema/mutations/application/updateWithTrackingRfiMutation';
import removeFalseyValuesFromObject from 'utils/removeFalseValuesFromObject';
import { useState } from 'react';
import useEmailNotification from 'lib/helpers/useEmailNotification';
import { detectNewFiles, transformFilesForNotification } from './RFI';
import RfiTheme from './RfiTheme';

// Mapping of RFI additional file fields to human-readable names
const RFI_FILE_LABELS = {
  eligibilityAndImpactsCalculatorRfi: 'Template 1 - Eligibility and Impacts Calculator',
  detailedBudgetRfi: 'Template 2 - Detailed Budget',
  financialForecastRfi: 'Template 3 - Financial Forecast',
  lastMileIspOfferingRfi: 'Template 4 - Last Mile Internet Service Offering',
  popWholesalePricingRfi: 'Template 5 - List of Points of Presence and Wholesale Pricing',
  communityRuralDevelopmentBenefitsTemplateRfi: 'Template 6 - Community and Rural Development Benefits',
  wirelessAddendumRfi: 'Template 7 - Wireless Addendum',
  supportingConnectivityEvidenceRfi: 'Template 8 - Supporting Connectivity Evidence',
  geographicNamesRfi: 'Template 9 - Backbone and Geographic Names',
  equipmentDetailsRfi: 'Template 10 - Equipment Details',
  copiesOfRegistrationRfi: 'Copies of registration and other relevant documents',
  preparedFinancialStatementsRfi: 'Financial statements',
  logicalNetworkDiagramRfi: 'Logical Network Diagram',
  projectScheduleRfi: 'Project schedule',
  communityRuralDevelopmentBenefitsRfi: 'Benefits supporting documents',
  otherSupportingMaterialsRfi: 'Other supporting materials',
  geographicCoverageMapRfi: 'Coverage map from Eligibility Mapping Tool',
  coverageAssessmentStatisticsRfi: 'Coverage Assessment and Statistics',
  currentNetworkInfastructureRfi: 'Current network infrastructure',
  upgradedNetworkInfrastructureRfi: 'Proposed or Upgraded Network Infrastructure',
};

const StyledCancel = styled(Button)`
  margin-left: 24px;
`;

interface RfiFormProps {
  rfiDataKey: RfiForm_RfiData$key;
  ccbcNumber?: string;
  applicationRowId?: number;
}

const StyledH4 = styled.h4`
  margin: 24px 0 24px;
  font-weight: 700;
  font-size: 24px;
`;

export const extractRequestedFiles = (oldFiles: any = {}, newFiles: any = {}): string[] => {
  const requestedFiles: string[] = [];
  
  // Check each boolean field in the new files
  Object.keys(newFiles).forEach((key) => {
    // Only process boolean checkbox fields (ending with 'Rfi')
    if (key.endsWith('Rfi') && typeof newFiles[key] === 'boolean') {
      // Check if this is a new request (wasn't true before, is true now)
      const wasRequested = oldFiles[key] === true;
      const isRequested = newFiles[key] === true;
      
      if (isRequested && !wasRequested) {
        const label = RFI_FILE_LABELS[key] || key;
        requestedFiles.push(label);
      }
    }
  });
  
  return requestedFiles;
};

export const getEmailParams = (
  hasNewFiles: boolean,
  hasNewAdditionalFiles: boolean,
  newlyAddedFiles: any[],
  requestedAdditionalFiles: string[],
  ccbcNumber: string,
  rfiNumber: string
) => {
  const emailParams: any = {
    ccbcNumber,
    documentType: 'RFI Additional Documents',
    timestamp: new Date().toLocaleString(),
    rfiNumber,
  };

  // Add email correspondence files if present
  if (hasNewFiles && newlyAddedFiles.length > 0) {
    const { fileNames, fileDetails } = transformFilesForNotification(newlyAddedFiles);
    emailParams.documentNames = fileNames;
    emailParams.fileDetails = fileDetails;
  }

  // Add requested additional files if present
  if (hasNewAdditionalFiles) {
    emailParams.requestedFiles = requestedAdditionalFiles;
  }

  return emailParams;
};

export const processRfiEmailNotification = (
  oldEmailFiles: any[],
  newEmailFiles: any[],
  oldAdditionalFiles: any,
  newAdditionalFiles: any,
  ccbcNumber: string,
  rfiNumber: string,
  applicationRowId: number | undefined,
  appId: string,
  notifyDocumentUpload: (appId: string, params: any) => void
) => {
  // Check if email correspondence files were uploaded OR additional files were requested
  const { hasNewFiles, newlyAddedFiles } = detectNewFiles(oldEmailFiles, newEmailFiles);
  const requestedAdditionalFiles = extractRequestedFiles(oldAdditionalFiles, newAdditionalFiles);
  const hasNewAdditionalFiles = requestedAdditionalFiles.length > 0;

  if (hasNewFiles || hasNewAdditionalFiles) {
    const emailParams = getEmailParams(
      hasNewFiles,
      hasNewAdditionalFiles,
      newlyAddedFiles,
      requestedAdditionalFiles,
      ccbcNumber,
      rfiNumber
    );
    notifyDocumentUpload(applicationRowId?.toString() || appId, emailParams);
  }
};

const RfiForm = ({ rfiDataKey, ccbcNumber, applicationRowId }: RfiFormProps) => {
  const router = useRouter();
  const { applicationId, rfiId } = router.query;
  const isNewRfiForm = rfiId === '0';
  const rfiFormData = useFragment<RfiForm_RfiData$key>(
    graphql`
      fragment RfiForm_RfiData on RfiData {
        rfiNumber
        jsonData
      }
    `,
    rfiDataKey
  );

  const rfiUrl = `/analyst/application/${applicationId}/rfi`;
  const [createRfi] = useCreateRfiMutation();
  const [updateRfi] = useUpdateWithTrackingRfiMutation();
  const [formData, setFormData] = useState(rfiFormData?.jsonData ?? {});
  const { notifyDocumentUpload } = useEmailNotification();

  const handleSubmit = (e: IChangeEvent<any>) => {
    const newFormData = {
      ...e.formData,
      rfiAdditionalFiles: {
        // Remove fields with false values from object to prevent unintended bugs when
        // a user unchecks a previously checked field.
        ...removeFalseyValuesFromObject(e.formData.rfiAdditionalFiles),
      },
    };

    // Track old data for file upload detection
    const oldEmailFiles = rfiFormData?.jsonData?.rfiEmailCorrespondance || [];
    const newEmailFiles = newFormData?.rfiEmailCorrespondance || [];
    const oldAdditionalFiles = rfiFormData?.jsonData?.rfiAdditionalFiles || {};
    const newAdditionalFiles = newFormData?.rfiAdditionalFiles || {};
    const appId = Array.isArray(applicationId) ? applicationId[0] : applicationId;

    if (isNewRfiForm) {
      createRfi({
        variables: {
          input: {
            applicationRowId: parseInt(appId, 10),
            jsonData: newFormData,
          },
        },
        onCompleted: (response) => {
          const { createRfi: { rfiData: { rfiNumber } } } = response;

          processRfiEmailNotification(
            oldEmailFiles,
            newEmailFiles,
            oldAdditionalFiles,
            newAdditionalFiles,
            ccbcNumber,
            rfiNumber,
            applicationRowId,
            appId,
            notifyDocumentUpload
          );

          router.push(rfiUrl);
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.log('Error creating RFI', err);
        },
      });
    } else {
      updateRfi({
        variables: {
          input: {
            jsonData: newFormData,
            rfiRowId: parseInt(rfiId as string, 10),
          },
        },
        onCompleted: () => {
          const rfiNumber = rfiFormData?.rfiNumber;

          processRfiEmailNotification(
            oldEmailFiles,
            newEmailFiles,
            oldAdditionalFiles,
            newAdditionalFiles,
            ccbcNumber,
            rfiNumber,
            applicationRowId,
            appId,
            notifyDocumentUpload
          );

          router.push(rfiUrl);
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.log('Error updating RFI', err);
        },
      });
    }
  };

  return (
    <div>
      {rfiFormData?.rfiNumber && <StyledH4>{rfiFormData?.rfiNumber}</StyledH4>}
      <FormBase
        theme={RfiTheme}
        schema={rfiSchema}
        uiSchema={rfiUiSchema}
        omitExtraData={false}
        formData={formData}
        onChange={(e) => setFormData(e.formData)}
        onSubmit={handleSubmit}
        noValidate
      >
        <Button>Save</Button>
        <Link href={rfiUrl} passHref data-skip-unsaved-warning>
          <StyledCancel variant="secondary">Cancel</StyledCancel>
        </Link>
      </FormBase>
    </div>
  );
};

export default RfiForm;
