import styled from 'styled-components';
import DownloadLink from 'components/DownloadLink';
import { diff } from 'json-diff';

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
}) => {
  const filesDiff = diff(previousFileArray || [], filesArray || [], {
    keepUnchangedValues: true,
  });
  return filesDiff ? (
    <StyledTable>
      <thead style={{ borderBottom: '2px solid #CCC' }}>
        {tableTitle && (
          <tr>
            <th>Files</th>
          </tr>
        )}
      </thead>
      <tbody>
        <tr>
          <td style={tableTitle ? { paddingTop: '8px' } : {}}>{title}</td>
          <td style={tableTitle ? { paddingTop: '8px' } : {}}>
            <div>
              {filesDiff &&
                filesDiff.map((file) => {
                  // A file was added
                  if (file[0] === '+') {
                    return (
                      <div key={file[1].uuid}>
                        Added file{' '}
                        <DownloadLink
                          uuid={file[1].uuid}
                          fileName={file[1].name}
                        />
                      </div>
                    );
                  }
                  // A file was removed
                  if (file[0] === '-') {
                    return (
                      <div key={file[1].uuid}>
                        Deleted file{' '}
                        <del>
                          <DownloadLink
                            uuid={file[1].uuid}
                            fileName={file[1].name}
                          />
                        </del>
                      </div>
                    );
                  }
                  // The object was modified (file replacement)
                  if (file[0] === '~') {
                    return (
                      <div key={file[1].uuid}>
                        Replaced file{' '}
                        <del>
                          <DownloadLink
                            uuid={file[1].uuid.__old}
                            fileName={file[1].name.__old}
                          />
                        </del>{' '}
                        with file{' '}
                        <DownloadLink
                          uuid={file[1].uuid.__new}
                          fileName={file[1].name.__new}
                        />
                      </div>
                    );
                  }
                  return null;
                })}
            </div>
          </td>
        </tr>
      </tbody>
    </StyledTable>
  ) : null;
};

export default HistoryFile;
