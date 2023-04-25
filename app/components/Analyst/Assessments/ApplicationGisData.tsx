import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import { useSaveGisAssessmentHhMutation } from 'schema/mutations/assessment/saveGisAssessmentHh';
import { DateTime } from 'luxon';
import { faExclamation, faMap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoadingCheck, Tooltip } from 'app/components';

const StyledContainer = styled.section`
  background: ${(props) => props.theme.color.backgroundGrey};
  border: 1.5px solid ${(props) => props.theme.color.components};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 16px;
  padding-top: 56px;
  overflow-x: scroll;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;

  .breakpoint-labels {
    display: block;
  }

  ${(props) => props.theme.breakpoint.largeUp} {
    flex-direction: row;
    padding-top: 40px;
    padding-right: 32px;
    overflow-x: visible;

    & table:first-child {
      margin-right: 16px;
    }

    .breakpoint-labels {
      display: none;
    }
  }

  ${(props) => props.theme.breakpoint.extraLargeUp} {
    padding-right: 128px;
  }
`;

const StyledTable = styled.table`
  max-width: 540px;
  th {
    font-weight: 700;
    vertical-align: bottom;
    border-bottom: 0;

    & div {
      font-weight: 400;
    }
  }

  td {
    text-align: right;
    border-bottom: 0;
    white-space: nowrap;
  }

  th,
  td {
    padding: 4px 8px;
    min-height: 24px;
  }
`;

const StyledTHead = styled.thead`
  white-space: nowrap;

  th {
    text-align: right;
    border-bottom: 1px solid #757575;
  }

  & th:first-child {
    border-bottom: none;
  }
`;

const StyledSecondTHead = styled(StyledTHead)`
  th {
    text-align: center;
  }
`;

const StyledLastUpdated = styled.div`
  position: absolute;
  top: 8px;

  ${(props) => props.theme.breakpoint.smallUp} {
    left: none;
    right: 8px;
  }
`;

const StyledInput = styled.input`
  padding: 4px 8px;
  width: 91px;
  height: 28px;
  background: #ffffff;
  border: 2px solid #606060;
  border-radius: 4px;
  margin-right: 4px;
`;

const StyledFlex = styled.div`
  display: flex;
`;

const formatNumber = (value) => {
  // format to 2 decimal places if a number has decimals, if not return whole number
  if (value && value % 1 !== 0) {
    return value;
  }
  return value;
};

interface Props {
  query: any;
}

const ApplicationGisData: React.FC<Props> = ({ query }) => {
  const queryFragment = useFragment(
    graphql`
      fragment ApplicationGisData_query on Application {
        rowId
        gisData {
          jsonData
          createdAt
        }
        formData {
          jsonData
        }
        gisAssessmentHh {
          eligible
          eligibleIndigenous
        }
      }
    `,
    query.applicationByRowId
  );

  const { rowId: applicationRowId, gisAssessmentHh } = queryFragment;

  const [saveGisAssessmentHh] = useSaveGisAssessmentHhMutation();

  const [eligible, setEligible] = useState(gisAssessmentHh?.eligible || null);
  const [eligibleIndigenous, setEligibleIndigenous] = useState(
    gisAssessmentHh?.eligibleIndigenous || null
  );

  // Separate isSaving state instead of using isSaving from the mutation
  // so that we can set the checkmarks separately
  const [isSavedEligible, setIsSavedEligible] = useState(false);
  const [isSavingEligible, setIsSavingEligible] = useState(false);
  const [isSavedEligibleIndigenous, setIsSavedEligibleIndigenous] =
    useState(false);
  const [isSavingEligibleIndigenous, setIsSavingEligibleIndigenous] =
    useState(false);

  const isAcceptedNumber = (number) => {
    const pattern = '^-?[0-9]+(?:.[0-9]{1, 2})?$';
    if (number.match(pattern) || !number) {
      return true;
    }
    return false;
  };

  const tooltipId = 'gis-assessment-hh-tooltip';

  const handleChangeEligible = async (e) => {
    setIsSavingEligible(true);
    if (isAcceptedNumber(e.target.value)) {
      setEligible(e.target.value);
      setIsSavedEligible(true);
      saveGisAssessmentHh({
        variables: {
          input: {
            _applicationId: applicationRowId,
            _eligible: Number(eligible),
          },
        },
        debounceKey: 'save-gis-assessment-hh',
        onCompleted: () => {
          setIsSavingEligible(false);
        },
      });
    }
  };

  const handleChangeEligibleIndigenous = async (e) => {
    setIsSavingEligibleIndigenous(true);
    if (isAcceptedNumber(e.target.value)) {
      setEligibleIndigenous(e.target.value);
      setIsSavedEligibleIndigenous(true);
      saveGisAssessmentHh({
        variables: {
          input: {
            _applicationId: applicationRowId,
            _eligibleIndigenous: Number(eligibleIndigenous),
          },
        },
        debounceKey: 'save-gis-assessment-hh-indigenous',
        onCompleted: () => {
          setIsSavingEligibleIndigenous(false);
        },
      });
    }
  };

  const { gisData, formData } = queryFragment;
  const gisJsonData = gisData?.jsonData || {};
  const formJsonData = formData?.jsonData?.benefits || {};
  const createdAt = gisData?.createdAt;
  const createdAtFormatted =
    createdAt &&
    DateTime.fromISO(createdAt).toLocaleString(DateTime.DATETIME_MED);
  const { numberOfHouseholds = null, householdsImpactedIndigenous = null } =
    formJsonData;

  const {
    GIS_PERCENT_OVERBUILD = null,
    GIS_PERCENT_OVERLAP = null,
    GIS_TOTAL_ELIGIBLE_HH = null,
    GIS_TOTAL_ELIGIBLE_INDIG_HH = null,
    GIS_TOTAL_HH = null,
    GIS_TOTAL_INDIG_HH = null,
    GIS_TOTAL_INELIGIBLE_HH = null,
  } = gisJsonData;

  return (
    <StyledContainer>
      <StyledTable>
        <StyledTHead>
          <th aria-hidden />
          <th>
            Eligible <div>(Underserved)</div>
          </th>
          <th>
            Ineligible <div>(Pending & Served)</div>
          </th>
          <th>Total</th>
        </StyledTHead>
        <tr>
          <td>GIS Analysis</td>
          <td>
            {GIS_TOTAL_ELIGIBLE_HH && formatNumber(GIS_TOTAL_ELIGIBLE_HH)}
          </td>
          <td>
            {GIS_TOTAL_INELIGIBLE_HH && formatNumber(GIS_TOTAL_INELIGIBLE_HH)}
          </td>
          <td>{GIS_TOTAL_HH && formatNumber(GIS_TOTAL_HH)}</td>
        </tr>
        <tr>
          <td>In application</td>
          <td>
            {numberOfHouseholds && (
              <>
                <Tooltip
                  className="fa-layers fa-fw"
                  message=" According to eligibility screening, the applicant is contesting the map."
                  style={{ marginRight: '16px' }}
                  title="Applicant is contesting map"
                  customId={tooltipId}
                  aria-describedby={tooltipId}
                >
                  <FontAwesomeIcon icon={faMap} size="lg" color="#C38A00" />
                  <FontAwesomeIcon
                    icon={faExclamation}
                    size="sm"
                    transform="right-1"
                    color="#FFFFFF"
                  />
                </Tooltip>
                <span>{formatNumber(numberOfHouseholds)}</span>
              </>
            )}
          </td>
          <td />
          <td />
        </tr>
        <tr>
          <td>Assessment HH</td>
          <td>
            <StyledFlex>
              <StyledInput
                type="number"
                value={eligible}
                onChange={handleChangeEligible}
              />
              {isSavedEligible && <LoadingCheck checked={!isSavingEligible} />}
            </StyledFlex>
          </td>
          <td />
          <td />
        </tr>
      </StyledTable>
      <StyledTable>
        <StyledSecondTHead>
          <th aria-hidden className="breakpoint-labels" />
          <th>
            Eligible <br />
            Indigenous
          </th>
          <th>
            Total <br />
            Indigenous
          </th>
          <th>Overbuild</th>
          <th>Overlap</th>
        </StyledSecondTHead>
        <tr>
          <td className="breakpoint-labels">GIS Analysis</td>
          <td>{GIS_TOTAL_ELIGIBLE_INDIG_HH}</td>
          <td>{GIS_TOTAL_INDIG_HH}</td>
          <td>{GIS_PERCENT_OVERBUILD}</td>
          <td>{GIS_PERCENT_OVERLAP}</td>
        </tr>
        <tr>
          <td className="breakpoint-labels">In application</td>
          <td />
          <td>
            {householdsImpactedIndigenous &&
              formatNumber(householdsImpactedIndigenous)}
          </td>
          <td />
          <td />
        </tr>
        <tr>
          <td className="breakpoint-labels">Assessment HH</td>
          <td>
            <StyledFlex>
              <StyledInput
                type="number"
                value={eligibleIndigenous}
                onChange={handleChangeEligibleIndigenous}
              />

              {isSavedEligibleIndigenous && (
                <LoadingCheck checked={!isSavingEligibleIndigenous} />
              )}
            </StyledFlex>
          </td>
          <td />
          <td />
          <td />
        </tr>
      </StyledTable>
      {createdAtFormatted && (
        <StyledLastUpdated>
          GIS analysis last updated: <br />
          {createdAtFormatted}
        </StyledLastUpdated>
      )}
    </StyledContainer>
  );
};

export default ApplicationGisData;
