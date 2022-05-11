import { useRouter } from 'next/router';
import StyledGovButton from '../../components/StyledGovButton';
// import { Forms, getHandler } from '../../form-schema';
import schema from '../../formSchema/schema';
import { applySession } from 'next-session';
import FormDiv from '../../components/FormDiv';
import ApplicationForm from '../../components/Form/ApplicationForm';

export default function FormPage({
  formIndex,
  formData,
  validPage,
  prevPageUrl,
}: any) {
  // const Form = Forms[formIndex];
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

  const onSumbit = () => {
    console.log('Form Submitted');
  };

  return (
    <>
      <FormDiv>
        <ApplicationForm onSubmit={onSumbit}></ApplicationForm>
      </FormDiv>
    </>
  );
}
