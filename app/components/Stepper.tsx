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
  background-color: ${(props) => props.theme.color.stepperGrey};
  display: flex;
  align-items: center;
  padding: 16px 40px;
  margin: 1px 0;
  width: 290px;

  &:hover {
    opacity: 0.7;
  }
`;

const StyledLink = styled('a')`
  color: ${(props) => props.theme.color.links};
  text-decoration: none;

  &:hover {
    text-decoration: underline;f
  }
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
          <StyledDiv
            key={page}
            style={{
              fontWeight: isCurrentPage ? 600 : 400,
              textDecoration: isCurrentPage ? 'underline' : 'none',
            }}
          >
            <Link href={`/form/${rowId}/${pageNumber}`} passHref>
              <StyledLink>{formPageSchema[page]['title']}</StyledLink>
            </Link>
          </StyledDiv>
        );
      })}
    </StyledNav>
  );
};

export default Stepper;
