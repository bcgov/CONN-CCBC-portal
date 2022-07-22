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
  const url = pageNumber > 1 ? `/form/${applicationId}/${pageNumber - 1}` : '/dashboard';

  return (
    <StyledDiv>
      <Link href={url} passHref>
        <a>{`< Back`}</a>
      </Link>
    </StyledDiv>
  );
};

export default Back;
