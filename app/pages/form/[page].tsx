import { useRouter } from 'next/router';
import { ApplicationForm, Back } from '../../components/Form';
import FormDiv from '../../components/FormDiv';
import { getApplicationByOwnerQuery } from '../../schema/queries';
import { useLazyLoadQuery } from 'react-relay';

export default function FormPage() {
  const router = useRouter();

  const application: any = useLazyLoadQuery(getApplicationByOwnerQuery, {
    owner: '74d2515660e6444ca177a96e67ecfc5f',
  });

  const formData = application?.applicationByOwner?.formData;
  const pageNumber = Number(router.query.page);

  return (
    <FormDiv>
      <Back pageNumber={pageNumber} />
      <ApplicationForm pageNumber={pageNumber} formData={formData} />
    </FormDiv>
  );
}
