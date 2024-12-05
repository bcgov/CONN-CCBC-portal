import React from 'react';
import { WidgetProps } from '@rjsf/utils';
import styled from 'styled-components';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

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

const MultiSelectWidget: React.FC<WidgetProps> = ({
  id,
  value,
  onChange,
  required,
  placeholder,
  schema,
  objectOptions,
}) => {
  const normalizeOptions = (
    options: string[] | Array<{ label: string; value: string | number }>
  ): Array<{ label: string; value: string | number }> => {
    if (Array.isArray(options) && typeof options[0] === 'string') {
      return options.map((option) => ({ label: option, value: option }));
    }
    return options as Array<{ label: string; value: string | number }>;
  };

  const options = normalizeOptions(
    objectOptions ??
      (schema.enum as
        | string[]
        | Array<{ label: string; value: string | number }>)
  );

  const styles = {
    '& .MuiInputBase-root': {
      padding: '0px',
      border: '2px solid #606060',
      borderRadius: '0.25rem',
    },
    '& .Mui-focused::placeholder': {
      outline: '4px solid #3b99fc',
      'outline-offset': '1px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  };

  const handleChange = (
    event: React.SyntheticEvent,
    selectedOptions: Array<{ label: string; value: string | number }>
  ) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    onChange(selectedValues.length ? selectedValues : undefined);
  };

  const getSelectedValues = () => {
    if (!value || !Array.isArray(value)) return [];
    return options.filter((option) => value.includes(option.value));
  };

  return (
    <StyledAutocomplete
      multiple
      id={id}
      options={options}
      getOptionLabel={(option: any) => option.label}
      value={getSelectedValues()}
      onChange={handleChange}
      isOptionEqualToValue={(option: any, selectedValue: any) =>
        option.value === selectedValue.value
      }
      renderInput={(params) => (
        <TextField
          {...params}
          sx={styles}
          placeholder={placeholder}
          required={required}
        />
      )}
    />
  );
};

export default MultiSelectWidget;
