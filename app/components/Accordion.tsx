import { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import AccordionContainer from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

const StyledH2 = styled.h2`
  margin-bottom: 0;
  white-space: nowrap;
`;

const StyledAccordion = styled(AccordionContainer)`
  border: none;
  box-shadow: none;
`;

const StyledAccordionHeader = styled(AccordionSummary)`
  border-top: 1px solid #000057;
  font-size: 32px;
  height: 30px;
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
    (event: React.SyntheticEvent, isExpandedState: boolean) => {
      setExpanded(isExpandedState ? panel : false);
    };

  const isAccordionExpanded = isExpanded || expanded === 'panel1';

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <StyledAccordion
      disableGutters
      expanded={isAccordionExpanded}
      onChange={handleChange('panel1')}
    >
      <StyledAccordionHeader
        expandIcon={
          <FontAwesomeIcon
            icon={isAccordionExpanded ? faMinus : faPlus}
            color="#000057"
          />
        }
      >
        <StyledH2>{title}</StyledH2>
        <StyledFlex onClick={stopPropagation}>
          {expanded && headerContent}
        </StyledFlex>
      </StyledAccordionHeader>
      <AccordionDetails>{children}</AccordionDetails>
    </StyledAccordion>
  );
};

export default Accordion;
