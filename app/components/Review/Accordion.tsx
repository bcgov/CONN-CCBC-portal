import { BaseAccordion } from '@button-inc/bcgov-theme/Accordion';
import React from 'react';
import styled from 'styled-components';
import noop from 'lodash/noop';
import AlertIcon from './AlertIcon';

const ToggleRight = styled.div`
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  font-size: 2em;
`;

const StyledBaseAccordion = styled(BaseAccordion)`
  h2 {
    margin-bottom: 0;
    display: flex;
    align-items: center;
    font-size: 24px;
  }

  svg {
    width: 20px;
    height: 20px;
    vertical-align: 0;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const StyledToggleRight = styled(ToggleRight)`
  display: flex;
`;

const StyledAlert = styled('label')`
  margin-right: 16px;
`;

const Accordion = ({
  children,
  defaultToggled,
  error,
  onToggle,
  title,
  ...rest
}: any) => (
  <StyledBaseAccordion
    {...rest}
    onToggle={onToggle || noop}
    defaultToggled={defaultToggled}
  >
    <BaseAccordion.Header>
      <h2>{title}</h2>
      <StyledToggleRight>
        {error && (
          <StyledAlert>
            <AlertIcon />
          </StyledAlert>
        )}
        <BaseAccordion.ToggleOff>
          <Plus />
        </BaseAccordion.ToggleOff>
        <BaseAccordion.ToggleOn>
          <Minus />
        </BaseAccordion.ToggleOn>
      </StyledToggleRight>
    </BaseAccordion.Header>
    <BaseAccordion.Content>{children}</BaseAccordion.Content>
  </StyledBaseAccordion>
);

const Minus = () => (
  <svg
    width="20"
    height="6"
    viewBox="0 0 20 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.7891 0.160156V5.0625H0.296875V0.160156H19.7891Z"
      fill="#2D2D2D"
    />
  </svg>
);

const Plus = () => (
  <svg
    width="20"
    height="22"
    viewBox="0 0 20 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.7891 8.16016V13.0625H0.296875V8.16016H19.7891ZM12.7188 0.445312V21.1484H7.38672V0.445312H12.7188Z"
      fill="#2D2D2D"
    />
  </svg>
);
export default Accordion;
