import styled from 'styled-components';
import DownloadLink from 'components/DownloadLink';

const StyledTable = styled.table`
  table-layout: auto;

  th,
  td {
    padding: 8px;
  }

  thead tr th:first-child,
  tbody tr td:first-child {
    width: 304px;
  }

  tr:last-child td:first-child {
    border-bottom: 1px solid hsla(0, 0%, 0%, 0.12) !important;
  }
`;

const HistoryFile = ({ filesArray, title, tableTitle = true }) => {
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
        <tr>
          <td style={tableTitle ? { paddingTop: '8px' } : {}}>{title}</td>
          <td style={tableTitle ? { paddingTop: '8px' } : {}}>
            {filesArray?.length > 0
              ? filesArray.map((file) => {
                  return (
                    <>
                      <DownloadLink uuid={file.uuid} fileName={file.name} />
                      <br />
                    </>
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
