import Link from 'next/link';
import { useRouter } from 'next/router';

import styled from 'styled-components';

const StyledNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 16px;
  margin: 4px 0 16px 0;
  border-bottom: 1px solid #d6d6d6;
`;

interface AnchorProps {
  selected: boolean;
}

const StyledLink = styled(Link)<AnchorProps>`
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
      <StyledLink
        passHref
        href={`${baseUrl}/screening`}
        selected={`${baseUrl}/screening` === router.asPath}
      >
        Screening
      </StyledLink>
      <StyledLink
        passHref
        href={`${baseUrl}/gis`}
        selected={`${baseUrl}/gis` === router.asPath}
      >
        GIS
      </StyledLink>
      <StyledLink
        passHref
        href={`${baseUrl}/technical`}
        selected={`${baseUrl}/technical` === router.asPath}
      >
        Technical
      </StyledLink>
      <StyledLink
        passHref
        href={`${baseUrl}/project-management`}
        selected={`${baseUrl}/project-management` === router.asPath}
      >
        Project Management
      </StyledLink>
      <StyledLink
        passHref
        href={`${baseUrl}/financial-risk`}
        selected={`${baseUrl}/financial-risk` === router.asPath}
      >
        Financial Risk
      </StyledLink>
      <StyledLink
        passHref
        href={`${baseUrl}/permitting`}
        selected={`${baseUrl}/permitting` === router.asPath}
      >
        Permitting
      </StyledLink>
    </StyledNav>
  );
};

export default AssessmentsTabs;
