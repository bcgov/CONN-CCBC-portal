import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import uiSchema from 'formSchema/uiSchema/uiSchema';
import getFormPage from 'utils/getFormPage';
import { RJSFSchema } from '@rjsf/utils';

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

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.color.links};
  text-decoration: none;
  padding: 16px 40px;
`;

const formPageListNoSubmission = uiSchema['ui:order'].filter((formName) => {
  return formName !== 'submission';
});

interface StepperProps {
  schema: RJSFSchema;
}

const Stepper: React.FC<StepperProps> = ({ schema }) => {
  const router = useRouter();
  const rowId = router.query.id;
  const formSchema = schema.properties;

  const formPageList = formPageListNoSubmission.filter((formName) => {
    return Object.prototype.hasOwnProperty.call(formSchema, formName);
  });

  return (
    <StyledNav>
      {formPageList.map((formName) => {
        const isCurrentPage =
          formPageList[Number(router.query.page) - 1] === formName;

        const pageNumber = getFormPage(formPageList, formName);
        const formPageSchema = formSchema[formName] as RJSFSchema;
        if (!formPageSchema) return null;
        return (
          <>
            {isCurrentPage ? (
              <StyledActive>
                <StyledLink
                  href={`/applicantportal/form/${rowId}/${pageNumber}`}
                  key={formName}
                  passHref
                >
                  {formPageSchema.title}
                </StyledLink>
              </StyledActive>
            ) : (
              <StyledDiv>
                <StyledLink
                  href={`/applicantportal/form/${rowId}/${pageNumber}`}
                  key={formName}
                  passHref
                >
                  {formPageSchema?.title}
                </StyledLink>
              </StyledDiv>
            )}
          </>
        );
      })}
    </StyledNav>
  );
};

export default Stepper;
