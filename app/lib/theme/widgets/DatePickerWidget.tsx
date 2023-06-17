import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { enUS } from '@mui/x-date-pickers/locales';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';
import { dateTimeFormat } from '../functions/formatDates';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

interface StyleProps {
  id: string;
  isError?: boolean;
}

const StyledContainer = styled('div')`
  width: ${(props) => props.theme.width.inputWidthSmall};

  div {
    margin: 0px !important;
  }

  margin-top: 12px;
  margin-bottom: 32px;
`;

const StyledDatePicker = styled(DesktopDatePicker) <StyleProps>`
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
  options,
  onChange,
}) => {
  const isRawErrors = rawErrors && rawErrors.length > 0;

  const isError = isRawErrors && !value;

  const handleChange = (d: Date) => {
    if (!d) onChange(null);
    const originalDate = new Date(d);
    const realDate = new Date(originalDate.toDateString());

    onChange(getDateString(realDate));
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
  const ClearableIconButton = () => {
    return (
      <>
        {value && (
          <button type="button" onClick={() => onChange(null)} edge="end">
            <FontAwesomeIcon icon={faTimesCircle} color="#606060" />
          </button>
        )}
      </>
    );
  };
  return (
    <StyledContainer
      className="datepicker-widget"
      data-testid="datepicker-widget"
    >
      <LocalizationProvider
        localeText={
          enUS.components.MuiLocalizationProvider.defaultProps.localeText
        }
        dateAdapter={AdapterDayjs}
      >
        <StyledDatePicker
          id={id}
          sx={styles}
          isError={isError}
          disabled={disabled}
          readOnly={readonly}
          onChange={handleChange}
          value={value ? dayjs(value) : null}
          defaultValue={null}
          componentsProps={{
            actionBar: {
              actions: ['clear', 'cancel'],
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
