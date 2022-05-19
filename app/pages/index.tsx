import type { NextPage } from 'next';
import Link from 'next/link';
import { createApplicationMutation } from '../schema/mutations';
import StyledGovButton from '../components/StyledGovButton';

const Home: NextPage = () => {
  const handleClick = () => {
    const owner = '74d2515660e6444ca177a96e67ecfc5f';
    createApplicationMutation(owner);
  };
  return (
    <div>
      <h1>Welcome</h1>
      <p>General information:</p>
      <ul>
        <li>Please read the Application Guide.</li>
        <li>Please fill out all templates before completing application</li>
        <li>
          Applicants can apply for multiple projects and technology types but
          must demonstrate the required qualifications for each.
        </li>
      </ul>
      <p>
        To begin the application, please log in with BCeID Business. If you do
        not have BCeID Business, please use your BCeID Basic.
      </p>
      <Link href="/form/1" passHref>
        <StyledGovButton onClick={handleClick}>Login</StyledGovButton>
      </Link>
    </div>
  );
};

export default Home;
