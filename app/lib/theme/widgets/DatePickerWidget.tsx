import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';
import { dateTimeFormat, fixDate } from '../functions/formatDates';

interface StyleProps {
  isError?: boolean;
}

const StyledContainer = styled('div')`
  width: ${(props) => props.theme.width.inputWidthSmall};

  .react-datepicker-popper {
    z-index: 9999;
  }

  div {
    margin: 0px !important;
  }

  margin-top: 12px;
  margin-bottom: 32px;
`;

const StyledDatePicker = styled(DatePicker)<StyleProps>`
  border: 2px solid #606060;
  border: ${(props) =>
    props.isError ? '2px solid #E71F1F' : '2px solid #606060'};

  border-radius: 0.25rem;
  padding: 0.5rem 0.6rem;
  width: 100%;

  ::placeholder {
    color: #cccccc;
  }

  &:focus {
    outline: ${(props) =>
      props.isError ? '4px solid #E71F1F' : '4px solid #3B99FC'};
    outline-offset: 1px;
  }
`;

const StyledSpan = styled('span')`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

function getDateString(date: Date | undefined) {
  if (date) {
    if (date.valueOf() <= 0) return undefined;
    return dateTimeFormat(date, 'date_year_first');
  }
  return undefined;
}

const CalendarIcon = ({ onClick }: any) => {
  return (
    <StyledSpan onClick={onClick}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2.75"
          y="5.75"
          width="18.5"
          height="16.5"
          rx="1.25"
          stroke="black"
          strokeWidth="1.5"
        />
        <path
          d="M4 5.5H20C20.8284 5.5 21.5 6.17157 21.5 7V9.5H2.5V7C2.5 6.17157 3.17157 5.5 4 5.5Z"
          fill="black"
          stroke="black"
        />
        <mask id="path-3-inside-1_2485_9855" fill="white">
          <rect x="6" y="1" width="4" height="6" rx="1" />
        </mask>
        <rect
          x="6"
          y="1"
          width="4"
          height="6"
          rx="1"
          fill="white"
          stroke="black"
          strokeWidth="3"
          mask="url(#path-3-inside-1_2485_9855)"
        />
        <mask id="path-4-inside-2_2485_9855" fill="white">
          <rect x="14" y="1" width="4" height="6" rx="1" />
        </mask>
        <rect
          x="14"
          y="1"
          width="4"
          height="6"
          rx="1"
          fill="white"
          stroke="black"
          strokeWidth="3"
          mask="url(#path-4-inside-2_2485_9855)"
        />
      </svg>
    </StyledSpan>
  );
};

const CustomInput = ({ value, onClick, isError, ...rest }: any) => (
  <>
    <StyledDatePicker
      isError={isError}
      showPopperArrow={false}
      value={value}
      placeholderText="YYYY-MM-DD"
      onClick={onClick}
      {...rest}
    />
    <CalendarIcon onClick={onClick} />
  </>
);

const DatePickerWidget: React.FunctionComponent<WidgetProps> = ({
  rawErrors,
  id,
  value,
  disabled,
  readonly,
  options,
  onBlur,
  onChange,
  onFocus,
}) => {
  const [day, setDay] = useState(value ? fixDate(value) : undefined);
  const isRawErrors = rawErrors && rawErrors.length > 0;
  const isError = isRawErrors && !value;

  const handleChange = (d: Date) => {
    const originalDate = new Date(d);
    const realDate = new Date(originalDate.toDateString());
    if (realDate.valueOf() <= 0) {
      setDay(undefined);
    } else {
      setDay(realDate);
    }
    onChange(getDateString(realDate));
  };

  const handleBlur = () => {
    onBlur(id, getDateString(day));
  };

  const handleFocus = () => {
    onFocus(id, getDateString(day));
  };

  return (
    <StyledContainer
      className="datepicker-widget"
      data-testid="datepicker-widget"
    >
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
        isClearable={!options.isNotClearable as boolean}
        showPopperArrow={false}
        customInput={<CustomInput isError={isError} />}
      />
    </StyledContainer>
  );
};

DatePickerWidget.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  options: {
    isNotClearable: false,
  },
};

export default DatePickerWidget;
