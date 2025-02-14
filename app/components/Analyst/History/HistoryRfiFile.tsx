import styled from 'styled-components';
import { diff } from 'json-diff';
import HistoryFileRow from './HistoryFileRow';

const StyledTable = styled.table`
  table-layout: auto;

  th,
  td {
    padding: 8px;
    width: 60%;
  }

  thead tr th:first-child,
  tbody tr td:first-child {
    width: 304px;
  }

  tr:last-child td:first-child {
    border-bottom: 1px solid hsla(0, 0%, 0%, 0.12) !important;
  }
`;

const HistoryRfiFile = ({
  filesArray,
  previousFileArray,
  tableTitle = true,
  testId = '',
  diffSchema,
}) => {
  const filesDiff = diff(previousFileArray || [], filesArray || [], {
    keepUnchangedValues: true,
    full: true,
  });

  return (
    <StyledTable>
      <thead style={{ borderBottom: '2px solid #CCC' }}>
        {tableTitle && (
          <tr>
            <th>Files</th>
          </tr>
        )}
      </thead>
      <tbody>
        {Object.keys(filesDiff).map((key) => {
          const sanitizedKey = key.split('__')[0];
          const title =
            diffSchema?.rfi?.properties?.[`${sanitizedKey}Rfi`]?.title;

          const rfiCategoryDiff = diff(
            previousFileArray[sanitizedKey] || [],
            filesArray[sanitizedKey] || []
          );
          const hasFileChanges =
            rfiCategoryDiff?.filter(
              (file) => file[0] === '+' || file[0] === '-' || file[0] === '~'
            ).length > 0;

          return hasFileChanges ? (
            <tr key={key} data-testid={testId}>
              <td>{title}</td>
              <td>
                {rfiCategoryDiff.map((file, index) => {
                  return (
                    <HistoryFileRow
                      key={file[1]?.uuid || index}
                      file={file}
                      filesDiff={rfiCategoryDiff}
                    />
                  );
                })}
              </td>
            </tr>
          ) : null;
        })}
      </tbody>
    </StyledTable>
  );
};

export default HistoryRfiFile;
