import type { NextPage } from 'next';
import Link from 'next/link';
import StyledGovButton from '../components/StyledGovButton';

const Home: NextPage = () => {
  return (
    <div>
      <Link href="/form/1" passHref>
        <StyledGovButton>Start Form</StyledGovButton>
      </Link>
    </div>
  );
};

export default Home;
