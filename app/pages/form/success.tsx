import Link from 'next/link';
import Button from '@button-inc/bcgov-theme/Button';
import SuccessBanner from '../../components/Form/SuccessBanner';
import styled from 'styled-components';

const StyledSection = styled.section`
  margin: 24px 0;
`;

const StyledDiv = styled.div`
  margin: 24px;
`;

const Success = () => {
  return (
    <StyledDiv>
      <StyledSection>
        <SuccessBanner />
        <h3>Thank you for applying to CCBC Intake 1</h3>
        <div>We have received your application for Sudden Valley.</div>
        <div>
          You can edit this application until the intake closes on YYYY/MM/DD.
        </div>
      </StyledSection>
      <Link href="/" passHref>
        <Button>Return to dashboard</Button>
      </Link>
    </StyledDiv>
  );
};

export default Success;
