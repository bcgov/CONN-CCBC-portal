import { useState } from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import { dateTimeFormat } from '../lib/theme/functions/formatDates';
import cookie from 'js-cookie';

import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

const StyledDatePicker = styled(ReactDatePicker)`
  border: 2px solid #606060;
  border-radius: 0.25rem;
  padding: 0.5rem 0.6rem;
  width: 100%;
`;

const TimeMachine = () => {
  const [date, setDate] = useState(cookie.get('mocks.mocked_timestamp') || '');

  const setMockDate = (value: any) => {
    // const address = window.location.href;
    if (value) {
      console.log('setting mock date');
      cookie.set('mocks.mocked_timestamp', value);
      setDate(dateTimeFormat(value, 'date_year_first'));
    } else {
      setDate('');
      cookie.remove('mocks.mocked_timestamp');
    }
    // window.location.href = address;
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
      <StyledDatePicker
        className="form-control"
        dateFormat="yyyy-MM-dd"
        placeholderText="YYYY-MM-DD"
        showMonthDropdown
        showYearDropdown
        value={date}
        dropdownMode="select"
        showPopperArrow={false}
        onChange={(value) => setMockDate(value)}
      />
    </StyledContainer>
  );
};

export default TimeMachine;
