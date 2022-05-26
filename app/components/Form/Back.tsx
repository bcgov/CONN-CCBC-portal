import Link from 'next/link';
import styled from 'styled-components';

interface Props {
  pageNumber: number;
}

const StyledDiv = styled.div`
  margin: 24px 0;
`;

const Back = ({ pageNumber }: Props) => {
  const url = pageNumber > 1 ? `/form/${pageNumber - 1}` : '/';

  return (
    <StyledDiv>
      <Link href={url} passHref>
        <a>{`< Back`}</a>
      </Link>
    </StyledDiv>
  );
};

export default Back;
