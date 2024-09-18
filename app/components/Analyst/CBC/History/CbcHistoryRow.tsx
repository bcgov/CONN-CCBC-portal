import styled from 'styled-components';
import React from 'react';
import { HistoryIcon } from 'components/Analyst/History';
import CbcHistoryContent from './CbcHistoryContent';

const StyledIconCell = styled.td`
  width: 5px;
  border-left: 1px solid ${(props) => props.theme.color.links};
  border-bottom: none;
  position: relative;

  & div {
    position: absolute;
    right: 2px;
    top: -2px;
  }
`;

const StyledCell = styled.td`
  border-bottom: none;

  & b {
    text-transform: capitalize;
  }
`;

interface Props {
  json: any;
  prevJson: any;
  changeReason: string;
  tableName: string;
  updatedAt: string;
  createdAt: string;
  givenName: string;
  familyName: string;
  op: string;
}

const CbcHistoryRow: React.FC<Props> = ({
  json,
  prevJson,
  changeReason,
  tableName,
  createdAt,
  givenName,
  familyName,
  updatedAt,
  op,
}) => {
  return (
    <tr>
      <StyledIconCell>
        <HistoryIcon type="form_data" />
      </StyledIconCell>
      <StyledCell>
        <CbcHistoryContent
          json={json}
          prevJson={prevJson}
          createdAt={createdAt}
          updatedAt={updatedAt}
          familyName={familyName}
          givenName={givenName}
          tableName={tableName}
          changeReason={changeReason}
          op={op}
        />
      </StyledCell>
    </tr>
  );
};

export default CbcHistoryRow;
