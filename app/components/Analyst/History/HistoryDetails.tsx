import { diff } from 'json-diff';

import DiffTable from 'components/DiffTable';

const HistoryDetails = ({
  json,
  prevJson,
  excludedKeys,
  diffSchema,
  overrideParent = null,
}) => {
  const changes = diff(prevJson, json, { keepUnchangedValues: true });
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
