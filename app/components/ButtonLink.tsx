import React from 'react';
import Link from 'next/link';
import Button from '@button-inc/bcgov-theme/Button';

type Props = {
  children: React.ReactNode;
  href: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  disabled?: boolean;
};

const ButtonLink = ({
  children,
  href,
  onClick,
  disabled = false,
  ...rest
}: Props) => (
  <Link href={href} passHref {...rest}>
    <Button onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  </Link>
);
ButtonLink.defaultProps = { onClick: () => true };

export default ButtonLink;
