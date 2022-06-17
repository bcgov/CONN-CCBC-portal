import React, { SetStateAction, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { WidgetProps } from '@rjsf/core';
import { dateTimeFormat } from '../functions/formatDates';
import styled from 'styled-components';

const StyledDatePicker = styled(DatePicker)`
  margin-top: 12px;
  margin-bottom: 32px;
  border: 2px solid #606060;
  border-radius: 0.25rem;
  padding: 0.5rem 0.6rem;
  width: ${(props) => props.theme.width.inputWidthSmall};
`;

function getDateString(date: SetStateAction<Date | undefined>) {
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

  return (
    <StyledDatePicker
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
    />
  );
};

export default DatePickerWidget;
