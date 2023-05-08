import React, { useCallback, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  faCircleCheck,
  faExclamationTriangle,
  faTimesCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { theme } from 'dist/styles/GlobalTheme';

type ToastType = 'success' | 'warning' | 'error';

type ToastDirection = 'left' | 'right';

interface ToastProps {
  type?: ToastType;
  children: React.ReactNode;
  onClose?: () => void;
  slideDirection?: ToastDirection;
  timeout?: number;
  disableAnimations?: boolean;
}

const slideIn = (direction: ToastDirection) => keyframes`
  0% {
    transform: translateX(${direction === 'left' ? '-100%' : '100%'});
  }
  100% {
    transform: translateX(0);
  }
`;

const slideOut = (direction: ToastDirection) => keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(${direction === 'left' ? '-100%' : '100%'});
}
`;

const getBackgroundColor = (toastType: ToastType) => {
  if (toastType === 'error') {
    return theme.color.error;
  }
  if (toastType === 'warning') {
    return theme.color.primaryYellow;
  }
  return theme.color.success;
};

const ToastContainer = styled.div<{
  visible: boolean;
  slideDirection: ToastDirection;
  type: ToastType;
  disableAnimations: boolean;
}>`
  display: flex;
  align-items: center;
  padding: 16px;
  position: fixed;
  bottom: ${(props) => props.theme.spacing.medium};
  ${({ slideDirection }) =>
    slideDirection === 'left' ? 'left' : 'right'}: 24px;
  background-color: ${({ type }) => getBackgroundColor(type)};
  color: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  ${({ disableAnimations, visible, slideDirection }) =>
    !disableAnimations &&
    css`
      animation: ${visible ? slideIn(slideDirection) : slideOut(slideDirection)}
        0.3s ease;
      animation-fill-mode: forwards;
    `}
  transition: transform 0.3s ease;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${(props) => props.theme.spacing.small};
`;

const Message = styled.div``;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  margin-left: ${(props) => props.theme.spacing.small};
  padding: 0;
  background-color: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  outline: none;

  &:hover {
    opacity: 0.8;
  }
`;

const Toast: React.FC<ToastProps> = ({
  type = 'success',
  children,
  onClose,
  slideDirection = 'left',
  timeout = 10000,
  disableAnimations = false,
}) => {
  const [visible, setVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const handleClose = useCallback(() => {
    setVisible(false);
    if (onClose) onClose();
  }, [setVisible, onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, handleClose]);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // The same duration as the slide-out animation
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <ToastContainer
      visible={visible}
      slideDirection={slideDirection}
      type={type}
      disableAnimations={disableAnimations}
    >
      <IconContainer>
        {type === 'success' && <FontAwesomeIcon icon={faCircleCheck} />}
        {type === 'warning' && <FontAwesomeIcon icon={faExclamationTriangle} />}
        {type === 'error' && <FontAwesomeIcon icon={faTimesCircle} />}
      </IconContainer>
      <Message>{children}</Message>
      <CloseButton onClick={handleClose}>
        <FontAwesomeIcon icon={faTimes} />
      </CloseButton>
    </ToastContainer>
  );
};

export default Toast;
