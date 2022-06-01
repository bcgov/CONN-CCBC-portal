import type { NextPage } from 'next';
import { LoginForm } from '../components';

const Home: NextPage = () => {
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
      <LoginForm />
    </div>
  );
};

export default Home;
