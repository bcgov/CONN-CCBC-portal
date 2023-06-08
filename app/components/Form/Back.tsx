import Link from 'next/link';
import styled from 'styled-components';

interface Props {
  pageNumber: number;
  applicationId: number;
}

const StyledDiv = styled.div`
  margin: 24px 0;
`;

const Back = ({ pageNumber, applicationId }: Props) => {
  const url =
    pageNumber > 1
      ? `/applicantportal/form/${applicationId}/${pageNumber - 1}`
      : '/applicantportal/dashboard';

  return (
    <StyledDiv>
      <Link href={url}>{`< Back`}</Link>
    </StyledDiv>
  );
};

export default Back;
