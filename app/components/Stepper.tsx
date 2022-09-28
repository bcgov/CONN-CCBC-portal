import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import schema from 'formSchema/schema';
import uiSchema from 'formSchema/uiSchema/uiSchema';
import getFormPage from 'utils/getFormPage';

const StyledNav = styled('nav')`
  display: none;
  margin-right: 1em;

  @media (min-width: 768px) {
    display: block;
  }
`;

const StyledDiv = styled('div')`
  color: ${(props) => props.theme.color.links};
  background-color: ${(props) => props.theme.color.stepperGrey};
  display: flex;
  align-items: center;
  padding: 16px 40px;
  margin: 1px 0;
  width: 290px;

  &:hover {
    background-color: ${(props) => props.theme.color.stepperHover};
    text-decoration: underline;
  }
`;

const StyledActive = styled(StyledDiv)`
  background-color: ${(props) => props.theme.color.stepperBlue};
  text-decoration: underline;
  font-weight: 600;

  &:hover {
    background-color: ${(props) => props.theme.color.stepperBlue};
  }
`;

const StyledLink = styled('a')`
  text-decoration: none;
`;

const Stepper = () => {
  const router = useRouter();
  const rowId = router.query.id;

  const formPageList = uiSchema['ui:order'].filter(function (page) {
    return page !== 'submission';
  });

  const formPageSchema = schema.properties;

  return (
    <StyledNav>
      {formPageList.map((page) => {
        const isCurrentPage =
          formPageList[Number(router.query.page) - 1] === page;

        const pageNumber = getFormPage(page);

        return (
          <Link href={`/form/${rowId}/${pageNumber}`} key={page} passHref>
            <StyledLink>
              {isCurrentPage ? (
                <StyledActive>{formPageSchema[page]['title']}</StyledActive>
              ) : (
                <StyledDiv>{formPageSchema[page]['title']}</StyledDiv>
              )}
            </StyledLink>
          </Link>
        );
      })}
    </StyledNav>
  );
};

export default Stepper;
