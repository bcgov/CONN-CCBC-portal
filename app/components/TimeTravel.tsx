import { useState } from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import cookie from 'js-cookie';
import { DateTime } from 'luxon';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { enUS } from '@mui/x-date-pickers/locales';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const StyledContainer = styled('div')`
  margin-left: 1em;
  color: black;
  max-width: 380px;
  margin-bottom: 8px;
`;

const StyledDiv = styled('div')`
  white-space: nowrap;
`;

const StyledFlex = styled('div')`
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  & div {
    margin-left: 8px;
  }
`;

const TimeTravel = () => {
  const today = DateTime.now().toFormat('yyyy-MM-dd');
  const [date, setDate] = useState(cookie.get('mocks.mocked_date') || today);

  const setMockDate = (value: Date) => {
    if (value) {
      const originalDate = new Date(value);
      const newDate = new Date(originalDate.toDateString());

      const mockDate = DateTime.fromJSDate(newDate, { zone: 'UTC' }).toFormat(
        'yyyy-MM-dd'
      );
      cookie.set('mocks.mocked_timestamp', value.valueOf() / 1000);
      cookie.set('mocks.mocked_date', mockDate);
      setDate(mockDate);
    } else {
      setDate(today);
      cookie.remove('mocks.mocked_timestamp');
      cookie.remove('mocks.mocked_date');
    }
  };

  const styles = {
    svg: { color: '#606060' },
    '& .Mui-focused': {
      outline: '4px solid #3b99fc',
      'outline-offset': '1px',
      'border-radius': '0.25em',
    },
    '& .MuiInputBase-input': {
      padding: '9px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: '2px solid #606060',
    },
  };

  return (
    <StyledContainer>
      <StyledFlex>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setMockDate(null);
          }}
        >
          Reset
        </Button>
        <StyledDiv>Current date is: {date}</StyledDiv>
      </StyledFlex>
      <LocalizationProvider
        localeText={
          enUS.components.MuiLocalizationProvider.defaultProps.localeText
        }
        dateAdapter={AdapterDayjs}
      >
        <DesktopDatePicker
          sx={styles}
          onChange={(value: Date) => setMockDate(value)}
          value={date ? dayjs(date) : null}
          defaultValue={null}
          slotProps={{
            actionBar: {
              actions: ['clear', 'cancel'],
            },
            textField: {
              inputProps: {
                id: 'datepicker-widget-input',
                'data-testid': 'datepicker-widget-input',
              },
            },
          }}
          format="YYYY-MM-DD"
        />
      </LocalizationProvider>
    </StyledContainer>
  );
};

export default TimeTravel;
