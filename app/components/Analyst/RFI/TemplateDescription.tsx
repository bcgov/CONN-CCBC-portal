import { Link } from '@button-inc/bcgov-theme';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const HintText = styled.p`
  color: ${(props) => props.theme.color.darkGrey};
  font-style: italic;
  font-size: 13px;
  a {
    color: ${(props) => props.theme.color.links};
    font-size: 13px;
    &:hover {
      text-decoration: underline;
    }
  }
`;

interface Props {
  templateNumber: number;
}

const TemplateDescription: React.FC<Props> = ({ templateNumber }) => {
  const applicationId = useRouter().query.applicationId as string;
  if (!templateNumber) return null;
  const link = (
    <Link
      href={`/analyst/application/${applicationId}?section=${templateNumber === 1 ? 'benefits' : 'budgetDetails'}`}
      passHref
    >
      {templateNumber === 1 ? 'Benefits' : 'Budget Details'}
    </Link>
  );

  return (
    (templateNumber === 1 || templateNumber === 2) && (
      <HintText>
        * RFI upload for Template {templateNumber} automatically updates the
        data for{' '}
        {templateNumber === 1
          ? 'Final Eligible Households and Indigenous'
          : 'Total Eligible Costs and Total Project Costs'}{' '}
        in the {link} section. Please verify the changes on the application
        page.*
      </HintText>
    )
  );
};

export default TemplateDescription;
