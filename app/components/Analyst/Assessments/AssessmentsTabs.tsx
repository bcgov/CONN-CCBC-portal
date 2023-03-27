import Link from 'next/link';
import { useRouter } from 'next/router';

import styled from 'styled-components';

const StyledNav = styled.nav`
  padding-bottom: 16px;
  margin: 4px 0 16px 0;
  border-bottom: 1px solid #d6d6d6;
`;

interface AnchorProps {
  selected: boolean;
}

const StyledAnchor = styled.a<AnchorProps>`
  color: ${(props) =>
    props.selected
      ? `${props.theme.color.text}`
      : `${props.theme.color.disabledGrey}`};
  margin-right: 40px;
  font-size: 24px;
  font-weight: ${(props) => (props.selected ? 700 : 400)};
  line-height: 33px;
  align-self: center;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    opacity: ${(props) => (props.selected ? `1` : `0.6`)};
  }
`;

const AssessmentsTabs = () => {
  const router = useRouter();
  const { applicationId } = router.query;
  const baseUrl = `/analyst/application/${applicationId}/assessments`;

  return (
    <StyledNav>
      <Link passHref href={`${baseUrl}/screening`}>
        <StyledAnchor selected={`${baseUrl}/screening` === router.asPath}>
          Screening
        </StyledAnchor>
      </Link>
      <Link passHref href={`${baseUrl}/gis`}>
        <StyledAnchor selected={`${baseUrl}/gis` === router.asPath}>
          GIS
        </StyledAnchor>
      </Link>
      <Link passHref href={`${baseUrl}/technical`}>
        <StyledAnchor selected={`${baseUrl}/technical` === router.asPath}>
          Technical
        </StyledAnchor>
      </Link>
      <Link passHref href={`${baseUrl}/project-management`}>
        <StyledAnchor
          selected={`${baseUrl}/project-management` === router.asPath}
        >
          Project Management
        </StyledAnchor>
      </Link>
      <Link passHref href={`${baseUrl}/financial-risk`}>
        <StyledAnchor selected={`${baseUrl}/financial-risk` === router.asPath}>
          Financial Risk
        </StyledAnchor>
      </Link>
      <Link passHref href={`${baseUrl}/permitting`}>
        <StyledAnchor selected={`${baseUrl}/permitting` === router.asPath}>
          Permitting
        </StyledAnchor>
      </Link>
    </StyledNav>
  );
};

export default AssessmentsTabs;
