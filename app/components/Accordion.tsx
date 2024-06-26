import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import AccordionContainer from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

const StyledH2 = styled.h2`
  margin-bottom: 0;
  max-width: 70%;
`;

const StyledFlex = styled.div`
  position: absolute;
  right: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

const Accordion = ({ children, headerContent, isExpanded, title }) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) =>
    (_event: React.SyntheticEvent, isExpandedState: boolean) => {
      setExpanded(isExpandedState ? panel : false);
    };

  // Allow external isExpanded to control the accordion while still allowing the user to expand/collapse
  useEffect(() => {
    if (isExpanded) {
      setExpanded('panel1');
    } else {
      setExpanded(false);
    }
  }, [isExpanded]);

  const isAccordionExpanded = expanded === 'panel1';

  return (
    <AccordionContainer
      disableGutters
      sx={{
        border: 'none',
        boxShadow: 'none',
      }}
      expanded={isAccordionExpanded}
      onChange={handleChange('panel1')}
    >
      <AccordionSummary
        sx={{
          borderTop: '1px solid #000057',
          fontSize: '32px',
          height: '30px',
        }}
        expandIcon={
          <FontAwesomeIcon
            data-testid="accordion-icon"
            icon={isAccordionExpanded ? faMinus : faPlus}
            color="#000057"
          />
        }
      >
        <StyledH2>{title}</StyledH2>
        <StyledFlex>{isAccordionExpanded && headerContent}</StyledFlex>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </AccordionContainer>
  );
};

export default Accordion;
