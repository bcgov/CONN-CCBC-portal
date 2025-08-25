import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import CloseIcon from '@mui/icons-material/Close';
import { enUS } from '@mui/x-date-pickers/locales';
import dayjs from 'dayjs';
import styled from 'styled-components';

interface StyledClearButtonProps {
  children?: React.ReactNode;
  type?: string;
  onClick?: () => any;
}

const StyledClearButton = styled.button<StyledClearButtonProps>`
  color: ${(props) => props.theme.color.borderGrey};
`;

const DateFilter = ({ column }) => {
  const clearButton = () => (
    <StyledClearButton
      type="button"
      onClick={() => column.setFilterValue(null)}
    >
      <CloseIcon />
    </StyledClearButton>
  );

  const rawFilterVal = column.getFilterValue();
  const filterVal = rawFilterVal ? dayjs(rawFilterVal) : null;

  return (
    <LocalizationProvider
      localeText={
        enUS.components.MuiLocalizationProvider.defaultProps.localeText
      }
      dateAdapter={AdapterDayjs}
    >
      <DesktopDatePicker
        value={filterVal}
        onChange={(newValue) =>
          column.setFilterValue(newValue ? newValue.format('YYYY-MM-DD') : null)
        }
        slotProps={{
          textField: {
            variant: 'standard',
            placeholder: 'Filter by Date (YYYY-MM-DD)',
            fullWidth: true,
          },
        }}
        slots={{
          openPickerButton: column.getFilterValue() ? clearButton : undefined,
        }}
        format="YYYY-MM-DD"
      />
    </LocalizationProvider>
  );
};

export default DateFilter;
