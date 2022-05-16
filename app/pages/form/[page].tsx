import { useRouter } from 'next/router';
import FormDiv from '../../components/FormDiv';
import ApplicationForm from '../../components/Form/ApplicationForm';
import { updateApplicationMutation } from '../../schema/mutations';
import { getApplicationByOwnerQuery } from '../../schema/queries';

import { useLazyLoadQuery } from 'react-relay';

export default function FormPage({
  // formData,
  // validPage,
  formIndex,
  prevPageUrl,
}: {
  formData: string;
  formIndex: number;
  prevPageUrl: number;
  validPage: boolean;
}) {
  const router = useRouter();

  const application: any = useLazyLoadQuery(getApplicationByOwnerQuery, {
    owner: '74d2515660e6444ca177a96e67ecfc5f',
  });

  // const onFirstPage = prevPageUrl === -1;
  // const currentPage = formIndex + 1;

  // const rerouteHandler = (nextPage: string) => {
  //   router.push(nextPage);
  // };

  // const handleBackClick = () => {
  //   if (onFirstPage) return;
  //   router.push(`/form${prevPageUrl}`);
  // };

  const onSubmit = async ({ formData = [] }) => {
    console.log(formData);
    await updateApplicationMutation({
      owner: '74d2515660e6444ca177a96e67ecfc5f',
      formData: JSON.stringify(formData),
      status: 'complete',
    }).then(() => {
      router.push('/form/success');
    });
  };

  const formData = application?.applicationByOwner?.formData;

  return (
    <FormDiv>
      <ApplicationForm formData={formData} onSubmit={onSubmit} />
    </FormDiv>
  );
}
