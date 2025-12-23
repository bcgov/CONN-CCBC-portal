import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

interface LinkProps {
  selected: boolean;
}

export const StyledTab = styled(Link)<LinkProps>`
  text-decoration: none;
  font-weight: ${(props) => (props.selected ? 700 : 400)};
  font-size: 24px;
  white-space: nowrap;
  color: ${(props) => (props.selected ? props.theme.color.text : '#9B9B9B')};
  background-color: ${(props) => props.theme.color.white};
  padding: 8px 16px 0px 16px;
  border: 1px solid #d6d6d6;
  border-bottom: ${(props) => (props.selected ? 'none' : '1px solid #d6d6d6')};
  border-radius: 4px 4px 0px 0px;
  margin-right: 16px;
  position: relative;
  top: ${(props) => (props.selected ? '0px' : '-1px')};

  &:hover {
    opacity: ${(props) => (props.selected ? `1` : `0.6`)};
  }

  @-moz-document url-prefix() {
    top: ${(props) => (props.selected ? '-1.2px' : '-2px')};
  }
`;

const StyledNav = styled.nav`
  border-bottom: 1px solid #d6d6d6;
  margin-bottom: 16px;
`;

const AdminTabs = () => {
  const router = useRouter();
  const downloadAttachmentsHref = '/analyst/admin/download-attachments';
  const applicationIntakesHref = '/analyst/admin/application-intakes';
  const listOfAnalystsHref = '/analyst/admin/list-of-analysts';
  const utilitiesHref = '/analyst/admin/utilities';

  return (
    <StyledNav>
      <StyledTab
        href={downloadAttachmentsHref}
        selected={router?.pathname.includes(downloadAttachmentsHref)}
      >
        Download attachments
      </StyledTab>
      <StyledTab
        href={applicationIntakesHref}
        passHref
        selected={router?.pathname.includes(applicationIntakesHref)}
      >
        Application intakes
      </StyledTab>
      <StyledTab
        href={listOfAnalystsHref}
        passHref
        selected={router?.pathname.includes(listOfAnalystsHref)}
      >
        List of analysts
      </StyledTab>
      <StyledTab
        href={utilitiesHref}
        passHref
        selected={router?.pathname.includes(utilitiesHref)}
      >
        Utilities
      </StyledTab>
    </StyledNav>
  );
};

export default AdminTabs;
