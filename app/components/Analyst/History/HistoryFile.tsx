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

const HistoryFile = ({
  filesArray,
  previousFileArray = null,
  title,
  tableTitle = true,
  testId = '',
}) => {
  const filesDiff = diff(previousFileArray || [], filesArray || [], {
    keepUnchangedValues: true,
    full: true,
  });

  const hasFileChanges =
    filesDiff?.filter(
      (file) => file[0] === '+' || file[0] === '-' || file[0] === '~'
    ).length > 0;

  return hasFileChanges ? (
    <StyledTable>
      <thead style={{ borderBottom: '2px solid #CCC' }}>
        {tableTitle && (
          <tr>
            <th>Files</th>
          </tr>
        )}
      </thead>
      <tbody>
        <tr data-testid={testId}>
          <td style={tableTitle ? { paddingTop: '8px' } : {}}>{title}</td>
          <td style={tableTitle ? { paddingTop: '8px' } : {}}>
            <div>
              {filesDiff &&
                filesDiff.map((file, index) => {
                  return (
                    <HistoryFileRow
                      key={`${file[1]?.uuid || index}`}
                      file={file}
                      filesDiff={filesDiff}
                    />
                  );
                })}
            </div>
          </td>
        </tr>
      </tbody>
    </StyledTable>
  ) : null;
};

export default HistoryFile;
