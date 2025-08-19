import { diff } from 'json-diff';
import DiffTable from 'components/DiffTable';
import { getDefaultFormState } from '@rjsf/utils';
import AJV8Validator from '@rjsf/validator-ajv8';

const HistoryDetails = ({
  json,
  prevJson,
  excludedKeys,
  diffSchema,
  overrideParent = null,
}) => {
  const schema = (overrideParent && diffSchema?.[overrideParent]) || diffSchema;
  const normalizedJson = getDefaultFormState(AJV8Validator, schema, json);
  const normalizedPrevJson = getDefaultFormState(
    AJV8Validator,
    schema,
    prevJson
  );

  const changes = diff(normalizedPrevJson, normalizedJson, {
    keepUnchangedValues: true,
  });

  return (
    <>
      {changes ? (
        <DiffTable
          changes={changes}
          diffSchema={diffSchema}
          excludedKeys={excludedKeys}
          overrideParent={overrideParent}
        />
      ) : (
        <div data-testid="no-diff-message">No changes made.</div>
      )}
    </>
  );
};

export default HistoryDetails;
