import { useRouter } from 'next/router';
import FormDiv from '../../components/FormDiv';
import ApplicationForm from '../../components/Form/ApplicationForm';
import { getApplicationByOwnerQuery } from '../../schema/queries';
import { useLazyLoadQuery } from 'react-relay';

export default function FormPage({
  // formData,
  // validPage,
  formIndex,
  prevPageUrl,
}: {
  formData: any;
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

  const formData = application?.applicationByOwner?.formData;
  const pageNumber = router.query.page
  return (
    <FormDiv>
      <ApplicationForm pageNumber={parseInt(pageNumber as string)} formData={formData} />
    </FormDiv>
  );
}
