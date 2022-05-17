import { BaseNavigation } from '@button-inc/bcgov-theme/Navigation';
import { BaseHeader } from '@button-inc/bcgov-theme/Header';
import Image from 'next/image';

interface Props {
  isLoggedIn?: boolean;
  title?: string;
}

const Navigation: React.FC<Props> = ({
  isLoggedIn = false,
  title = 'Connected Communities BC',
}) => {
  const rightSide = isLoggedIn ? (
    <div>Log out | Dashboard</div>
  ) : (
    <div>Log out | Dashboard</div>
  );

  return (
    <BaseNavigation>
      <BaseHeader>
        <BaseHeader.Group className="banner">
          <a href="/">
            <Image
              priority
              src="/icons/BCID_CC_RGB_rev.svg"
              alt="Logo for Province of British Columbia Connected Communities"
              height={100}
              width={300}
            />
          </a>
        </BaseHeader.Group>
        <BaseHeader.Item>{title}</BaseHeader.Item>
        <BaseHeader.Group>{rightSide}</BaseHeader.Group>
      </BaseHeader>
    </BaseNavigation>
  );
};

export default Navigation;
