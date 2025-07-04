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

  const pattern = filterValue.trim().replace(/\s+/g, '\\s*');
  const regex = new RegExp(pattern, 'i');

  const match = safeText.match(regex);

  if (!match || match.index === undefined) {
    return safeText;
  }
  const matchText = match[0];
  const beforeMatch = safeText.slice(0, match.index);
  const afterMatch = safeText.slice(match.index + matchText.length);

  return (
    <>
      {beforeMatch}
      <StyledHighlightSpan>{matchText}</StyledHighlightSpan>
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
