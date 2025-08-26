import dayjs from 'dayjs';
import { useState } from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import cookie from 'js-cookie';
import { DateTime } from 'luxon';
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

const StyledDatePicker = styled(DesktopDatePicker)`
  svg {
    color: #606060;
  }
`;

const TimeTravel = () => {
  const today = DateTime.now().toFormat('yyyy-MM-dd');
  const [date, setDate] = useState(cookie.get('mocks.mocked_date') || today);

  const setMockDate = (value: Date) => {
    if (value) {
      const newDate = new Date(new Date(value).toDateString());

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
        <StyledDatePicker
          sx={styles}
          onChange={(value: any) =>
            setMockDate(value ? dayjs(value).toDate() : null)
          }
          value={date ? dayjs(date) : null}
          defaultValue={null}
        />
      </LocalizationProvider>
    </StyledContainer>
  );
};

export default TimeTravel;
