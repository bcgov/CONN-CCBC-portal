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

export const filterByType = (historyItem: any, filters: any) =>
  !filters?.types?.length || filters?.types?.includes(historyItem.tableName);

export const filterByUser = (historyItem: any, filters: any) =>
  !filters?.users?.length || filters?.users?.includes(historyItem.user);

export const getTypeOptions = (historyItems: any[], filters: any) => {
  return [
    ...new Set(
      historyItems
        .filter(
          (item) =>
            !filters?.users?.length || filters?.users?.includes(item.user)
        )
        .map((item) => item.tableName)
    ),
  ];
};

export const getUserOptions = (historyItems: any[], filters: any) => {
  return [
    ...new Set(
      historyItems
        .filter(
          (item) =>
            !filters?.types?.length || filters?.types?.includes(item.tableName)
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
    .filter((type) => type !== 'attachment')
    .map((type) => ({
      value: type,
      label: toTitleCase(type, '_'),
    }));

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
