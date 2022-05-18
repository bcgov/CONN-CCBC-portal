import { BaseHeader } from '@button-inc/bcgov-theme/Header';
import { SubHeaderNavbarLinks } from '.';

const SubHeader: React.FC = () => {
  return (
    <BaseHeader header="sub">
      <SubHeaderNavbarLinks />
    </BaseHeader>
  );
};

export default SubHeader;
