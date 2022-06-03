import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import StyledGovButton from '../components/StyledGovButton';
import { useCreateApplicationMutation } from '../schema/mutations/application/createApplication';
import { Layout } from '../components';

const Dashboard: NextPage = () => {
  const router = useRouter();

  const [createApplication] = useCreateApplicationMutation();

  const handleCreateApplication = () => {
    createApplication({
      variables: {
        input: { application: { owner: '74d2515660e6444ca177a96e67ecfc5f' } },
      },
      onCompleted: () => {
        router.push('/form/1');
      },
      onError: () => {
        // This needs to be removed once application dashboard implemented
        router.push('/form/1');
      },
    });
  };
  return (
    <Layout session={{}} title="Connecting Communities BC">
      <div>
        <h1>Dashboard</h1>
        <Link href="/form/1" passHref>
          <StyledGovButton onClick={handleCreateApplication}>
            New application
          </StyledGovButton>
        </Link>
        <h4>No applications yet</h4>
        <p>Start a new application; applications will appear here</p>
      </div>
    </Layout>
  );
};

export default Dashboard;
