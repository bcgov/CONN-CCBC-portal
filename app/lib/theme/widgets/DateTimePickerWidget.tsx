import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { enUS } from '@mui/x-date-pickers/locales';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { WidgetProps } from '@rjsf/utils';
import styled from 'styled-components';

interface StyleProps {
  id: string;
  isError?: boolean;
}

const StyledDateTimeContainer = styled('div')`
  width: ${(props) => props.theme.width.inputWidthSmall};

  margin-top: 8px;
`;

const StyledDateTimePicker = styled(DesktopDateTimePicker)<StyleProps>`
  width: 100%;
`;

const DateTimePickerWidget: React.FunctionComponent<WidgetProps> = ({
  rawErrors,
  id,
  value,
  disabled,
  readonly,
  onChange,
  uiSchema,
}) => {
  const isErrors = rawErrors && rawErrors.length > 0;
  const uiOptions = uiSchema['ui:options'];
  const maxDate = uiOptions?.maxDate && dayjs(uiOptions?.maxDate as number);
  const minDate = uiOptions?.minDate && dayjs(uiOptions?.minDate as number);

  const handleChange = (d: Date) => {
    const dayjsDate = dayjs(d);

    // clear date if invalid
    if (!dayjsDate.isValid()) {
      onChange(undefined);
      return;
    }

    const isoString = dayjsDate.toISOString();
    onChange(isoString);
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
      border: isErrors ? '2px solid #E71F1F' : '2px solid #606060',
    },
    '& input:disabled': {
      border: 'none',
      background: 'none',
    },
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const ClearableButton = () => {
    if (disabled) return null;
    return (
      <button type="button" onClick={() => onChange(undefined)}>
        <FontAwesomeIcon icon={faTimesCircle} color="#606060" />
      </button>
    );
  };

  return (
    <StyledDateTimeContainer
      className="datetime-widget"
      data-testid="datetime-widget-container"
    >
      <LocalizationProvider
        localeText={
          enUS.components.MuiLocalizationProvider.defaultProps.localeText
        }
        dateAdapter={AdapterDayjs}
      >
        <StyledDateTimePicker
          maxDate={maxDate}
          minDate={minDate}
          id={id}
          sx={styles}
          isError={isErrors}
          disabled={disabled}
          readOnly={readonly}
          onChange={handleChange}
          value={value ? dayjs(value) : null}
          defaultValue={null}
          slotProps={{
            actionBar: {
              actions: ['accept', 'clear', 'cancel'],
            },
            textField: {
              inputProps: {
                id,
                'data-testid': 'datetime-widget-input',
              },
            },
          }}
          slots={{
            openPickerButton: value ? ClearableButton : undefined,
          }}
          format="YYYY-MM-DD HH:mm A"
        />
      </LocalizationProvider>
    </StyledDateTimeContainer>
  );
};

export default DateTimePickerWidget;
