import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

const StyledAutocomplete = styled(Autocomplete)`
  margin-bottom: 16px;
  width: 100%;

  ${(props) => props.theme.breakpoint.largeUp} {
    min-width: 440px;
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
    padding: '0',
    '& .MuiInputBase-root': {
      'margin-top': '4px',
      padding: '0px',
      border: '2px solid #606060',
      borderRadius: '0.25rem',
    },
    '& .MuiAutocomplete-inputRoot': {
      // 'min-width': '100%',
    },
    '& .MuiAutocomplete-input': {
      padding: '7px 4px',
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
      multiple
      id={id}
      onChange={(e, val) => {
        onChange(val);
      }}
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
                // using the chip url to open the application in a new tab
                // broke the delete button so we are opening link with onclick.
                window.open(`/analyst/application/${rowId}/`, '_blank');
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
