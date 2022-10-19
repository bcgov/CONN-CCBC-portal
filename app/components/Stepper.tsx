import { useRouter } from 'next/router';
import { JSONSchema7 } from 'json-schema';
import Link from 'next/link';
import styled from 'styled-components';
import schema from 'formSchema/schema';
import uiSchema from 'formSchema/uiSchema/uiSchema';
import getFormPage from 'utils/getFormPage';

const StyledNav = styled('nav')`
  display: none;
  margin-right: 1em;

  ${(props) => props.theme.breakpoint.mediumUp} {
    display: block;
  }
`;

const StyledDiv = styled('div')`
  background-color: ${(props) => props.theme.color.stepperGrey};
  display: flex;
  align-items: center;
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
  color: ${(props) => props.theme.color.links};
  text-decoration: none;
  padding: 16px 40px;
`;

const formPageList = uiSchema['ui:order'].filter((formName) => {
  return formName !== 'submission';
});

const Stepper = () => {
  const router = useRouter();
  const rowId = router.query.id;
  const formPageSchema = schema.properties;

  return (
    <StyledNav>
      {formPageList.map((formName) => {
        const isCurrentPage =
          formPageList[Number(router.query.page) - 1] === formName;

        const pageNumber = getFormPage(formName);
        const formSchema = formPageSchema[formName] as JSONSchema7;
        return (
          <>
            {isCurrentPage ? (
              <StyledActive>
                <Link
                  href={`/applicantportal/form/${rowId}/${pageNumber}`}
                  key={formName}
                  passHref
                >
                  <StyledLink>{formSchema.title}</StyledLink>
                </Link>
              </StyledActive>
            ) : (
              <StyledDiv>
                <Link
                  href={`/applicantportal/form/${rowId}/${pageNumber}`}
                  key={formName}
                  passHref
                >
                  <StyledLink>{formSchema.title}</StyledLink>
                </Link>
              </StyledDiv>
            )}
          </>
        );
      })}
    </StyledNav>
  );
};

export default Stepper;
