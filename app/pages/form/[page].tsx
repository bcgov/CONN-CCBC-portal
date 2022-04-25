import { useRouter } from 'next/router';
import StyledGovButton from '../../components/StyledGovButton';
import { Forms, getHandler } from '../../form-schema';
import schema from '../../formSchema/schema';
import applySession from 'next-session';

export default function FormPage(
  formIndex: number,
  formData: any,
  validPage: boolean,
  prevPageUrl: number
) {
  const Form = Forms[formIndex];
  const router = useRouter();
  const onFirstPage = prevPageUrl === -1;
  const currentPage = formIndex + 1;

  const rerouteHandler = (nextPage: string) => {
    router.push(nextPage);
  };

  const handleBackClick = () => {
    if (onFirstPage) return;
    router.push(`/form${prevPageUrl}`);
  };

  return (
    <>
      {validPage && (
        <Form formData={formData} rerouteHandler={rerouteHandler}>
          {!onFirstPage && (
            <StyledGovButton
              type="button"
              variant="secondary"
              onClick={handleBackClick}
            >
              Back
            </StyledGovButton>
          )}
          <StyledGovButton type="button" variant="primary">
            Continue
          </StyledGovButton>
        </Form>
      )}
    </>
  );
}

export async function getServerSideProps({ req, res }: any) {
  await applySession(req);
  const { formIndex, formData, validPage, prevPageUrl } = getHandler(req);
  return {
    props: { formIndex, formData, validPage, prevPageUrl },
  };
}
