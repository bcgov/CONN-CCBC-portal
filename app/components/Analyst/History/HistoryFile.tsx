import styled from 'styled-components';
import DownloadLink from 'components/DownloadLink';

const StyledTable = styled.table`
  table-layout: auto;

  th,
  td {
    padding: 8px;
    width: 30%;
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
  isDelete = false,
  title,
  tableTitle = true,
}) => {
  const isPreviousFileArray = previousFileArray?.length > 0;
  return (
    <StyledTable>
      <thead style={{ borderBottom: '2px solid #CCC' }}>
        {tableTitle && (
          <tr>
            <th>Files</th>
            {isPreviousFileArray && (
              <>
                <th>New</th>
                <th>Old</th>
              </>
            )}
          </tr>
        )}
      </thead>
      <tbody>
        <tr>
          <td style={tableTitle ? { paddingTop: '8px' } : {}}>{title}</td>
          <td style={tableTitle ? { paddingTop: '8px' } : {}}>
            {filesArray?.length > 0 &&
              filesArray.map((file) => {
                return (
                  <>
                    {isDelete ? (
                      <del>
                        <DownloadLink uuid={file.uuid} fileName={file.name} />
                      </del>
                    ) : (
                      <DownloadLink uuid={file.uuid} fileName={file.name} />
                    )}
                    <br />
                  </>
                );
              })}
          </td>
          <td style={tableTitle ? { paddingTop: '8px' } : {}}>
            {previousFileArray?.length > 0
              ? previousFileArray.map((previousFile) => {
                  return (
                    <del key={previousFile.uuid}>
                      <DownloadLink
                        uuid={previousFile.uuid}
                        fileName={previousFile.name}
                      />
                      <br />
                    </del>
                  );
                })
              : 'N/A'}
          </td>
        </tr>
      </tbody>
    </StyledTable>
  );
};

export default HistoryFile;
