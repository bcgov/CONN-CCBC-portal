import Link from 'next/link';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { CCBC_ASSESSMENT_RFI_INSTRUCTIONS } from 'data/externalConstants';

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.color.links};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

interface GuideProps {
  link?: string;
}

const GuideLink: React.FC<GuideProps> = ({
  link = CCBC_ASSESSMENT_RFI_INSTRUCTIONS,
}) => {
  return (
    <StyledLink href={link} target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faBookOpen} /> Guide
    </StyledLink>
  );
};

export default GuideLink;
