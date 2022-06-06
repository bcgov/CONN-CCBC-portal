import Link from 'next/link';
import Button from '@button-inc/bcgov-theme/Button';

type Props = {
  children: JSX.Element | JSX.Element[] | string | string[];
  href: string;
};
const ButtonLink = ({ children, href }: Props) => {
  return (
    <Link href={href} passHref>
      <Button>{children}</Button>
    </Link>
  );
};

export default ButtonLink;
