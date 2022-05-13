import Link from 'next/link';

export default function FooterLinks() {
  return (
    <ul>
      <li key="0">
        <Link href="https://www2.gov.bc.ca/gov/content/governments/connectivity-in-bc">
          <a>Home</a>
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
    </ul>
  );
}
