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
  display: block;
`;

const StyledHighlightSpan = styled.span`
  background-color: ${(props) => props.theme.color.primaryYellow};
`;

const HighlightFilterMatch = ({ text, filterValue }) => {
  if (!filterValue) return text;

  const normalizedFilterValue = filterValue.replace(/\s+/g, '').toLowerCase();
  const normalizedText = text.replace(/\s+/g, '').toLowerCase();

  const matchIndex = normalizedText.indexOf(normalizedFilterValue);

  if (matchIndex === -1) {
    return text;
  }

  const beforeMatch = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + filterValue.length);
  const afterMatch = text.slice(matchIndex + filterValue.length);

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
    <>
      <StyledSpan>Communities</StyledSpan>
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
      <StyledSpan>Original Project Number</StyledSpan>
      <StyledSpan>{row.originalProjectNumber ?? "N/A"}</StyledSpan>
    </>
  );
};

export default AllDashboardDetailPanel;
