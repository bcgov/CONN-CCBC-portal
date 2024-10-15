import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { BaseAccordion } from '@button-inc/bcgov-theme/Accordion';
import styled from 'styled-components';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import CbcRecordLock from 'components/Analyst/CBC/CbcRecordLock';
import { Tooltip } from '@mui/material';
import AlertIcon from './AlertIcon';

export function getToggledState(
  toggled: boolean | null | undefined,
  defaultToggle: boolean
) {
  if (toggled === null || toggled === undefined) {
    return defaultToggle;
  }
  return toggled;
}

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

const StyledButton = styled.button`
  border-radius: 0;
  appearance: none;
`;

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const StyledTooltip = styled(Tooltip)`
  cursor: pointer;
`;

const Accordion = ({
  allowAnalystEdit,
  children,
  defaultToggled,
  isCBC,
  cbcId,
  error,
  sectionErrors,
  name,
  onToggle,
  toggled,
  title,
  recordLocked,
  focused,
  ...rest
}: any) => {
  const [isToggled, setIsToggled] = useState(
    getToggledState(toggled, defaultToggled)
  );
  const router = useRouter();
  const applicationId = router.query.applicationId as string;
  const accordionRef = useRef(null);

  const handleToggle = (event) => {
    setIsToggled((toggle) => !toggle);
    if (onToggle) onToggle(event);
  };
  const editUrl = isCBC
    ? `/analyst/cbc/${cbcId}/edit/${name}`
    : `/analyst/application/${applicationId}/edit/${name}`;

  // ugly and I don't like it
  useEffect(() => {
    setIsToggled(getToggledState(toggled, defaultToggled));
  }, [toggled, defaultToggled]);

  useEffect(() => {
    if (focused && accordionRef.current) {
      window.scrollTo({
        top:
          accordionRef.current.getBoundingClientRect().top +
          window.scrollY -
          100, // Adjust offset to account for header
        behavior: 'smooth',
      });
    }
  }, [focused]);

  return (
    <StyledBaseAccordion {...rest} onToggle={handleToggle}>
      <header ref={accordionRef}>
        <h2>{title}</h2>
        <StyledToggleRight>
          {allowAnalystEdit &&
            (recordLocked ? (
              <CbcRecordLock
                id={`${name}-lock-edit`}
                onConfirm={() => router.push(editUrl)}
              />
            ) : (
              <StyledLink href={editUrl} passHref>
                <StyledButton>
                  <FontAwesomeIcon icon={faPen} fixedWidth color="#1A5A96" />
                </StyledButton>
              </StyledLink>
            ))}

          {error && (
            <StyledTooltip title={sectionErrors?.join('\n')} placement="top">
              <StyledAlert data-testid="styled-alert">
                <AlertIcon />
              </StyledAlert>
            </StyledTooltip>
          )}
          <button type="button" onClick={handleToggle}>
            {isToggled ? (
              <FontAwesomeIcon icon={faMinus} fixedWidth />
            ) : (
              <FontAwesomeIcon icon={faPlus} fixedWidth />
            )}
          </button>
        </StyledToggleRight>
      </header>
      <section
        aria-hidden={!isToggled}
        style={!isToggled ? { display: 'none' } : undefined}
      >
        {children}
      </section>
    </StyledBaseAccordion>
  );
};

export default Accordion;
