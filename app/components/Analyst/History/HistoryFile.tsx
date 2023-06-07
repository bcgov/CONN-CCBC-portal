import styled from 'styled-components';
import * as Sentry from '@sentry/nextjs';

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

const StyledLink = styled.button`
  color: ${(props) => props.theme.color.links};
  text-decoration-line: underline;
  word-break: break-word;
`;

const handleDownload = async (uuid, fileName) => {
  const url = `/api/s3/download/${uuid}/${fileName}`;
  await fetch(url)
    .then((response) => response.json())
    .then((response) => {
      window.open(response, '_blank');
    });
};

const HistoryFile = ({ filesArray, title }) => {
  console.log(filesArray);
  return (
    <StyledTable>
      <thead />
      <tbody>
        <tr>
          <td>{title}</td>
          <td>
            {filesArray.length > 0
              ? filesArray.map((file) => {
                  return (
                    <>
                      <StyledLink
                        data-testid="history-attachment-link"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDownload(file.uuid, file.name).catch(
                            (error) => {
                              Sentry.captureException(error);
                            }
                          );
                        }}
                      >
                        {`${file.name}`}
                      </StyledLink>
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
