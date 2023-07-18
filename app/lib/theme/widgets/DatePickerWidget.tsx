import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { enUS } from '@mui/x-date-pickers/locales';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';
import { dateTimeFormat } from '../functions/formatDates';

interface StyleProps {
  id: string;
  isError?: boolean;
}

const StyledContainer = styled('div')`
  width: ${(props) => props.theme.width.inputWidthSmall};

  margin-top: 8px;
  margin-bottom: 16px;
`;

const StyledDatePicker = styled(DesktopDatePicker)<StyleProps>`
  width: 100%;
`;

const getDateString = (date: Date | undefined) => {
  if (date) {
    if (date.valueOf() <= 0) return undefined;
    return dateTimeFormat(date, 'date_year_first');
  }
  return undefined;
};

const DatePickerWidget: React.FunctionComponent<WidgetProps> = ({
  rawErrors,
  id,
  value,
  disabled,
  readonly,
  onChange,
  uiSchema,
}) => {
  const isRawErrors = rawErrors && rawErrors.length > 0;
  const isError = isRawErrors;
  const uiOptions = uiSchema['ui:options'];
  const maxDate = dayjs(uiOptions?.maxDate as number);
  const minDate = dayjs(uiOptions?.minDate as number);

  const handleChange = (d: Date) => {
    const originalDate = new Date(d);
    const realDate = new Date(originalDate.toDateString());
    const newDate = getDateString(realDate);
    const isDateInvalid = newDate === 'Invalid DateTime';

    if (isDateInvalid) return null;
    return onChange(newDate);
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
      border: isError ? '2px solid #E71F1F' : '2px solid #606060',
    },
  };

  // Leaving this here as the datepicker won't accept a component with props (onChange)
  // eslint-disable-next-line react/no-unstable-nested-components
  const ClearableIconButton = () => {
    return (
      <button type="button" onClick={() => onChange(undefined)}>
        <FontAwesomeIcon icon={faTimesCircle} color="#606060" />
      </button>
    );
  };

  return (
    <StyledContainer
      className="datepicker-widget"
      data-testid="datepicker-widget-container"
    >
      <LocalizationProvider
        localeText={
          enUS.components.MuiLocalizationProvider.defaultProps.localeText
        }
        dateAdapter={AdapterDayjs}
      >
        <StyledDatePicker
          maxDate={uiOptions?.maxDate && maxDate}
          minDate={uiOptions?.minDate && minDate}
          id={id}
          sx={styles}
          isError={isError}
          disabled={disabled}
          readOnly={readonly}
          onChange={handleChange}
          value={value ? dayjs(value) : null}
          defaultValue={null}
          slotProps={{
            actionBar: {
              actions: ['clear', 'cancel'],
            },
            textField: {
              inputProps: {
                id,
                'data-testid': 'datepicker-widget-input',
              },
            },
          }}
          slots={{
            openPickerButton: value ? ClearableIconButton : undefined,
          }}
          format="YYYY-MM-DD"
        />
      </LocalizationProvider>
    </StyledContainer>
  );
};

export default DatePickerWidget;
