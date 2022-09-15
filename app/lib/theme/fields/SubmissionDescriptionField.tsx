import { FieldProps } from '@rjsf/core';
import { DateTime } from 'luxon';

/*
 In a perfect world, the old spec that was passed the formContext to the 
 to the DescriptionField would've been used, but that was removed at one point.
 
 Now, as far as I can tell, this is probably the easier way to do this without
 having to refactor with relay like in the ciip project. 
*/
const SubmissionField: React.FC<FieldProps> = (props) => {
  const {
    formContext: { intakeCloseTimestamp },
    schema,
    registry,
  } = props;

  //Remove the title so it isn't rendered twice.
  const submissionSchemaWithoutTitle = {...schema}
  delete submissionSchemaWithoutTitle.title
  const ObjectField = registry.fields.ObjectField;
  const DescriptionField = registry.fields.DescriptionField;

  const submissionDescriptionText = `Certify that you have the authority to submit this information on behalf of the Applicant. After submission, you can continue to edit this application until the intake closes on ${DateTime.fromISO(
    intakeCloseTimestamp,
    {
      locale: 'en-CA',
      zone: 'America/Vancouver',
    }
  ).toFormat('FFF')}`;

  return (
    <>
    {/* wrapping in an h3 to mimic behaviour in the current object renderer */}
    <h3>
      <DescriptionField {...props} description={submissionDescriptionText} />
    </h3>

      <ObjectField {...props} schema={submissionSchemaWithoutTitle} />
    </>
  );
};

export default SubmissionField;
