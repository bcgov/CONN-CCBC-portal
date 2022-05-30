import type { NextPage } from 'next';
import Link from 'next/link';
import { createApplicationMutation } from '../schema/mutations';
import StyledGovButton from '../components/StyledGovButton';

const Dashboard: NextPage = () => {
  const handleClick = () => {
    const owner = '74d2515660e6444ca177a96e67ecfc5f';
    createApplicationMutation(owner);
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <Link href="/form/1" passHref>
        <StyledGovButton onClick={handleClick}>Start Form</StyledGovButton>
      </Link>
    </div>
  );
};

export default Dashboard;
