/* eslint-disable jsx-a11y/label-has-associated-control */
import styled from 'styled-components';

const StyledLoading = styled.div`
  display: flex;
  align-items: center;
  input {
    display: none;
  }


  input:checked ~ label {
    animation: none;
    border-color: #5cb85c;
    transition: border 0.5s ease-out;
  }


  input:checked ~ label .check-icon {
    display: block;
  }


  label {
    position: relative;
    height: 24px;
    width: 24px;
    display: inline-block;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    border-left-color: #5cb85c;
    animation: rotate 1.2s linear infinite;
  }

  @keyframes rotate {
    50% {
      border-left-color: #9b59b6;
    }
    75% {
      border-left-color: #e67e22;
    }
    100% {
      transform: rotate(360deg);
    }
  }

  label .check-icon {
    display: none;
  }

  label .check-icon:after {
    position: absolute;
    content: '';
    top: 55%;
    left: 3px;
    transform: scaleX(-1) rotate(135deg);
    height: 14px;
    width: 7px;
    border-top: 2px solid #5cb85c;
    border-right: 2px solid #5cb85c;
    transform-origin: left top;
    animation: check-icon 0.8s ease;
  }

  @keyframes check-icon {
    0% {
      height: 0;
      width: 0;
      opacity: 1;
    }
    20% {
      height: 0;
      width: 7px;
      opacity: 1;
    }
    40% {
      height: 14px;
      width: 7px;
      opacity: 1;

    100% {
      height: 14px;
      width: 7px;
      opacity: 1;
    }
  }
`;

interface Props {
  checked: boolean;
}

const LoadingCheck: React.FC<Props> = ({ checked }) => {
  return (
    <StyledLoading>
      <input type="checkbox" id="check" checked={checked} />
      <label htmlFor="check">
        <div className="check-icon" />
      </label>
    </StyledLoading>
  );
};

export default LoadingCheck;
