import styled from 'styled-components';
import { useToast } from 'components/AppProvider';
import { useState } from 'react';
import { DateTime } from 'luxon';
import { useArchiveReportingGcpeMutation } from 'schema/mutations/reporting/archiveReportingGcpeMutation';
import { ConnectionHandler } from 'relay-runtime';
import reportClientError from 'lib/helpers/reportClientError';
import ReportRow from './ReportRow';

const StyledH2 = styled.h2`
  margin-top: 12px;
`;

const ManageReports = ({ reportList, connectionId }) => {
  const { showToast, hideToast } = useToast();
  const [updateReportingGcpeByRowId] = useArchiveReportingGcpeMutation();

  const [isLoading, setIsLoading] = useState(false);

  const handleArchive = (report) => {
    const { __id: reportConnectionId, rowId, createdAt } = report;
    const formattedFileName = `Generated ${DateTime.fromISO(createdAt)
      .setZone('America/Los_Angeles')
      .toLocaleString(DateTime.DATETIME_FULL)}`;
    hideToast();
    setIsLoading(true);
    const variables = {
      input: {
        reportingGcpePatch: {
          archivedAt: new Date().toISOString(),
        },
        rowId,
      },
    };
    updateReportingGcpeByRowId({
      variables,
      updater: (store) => {
        const connection = store.get(connectionId);
        store.delete(reportConnectionId);
        ConnectionHandler.deleteNode(connection, reportConnectionId);
      },
      onError: (response) => {
        setIsLoading(false);
        showToast(
          'Error archiving GCPE file. Please try again later.',
          'error',
          5000
        );
        reportClientError(response, {
          source: 'archive-gcpe-report',
          metadata: { fileName: formattedFileName },
        });
      },
      onCompleted: () => {
        setIsLoading(false);
        showToast('GCPE file archived successfully', 'success', 5000);
      },
    });
  };

  const handleDownload = async (report: any) => {
    const { rowId, createdAt } = report;
    await fetch('/api/reporting/gcpe/regenerate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rowId }),
    })
      .then((response) => {
        response.blob().then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${DateTime.fromISO(createdAt)
            .setZone('America/Los_Angeles')
            .toLocaleString(
              DateTime.DATETIME_FULL
            )}_Connectivity_Projects_GCPE_List.xlsx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        });
      })
      .catch((error) => {
        showToast('Error downloading file. Please try again later.', error);
        reportClientError(error, { source: 'download-gcpe-report' });
      });
  };

  return (
    <>
      <StyledH2>Manage My Reports</StyledH2>
      {reportList.map((edge) => (
        <ReportRow
          key={edge.node.id}
          report={edge.node}
          onDownload={() => handleDownload(edge.node)}
          onArchive={() => handleArchive(edge.node)}
          isLoading={isLoading}
          reportType="GCPE"
        />
      ))}
    </>
  );
};

export default ManageReports;
