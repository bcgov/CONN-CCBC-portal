import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

const StyledAutocomplete = styled(Autocomplete)`
  margin-bottom: 16px;
  width: 100%;
  min-width: 240px;

  ${(props) => props.theme.breakpoint.largeUp} {
    min-width: 380px;
  }

  input {
    padding: 7px 4px !important;
  }
`;

export const renderTags = (
  tagValue: any[],
  getTagProps: (any) => any,
  preSelectedCcbcNumber: string
) => {
  return tagValue.map((option: any, index) => {
    const { ccbcNumber, rowId } = option;
    if (preSelectedCcbcNumber === ccbcNumber) {
      return null;
    }
    return (
      <Chip
        key={ccbcNumber}
        label={ccbcNumber}
        clickable
        onClick={() => {
          window.open(`/analyst/application/${rowId}/project`, '_blank');
        }}
        {...getTagProps({ index })}
      />
    );
  });
};

export const optionChecker = (option: any, val: any) => {
  return option.rowId === val.rowId && option.ccbcNumber === val.ccbcNumber;
};

const UrlWidget: React.FC<WidgetProps> = ({
  id,
  formContext,
  onChange,
  value,
}) => {
  const { ccbcIdList, ccbcNumber, rowId } = formContext;
  const isValue = value && value.length > 0;

  const styles = {
    '& .MuiInputBase-root': {
      'margin-top': '4px',
      padding: '0px',
      border: '2px solid #606060',
      borderRadius: '0.25rem',
    },
    '& .Mui-focused': {
      color: isValue ? 'transparent' : 'inherit',
    },
    '& .Mui-focused::placeholder': {
      outline: '4px solid #3b99fc',
      'outline-offset': '1px',
    },

    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  };

  return (
    <StyledAutocomplete
      className="ccbcid-widget-wrapper"
      multiple
      id={id}
      onChange={(e, val) => {
        if (e) onChange(val);
      }}
      value={value ?? [{ ccbcNumber, rowId }]}
      data-testid={id}
      options={ccbcIdList}
      // To prevent a warning when comparing the previous value to the current
      isOptionEqualToValue={optionChecker}
      getOptionLabel={(option: any) => option.ccbcNumber}
      filterSelectedOptions
      renderTags={(val, getTagProps) =>
        renderTags(val, getTagProps, ccbcNumber)
      }
      renderInput={(params) => (
        <TextField {...params} sx={styles} placeholder="Search by CCBC ID" />
      )}
    />
  );
};

export default UrlWidget;
