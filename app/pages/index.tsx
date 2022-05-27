import type { NextPage } from 'next';
import StyledGovButton from '../components/StyledGovButton';
import { useCreateApplicationMutation } from '../schema/mutations/application/createApplication';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
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
      <StyledGovButton onClick={handleCreateApplication}>Login</StyledGovButton>
    </div>
  );
};

export default Home;
