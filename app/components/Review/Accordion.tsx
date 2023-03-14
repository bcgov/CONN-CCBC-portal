import { useRouter } from 'next/router';
import { BaseAccordion } from '@button-inc/bcgov-theme/Accordion';
import styled from 'styled-components';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
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

const Accordion = ({
  allowAnalystEdit,
  children,
  defaultToggled,
  error,
  name,
  onToggle,
  toggled,
  title,
  ...rest
}: any) => {
  const [isToggled, setIsToggled] = useState(
    getToggledState(toggled, defaultToggled)
  );
  const router = useRouter();
  const applicationId = router.query.applicationId as string;
  const handleToggle = (event) => {
    setIsToggled((toggle) => !toggle);
    if (onToggle) onToggle(event);
  };

  // ugly and I don't like it
  useEffect(() => {
    setIsToggled(getToggledState(toggled, defaultToggled));
  }, [toggled]);

  return (
    <StyledBaseAccordion {...rest} onToggle={handleToggle}>
      <header>
        <h2>{title}</h2>
        <StyledToggleRight>
          {allowAnalystEdit && (
            <Link
              href={`/analyst/application/${applicationId}/edit/${name}`}
              passHref
            >
              <StyledButton>
                <FontAwesomeIcon icon={faPen} fixedWidth />
              </StyledButton>
            </Link>
          )}

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
      </header>
      {isToggled && <div>{children}</div>}
    </StyledBaseAccordion>
  );
};

export default Accordion;
