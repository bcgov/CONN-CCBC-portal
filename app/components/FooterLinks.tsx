import styled from 'styled-components';
import Link from '@button-inc/bcgov-theme/Link';
import GlobalTheme from '../styles/GlobalTheme';

const StyledUl = styled.ul`
  padding-left: 20px;
`;

export default function FooterLinks() {
  return (
    <GlobalTheme>
      <StyledUl>
        <li key="0">
          <Link href="https://www.gov.bc.ca/connectingcommunitiesbc">
            Program details
          </Link>
        </li>
        <li key="1">
          <Link href="https://www2.gov.bc.ca/gov/content/home/disclaimer">
            Disclaimer
          </Link>
        </li>
        <li key="2">
          <Link href="https://www2.gov.bc.ca/gov/content/home/privacy">
            Privacy
          </Link>
        </li>
        <li key="3">
          <Link href="https://www2.gov.bc.ca/gov/content/home/accessible-government">
            Accessibility
          </Link>
        </li>
        <li key="4">
          <Link href="https://www2.gov.bc.ca/gov/content/home/copyright">
            Copyright
          </Link>
        </li>
      </StyledUl>
    </GlobalTheme>
  );
}
