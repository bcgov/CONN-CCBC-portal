import type { NextPage } from 'next';
import Link from 'next/link';
import StyledGovButton from '../components/StyledGovButton';

const Dashboard: NextPage = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link href="/form/1" passHref>
        <StyledGovButton>Start Form</StyledGovButton>
      </Link>
    </div>
  );
};

export default Dashboard;
