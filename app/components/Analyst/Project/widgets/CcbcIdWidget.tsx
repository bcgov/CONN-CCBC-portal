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

const UrlWidget: React.FC<WidgetProps> = ({
  id,
  formContext,
  onChange,
  value,
}) => {
  const { ccbcIdList } = formContext;
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
      data-testid={id}
      options={ccbcIdList}
      getOptionLabel={(option: any) => option.ccbcNumber}
      filterSelectedOptions
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option: any, index) => {
          const { ccbcNumber, rowId } = option;
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
        })
      }
      renderInput={(params) => (
        <TextField {...params} sx={styles} placeholder="Search by CCBC ID" />
      )}
    />
  );
};

export default UrlWidget;
