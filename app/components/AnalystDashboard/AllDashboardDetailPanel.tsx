import styled from 'styled-components';

interface Props {
  row: any;
  filterValue: string;
}

const StyledMapLink = styled.a`
  color: ${(props) => props.theme.color.links};
  text-decoration-line: underline;
  :hover {
    cursor: pointer;
  }
`;

const StyledSpan = styled.span`
  color: ${(props) => props.theme.color.darkGrey};
  display: inline;
`;

const StyledHighlightSpan = styled.span`
  background-color: ${(props) => props.theme.color.primaryYellow};
`;

const HighlightFilterMatch = ({ text, filterValue }) => {
  const safeText = String(text ?? '');

  if (!filterValue) return safeText;

  const normalizedFilterValue = filterValue.replace(/\s+/g, '').toLowerCase();
  const normalizedText = safeText.replace(/\s+/g, '').toLowerCase();

  const matchIndex = normalizedText.indexOf(normalizedFilterValue);

  if (matchIndex === -1) {
    return safeText;
  }

  const beforeMatch = safeText.slice(0, matchIndex);
  const match = safeText.slice(matchIndex, matchIndex + filterValue.length);
  const afterMatch = safeText.slice(matchIndex + filterValue.length);

  return (
    <>
      {beforeMatch}
      <StyledHighlightSpan>{match}</StyledHighlightSpan>
      {afterMatch}
    </>
  );
};

const AllDashboardDetailPanel: React.FC<Props> = ({ row, filterValue }) => {
  const communities = (row.original.communities as any[]) || [];

  return (
    <div>
      <StyledSpan>Communities</StyledSpan>
      {/* Add space between label and data */}{' '}
      {communities.length > 0 ? (
        communities.map((item, index) => (
          <>
            <StyledMapLink
              href={item.mapLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <HighlightFilterMatch
                text={item.geoName}
                filterValue={filterValue}
              />
            </StyledMapLink>
            {index < communities.length - 1 && ', '}
          </>
        ))
      ) : (
        <StyledSpan>N/A</StyledSpan>
      )}
      {/* Add a new line between Communities and Original Project Number */}
      <br />
      <StyledSpan>Original Project Number</StyledSpan>
      {/* Add space between label and data */}{' '}
      <HighlightFilterMatch
        text={
          row.original.originalProjectNumber
            ? row.original.originalProjectNumber
            : 'N/A'
        }
        filterValue={filterValue}
      />
    </div>
  );
};

export default AllDashboardDetailPanel;
