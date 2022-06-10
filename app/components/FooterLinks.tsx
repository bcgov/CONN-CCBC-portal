import Link from 'next/link';
import styled from 'styled-components';
import GlobalTheme from '../styles/GlobalTheme';

const StyledUl = styled.ul`
  padding-left: 20px;
`;

export default function FooterLinks() {
  return (
    <GlobalTheme>
      <StyledUl>
        <li key="0">
          <Link href="https://www2.gov.bc.ca/gov/content/governments/connectivity-in-bc">
            <a style={{ paddingLeft: 0 }}>Home</a>
          </Link>
        </li>
        <li key="1">
          <Link href="https://www2.gov.bc.ca/gov/content/home/disclaimer">
            <a>Disclaimer</a>
          </Link>
        </li>
        <li key="2">
          <Link href="https://www2.gov.bc.ca/gov/content/home/privacy">
            <a>Privacy</a>
          </Link>
        </li>
        <li key="3">
          <Link href="https://www2.gov.bc.ca/gov/content/home/accessible-government">
            <a>Accessibility</a>
          </Link>
        </li>
        <li key="4">
          <Link href="https://www2.gov.bc.ca/gov/content/home/copyright">
            <a>Copyright</a>
          </Link>
        </li>
      </StyledUl>
    </GlobalTheme>
  );
}
