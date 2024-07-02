import { Button } from '@button-inc/bcgov-theme';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { StyledDropdown } from 'components/Analyst/AssignLead';
import { useToast } from 'components/AppProvider';
import * as Sentry from '@sentry/nextjs';
import styled from 'styled-components';

const Gcpe = ({ reportList }) => {
  const [gcpeReports, setGcpeReports] = useState(reportList);
  const [selectedReport, setSelectedReport] = useState(-1);
  const [selectedReportDate, setSelectedReportDate] = useState('');
  const [selectedReportCompare, setSelectedReportCompare] = useState(-1);
  const [selectedSourceReport, setSelectedSourceReport] = useState(-1);
  const [selectedTargetReport, setSelectedTargetReport] = useState(-1);
  const { showToast, hideToast } = useToast();

  const handleExistingReportChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    setSelectedReport(selectedOption.value);
    setSelectedReportDate(selectedOption.text.split('Generated ')[1]);
  };

  const handleReportCompareChange = (e) => {
    setSelectedReportCompare(e.target.value);
  };

  const handleSourceReportChange = (e) => {
    setSelectedSourceReport(e.target.value);
  };

  const handleTargetReportChange = (e) => {
    setSelectedTargetReport(e.target.value);
  };

  const handleError = (error) => {
    Sentry.captureException(error);
    showToast('An error occurred. Please try again.', 'error', 15000);
  };

  const StyledH2 = styled.h2`
    margin-top: 12px;
  `;

  return (
    <div>
      <StyledH2>Generate a new report</StyledH2>
      <p>Generate a new report with the current CBC and CCBC data.</p>
      <Button
        onClick={async () => {
          hideToast();
          await fetch('/api/reporting/gcpe')
            .then((response) => {
              response.blob().then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${DateTime.now().setZone('America/Los_Angeles').toLocaleString(DateTime.DATETIME_FULL)}_Connectivity_Projects_GCPE_List.xlsx`;
                document.body.appendChild(a); // Append to the DOM to ensure click works in Firefox
                a.click();
                a.remove(); // Remove the element after clicking
                window.URL.revokeObjectURL(url); // Clean up and release object URL
                setGcpeReports([
                  ...gcpeReports,
                  {
                    node: {
                      rowId: gcpeReports.length,
                      createdAt: DateTime.now()
                        .setZone('America/Los_Angeles')
                        .toISO(),
                    },
                  },
                ]);
                showToast(
                  'The report has been generated and downloaded successfully',
                  'success',
                  15000
                );
              });
            })
            .catch((error) => {
              handleError(error);
            });
        }}
      >
        Generate
      </Button>
      <StyledH2>Download an existing report</StyledH2>
      <p>Download an already existing report</p>
      <StyledDropdown
        name="reportToDownload"
        onChange={handleExistingReportChange}
        data-testid="reportToDownload"
      >
        <option key={-1} value={-1} selected={selectedReport === -1}>
          Select a report to download
        </option>

        {gcpeReports.map((edge) => (
          <option
            key={edge.node.rowId}
            value={edge.node.rowId}
            selected={selectedReport === edge.node.rowId}
          >
            {`Generated ${DateTime.fromISO(edge.node.createdAt).setZone('America/Los_Angeles').toLocaleString(DateTime.DATETIME_FULL)}`}
          </option>
        ))}
      </StyledDropdown>
      <br />
      <br />
      <Button
        disabled={selectedReport.toString() === '-1'}
        onClick={async () => {
          hideToast();
          await fetch('/api/reporting/gcpe/regenerate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rowId: selectedReport }),
          })
            .then((response) => {
              response.blob().then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${selectedReportDate}_Connectivity_Projects_GCPE_List.xlsx`;
                document.body.appendChild(a); // Append to the DOM to ensure click works in Firefox
                a.click();
                a.remove(); // Remove the element after clicking
                window.URL.revokeObjectURL(url); // Clean up and release object URL
                showToast(
                  'The report has been regenerated and downloaded successfully',
                  'success',
                  15000
                );
              });
            })
            .catch((error) => {
              handleError(error);
            });
        }}
      >
        Download
      </Button>

      <StyledH2>Generate and compare</StyledH2>
      <p>
        Compare the current CBC and CCBC data against a specific existing
        report. Note: the font colour differences will not be saved.
      </p>
      <StyledDropdown
        name="reportToCompare"
        onChange={handleReportCompareChange}
        data-testid="reportToCompare"
      >
        <option key={-1} value={-1} selected={selectedReportCompare === -1}>
          Select a report to compare to
        </option>

        {gcpeReports.map((edge) => (
          <option
            key={edge.node.rowId}
            value={edge.node.rowId}
            selected={selectedReportCompare === edge.node.rowId}
          >
            {`Generated ${DateTime.fromISO(edge.node.createdAt).setZone('America/Los_Angeles').toLocaleString(DateTime.DATETIME_FULL)}`}
          </option>
        ))}
      </StyledDropdown>
      <br />
      <br />
      <Button
        disabled={selectedReportCompare.toString() === '-1'}
        onClick={async () => {
          hideToast();
          await fetch('/api/reporting/gcpe/generateAndCompare', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rowId: selectedReportCompare }),
          })
            .then((response) => {
              response.blob().then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${DateTime.now().setZone('America/Los_Angeles').toLocaleString(DateTime.DATETIME_FULL)}_Connectivity_Projects_GCPE_List.xlsx`;
                document.body.appendChild(a); // Append to the DOM to ensure click works in Firefox
                a.click();
                a.remove(); // Remove the element after clicking
                window.URL.revokeObjectURL(url); // Clean up and release object URL
                showToast(
                  'The comparison report has been generated and downloaded successfully',
                  'success',
                  15000
                );
              });
            })
            .catch((error) => {
              handleError(error);
            });
        }}
      >
        Generate & Compare
      </Button>

      <StyledH2>Compare</StyledH2>
      <p>
        Compare two pre-existing reports, set the newest report as source and
        the oldest as target comparison.
        <br /> Note: the resulting report will not be saved for re-download.
      </p>
      <StyledDropdown
        name="reportSource"
        onChange={handleSourceReportChange}
        data-testid="reportSource"
      >
        <option key={-1} value={-1} selected={selectedReportCompare === -1}>
          Select source report
        </option>

        {gcpeReports.map((edge) => (
          <option
            key={edge.node.rowId}
            value={edge.node.rowId}
            selected={selectedSourceReport === edge.node.rowId}
            disabled={
              selectedTargetReport.toString() === edge.node.rowId.toString()
            }
          >
            {`Generated ${DateTime.fromISO(edge.node.createdAt).setZone('America/Los_Angeles').toLocaleString(DateTime.DATETIME_FULL)}`}
          </option>
        ))}
      </StyledDropdown>
      <StyledDropdown
        name="reportTarget"
        onChange={handleTargetReportChange}
        data-testid="reportTarget"
      >
        <option key={-1} value={-1} selected={selectedTargetReport === -1}>
          Select target report
        </option>

        {gcpeReports.map((edge) => (
          <option
            key={edge.node.rowId}
            value={edge.node.rowId}
            selected={selectedTargetReport === edge.node.rowId}
            disabled={
              selectedSourceReport.toString() === edge.node.rowId.toString()
            }
          >
            {`Generated ${DateTime.fromISO(edge.node.createdAt).setZone('America/Los_Angeles').toLocaleString(DateTime.DATETIME_FULL)}`}
          </option>
        ))}
      </StyledDropdown>
      <br />
      <br />
      <Button
        disabled={
          selectedSourceReport.toString() === '-1' ||
          selectedTargetReport.toString() === '-1'
        }
        onClick={async () => {
          hideToast();
          await fetch('/api/reporting/gcpe/compare', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sourceRowId: selectedSourceReport,
              targetRowId: selectedTargetReport,
            }),
          })
            .then((response) => {
              response.blob().then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${DateTime.now().setZone('America/Los_Angeles').toLocaleString(DateTime.DATETIME_FULL)}_Connectivity_Projects_GCPE_List.xlsx`;
                document.body.appendChild(a); // Append to the DOM to ensure click works in Firefox
                a.click();
                a.remove(); // Remove the element after clicking
                window.URL.revokeObjectURL(url); // Clean up and release object URL
                showToast(
                  'The comparison has been generated and downloaded successfully',
                  'success',
                  15000
                );
              });
            })
            .catch((error) => {
              handleError(error);
            });
        }}
      >
        Compare
      </Button>
    </div>
  );
};

export default Gcpe;
