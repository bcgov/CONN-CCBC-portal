import Link from 'next/link';

const Back = (currentIndex: any) => {
  return (
    <Link href={`/form/${currentIndex > 1 ? currentIndex - 1 : 1}`} passHref>
      <a>{`< Back`}</a>
    </Link>
  );
};

export default Back;
