import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { WidgetProps } from '@rjsf/core';
import { dateTimeFormat } from '../functions/formatDates';
import styled from 'styled-components';
import { CalendarIcon } from '../../../components';

const StyledContainer = styled('div')`
  margin-top: 12px;
  margin-bottom: 32px;
`;

const StyledDatePicker = styled(DatePicker)`
  border: 2px solid #606060;
  border-radius: 0.25rem;
  padding: 0.5rem 0.6rem;
  width: 100%;
`;

const StyledDiv = styled('div')`
  width: ${(props) => props.theme.width.inputWidthSmall};
  position: relative;
`;

function getDateString(date: Date | undefined) {
  if (date) {
    return dateTimeFormat(date, 'date_year_first');
  }
}

const DatePickerWidget: React.FunctionComponent<WidgetProps> = ({
  id,
  value,
  disabled,
  readonly,
  onBlur,
  onChange,
  onFocus,
}) => {
  const [day, setDay] = useState(value ? new Date(value) : undefined);

  const handleChange = (d: Date) => {
    setDay(d);
    onChange(getDateString(d));
  };

  const handleBlur = () => {
    onBlur(id, getDateString(day));
  };

  const handleFocus = () => {
    onFocus(id, getDateString(day));
  };

  const CustomInput = ({ value, onClick, ...rest }: any) => {
    return (
      <StyledDiv>
        <StyledDatePicker
          showPopperArrow={false}
          value={value}
          onClick={onClick}
          {...rest}
        />
        <CalendarIcon onClick={onClick} />
      </StyledDiv>
    );
  };

  return (
    <StyledContainer>
      <DatePicker
        id={id}
        disabled={disabled}
        readOnly={readonly}
        className="form-control"
        selected={day}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        dateFormat="yyyy-MM-dd"
        placeholderText="YYYY-MM-DD"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        showPopperArrow={false}
        customInput={<CustomInput />}
      />
    </StyledContainer>
  );
};

export default DatePickerWidget;
