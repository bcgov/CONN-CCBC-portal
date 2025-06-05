import React from 'react';
import { FormBase } from 'components/Form';
import { historyFilter } from 'formSchema/analyst';
import historyFilterUiSchema from 'formSchema/uiSchema/history/historyFilterUiSchema';
import toTitleCase from 'utils/formatString';

interface HistoryFilterProps {
  filterOptions: { typeOptions: string[]; userOptions: string[] };
  filters: any;
  onFilterChange: (newFilters: any) => void;
}

const typeLabelMappings: Record<string, string> = {
  application_community_progress_report_data: 'Community progress report',
  application_dependencies: 'Assessment',
  assessment_data: 'Assessment',
  application_announced: 'Announcement',
  application_announcement: 'Announcement',
  project_information_data: 'Funding agreement, SOW & map',
  application_sow_data: 'Funding agreement, SOW & map',
  application_project_type: 'Project type',
  application_status: 'Status',
  conditional_approval_data: 'Conditional approval',
  application_gis_data: 'Assessment',
  form_data: 'Application',
  rfi_data: 'RFI',
  application_package: 'Package',
  application_analyst_lead: 'Lead',
  application_milestone_data: 'Milestone report',
  change_request_data: 'Amendment',
  application_claims_data: 'Claims & Progress Report',
  application_gis_assessment_hh: 'Assessment',
  application_fnha_contribution: 'FNHA Contribution',
  application_pending_change_request: 'Pending change request',
};

const getLabelForType = (type: string) =>
  typeLabelMappings[type] || toTitleCase(type, '_');

export const filterByType = (historyItem: any, filters: any) => {
  const typeLabel = getLabelForType(historyItem.tableName);
  return !filters?.types?.length || filters?.types?.includes(typeLabel);
};

export const filterByUser = (historyItem: any, filters: any) =>
  !filters?.users?.length || filters?.users?.includes(historyItem.user);

export const getTypeOptions = (historyItems: any[], filters: any) => {
  const typeLabels = historyItems
    .filter(
      (item) => !filters?.users?.length || filters?.users?.includes(item.user)
    )
    .map((item) => getLabelForType(item.tableName));

  return [...new Set(typeLabels)];
};

export const getUserOptions = (historyItems: any[], filters: any) => {
  return [
    ...new Set(
      historyItems
        .filter(
          (item) =>
            !filters?.types?.length ||
            filters?.types?.includes(getLabelForType(item.tableName))
        )
        .map((item) => item.user)
    ),
  ];
};

const HistoryFilter: React.FC<HistoryFilterProps> = ({
  filterOptions,
  filters,
  onFilterChange,
}) => {
  const { typeOptions, userOptions } = filterOptions;

  const formattedTypeOptions = typeOptions
    .filter((type) => type !== 'Attachment')
    .map((type) => ({
      value: type,
      label: getLabelForType(type),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const filterSchema = historyFilter(formattedTypeOptions, userOptions);

  return (
    <FormBase
      schema={filterSchema as any}
      uiSchema={historyFilterUiSchema as any}
      formData={filters}
      onChange={(e) => onFilterChange(e.formData)}
      formContext={{ skipUnsavedWarning: true }}
      // eslint-disable-next-line react/no-children-prop
      children
    />
  );
};

export default HistoryFilter;
