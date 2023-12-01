import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import type { JSONSchema7 } from 'json-schema';
import { IChangeEvent } from '@rjsf/core';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Button from '@button-inc/bcgov-theme/Button';
import budgetDetails from 'formSchema/pages/budgetDetails';
import FormBase from 'components/Form/FormBase';
import {
  calculate,
  mergeFormSectionData,
} from 'components/Form/ApplicationForm';
import Layout from 'components/Layout';
import { uiSchema } from 'formSchema';
import { AnalystLayout, ChangeModal } from 'components/Analyst';
import { SectionQuery } from '__generated__/SectionQuery.graphql';
import { useCreateNewFormDataMutation } from 'schema/mutations/application/createNewFormData';
import { analystProjectArea, benefits } from 'formSchema/uiSchema/pages';

const getSectionQuery = graphql`
  query SectionQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      formData {
        formSchemaId
        jsonData
        formByFormSchemaId {
          jsonSchema
        }
      }
    }
    session {
      sub
    }
    ...AnalystLayout_query
  }
`;

const EditApplication = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, SectionQuery>) => {
  const query = usePreloadedQuery(getSectionQuery, preloadedQuery);
  const {
    session,
    applicationByRowId: {
      formData: {
        formByFormSchemaId: { jsonSchema },
        formSchemaId,
        jsonData,
      },
    },
  } = query;

  // Use a hidden ref for submit button instead of passing to modal so we have the most up to date form data
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const sectionName = router.query.section as string;
  const applicationId = router.query.applicationId as string;

  // Budget details was removed from the applicant schema but we want to display in for Analysts
  // no matter which schema is returned from the database
  const formSchema = {
    ...jsonSchema,
    properties: {
      ...jsonSchema.properties,
      ...budgetDetails,
    },
  };

  const sectionSchema = formSchema.properties[sectionName] as JSONSchema7;
  uiSchema.benefits = { ...uiSchema.benefits, ...benefits } as any;
  uiSchema.projectArea = {
    ...uiSchema.projectArea,
    ...analystProjectArea,
  } as any;
  // https://github.com/rjsf-team/react-jsonschema-form/issues/1023
  // Save and update form data in state due to RJSF setState bug
  const [sectionFormData, setSectionFormData] = useState(jsonData[sectionName]);
  const [changeReason, setChangeReason] = useState('');
  const [isFormSaved, setIsFormSaved] = useState(true);
  const handleChange = (e: IChangeEvent) => {
    setIsFormSaved(false);
    const newFormSectionData = { ...e.formData };

    const calculatedSectionData = calculate(newFormSectionData, sectionName);
    setSectionFormData(calculatedSectionData);
  };

  const [createNewFormData] = useCreateNewFormDataMutation();

  const handleSubmit = () => {
    const calculatedSectionData = calculate(sectionFormData, sectionName);

    const newFormData = mergeFormSectionData(
      jsonData,
      sectionName,
      calculatedSectionData,
      jsonSchema
    );

    const isOtherFundingSourcesPage = sectionName === 'otherFundingSources';
    // remove field otherFundingSources array when otherFundingSources is false as it leaves misleading data
    if (
      isOtherFundingSourcesPage &&
      !newFormData.otherFundingSources.otherFundingSources
    ) {
      delete newFormData.otherFundingSources.otherFundingSourcesArray;
    }

    createNewFormData({
      variables: {
        input: {
          applicationRowId: Number(applicationId),
          jsonData: newFormData,
          reasonForChange: changeReason,
          formSchemaId,
        },
      },
      onCompleted: () => {
        router.push(`/analyst/application/${applicationId}`);
      },
    });
  };

  const triggerModal = () => {
    window.location.hash = '#change-modal';
  };

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <h2>Application</h2>
        <hr />
        <h3>{sectionSchema.title}</h3>
        <FormBase
          formData={sectionFormData}
          onChange={handleChange}
          schema={sectionSchema}
          uiSchema={uiSchema[sectionName]}
          onSubmit={triggerModal}
          noValidate
        >
          <button
            ref={hiddenSubmitRef}
            type="submit"
            style={{ display: 'none' }}
            data-testid="hidden-submit"
            aria-label="hidden-submit"
          />
          <Button
            onClick={(e: React.MouseEvent<HTMLInputElement>) => {
              e.preventDefault();
              if (!isFormSaved) {
                window.location.hash = '#change-modal';
              }
            }}
          >
            {isFormSaved ? 'Saved' : 'Save'}
          </Button>
          <Button
            variant="secondary"
            style={{ marginLeft: '24px' }}
            onClick={(e: React.MouseEvent<HTMLInputElement>) => {
              e.preventDefault();
              router.push(`/analyst/application/${applicationId}`);
            }}
          >
            Cancel
          </Button>
        </FormBase>

        <ChangeModal
          onSave={handleSubmit}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setChangeReason(e.target.value)
          }
          value={changeReason}
        />
      </AnalystLayout>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    return {
      rowId: parseInt(ctx.query.applicationId.toString(), 10),
    };
  },
};

export default withRelay(EditApplication, getSectionQuery, withRelayOptions);
