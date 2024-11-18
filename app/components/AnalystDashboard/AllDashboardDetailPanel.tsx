import styled from 'styled-components';

interface Props {
  row: any;
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

const AllDashboardDetailPanel: React.FC<Props> = ({ row }) => {
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
              {item.geoName}
            </StyledMapLink>
            {index < communities.length - 1 && ', '}
          </>
        ))
      ) : (
        <StyledSpan>N/A</StyledSpan>
      )}
    </>
  );
};

export default AllDashboardDetailPanel;
