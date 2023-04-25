import styled from 'styled-components';

const StyledTooltip = styled.span<TooltipProps>`
  display: inline-block;
  position: relative;
  text-align: left;

  .${(props) => (props.customClass ? props.customClass : 'tooltip')} {
    min-width: 200px;
    top: 24px;
    left: 50%;
    transform: translate(-50%, 0);
    padding: 8px 16px;
    color: #444444;
    background-color: ${(props) => props.theme.color.navigationLightGrey};
    font-weight: normal;
    font-size: 13px;
    border-radius: 4px;
    position: absolute;
    z-index: 99999999;
    box-sizing: border-box;
    border: 1px solid #999999;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    display: none;
  }

  &:hover
    .${(props) => (props.customClass ? props.customClass : 'tooltip')},
    &:focus
    .${(props) => (props.customClass ? props.customClass : 'tooltip')} {
    display: block;
  }

  .${(props) => (props.customClass ? props.customClass : 'tooltip')} i {
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -12px;
    width: 24px;
    height: 12px;
    overflow: hidden;
  }

  .${(props) => (props.customClass ? props.customClass : 'tooltip')} i::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    left: 50%;
    transform: translate(-50%, 50%) rotate(45deg);
    background-color: ${(props) => props.theme.color.navigationLightGrey};
    border: 1px solid #999999;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
  }
`;

interface TooltipProps {
  children: React.ReactNode;
  customClass?: string;
  [otherOptions: string]: unknown;
}

const Tooptip = (props) => {
  const { children, customClass, message } = props;
  return (
    <StyledTooltip {...props} tabIndex={0}>
      {children}

      <div className={customClass || 'tooltip'}>
        {message}
        <i />
      </div>
    </StyledTooltip>
  );
};

export default Tooptip;
