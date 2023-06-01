import {
  faFileContract,
  faFileExcel,
  faMap,
} from '@fortawesome/free-solid-svg-icons';
import FileHeader from 'components/Analyst/Project/ProjectInformation/FileHeader';

const projectInformationReadOnlyUiSchema = {
  main: {
    upload: {
      'ui:options': {
        flexDirection: 'row',
      },
      fundingAgreementUpload: {
        'ui:before': (
          <FileHeader title="Funding agreement" icon={faFileContract} />
        ),
        'ui:widget': 'ReadOnlyFileWidget',
      },
      statementOfWorkUpload: {
        'ui:before': (
          <FileHeader title="Statement of work table" icon={faFileExcel} />
        ),
        'ui:widget': 'ReadOnlyFileWidget',
      },
      finalizedMapUpload: {
        'ui:before': <FileHeader title="Finalized map" icon={faMap} />,
        'ui:widget': 'ReadOnlyFileWidget',
      },
    },
    dateFundingAgreementSigned: {
      'ui:title': 'Date funding agreement signed by recipient',
      'ui:widget': 'ReadOnlyWidget',
    },
  },
};

export default projectInformationReadOnlyUiSchema;
