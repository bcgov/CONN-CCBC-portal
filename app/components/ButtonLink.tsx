import Link from 'next/link';
import Button from '@button-inc/bcgov-theme/Button';

type Props = {
  children: JSX.Element | JSX.Element[] | string | string[];
  href: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
};

const ButtonLink = ({ children, href, onClick }: Props) => (
  <Link href={href} passHref>
    <Button onClick = {onClick} >{children}</Button>
  </Link>
);
ButtonLink.defaultProps = {onClick: () => true};

export default ButtonLink;
