import styled from 'styled-components';
import useStickyHeader from 'lib/helpers/useStickyHeader';

const STICKY_OFFSET = 65;

const StyledCallout = styled.div<{ $visible: boolean; $offset: number }>`
  position: sticky;
  top: ${({ $offset }) => `${$offset}px`};
  z-index: 1001;
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  background: #fff;
  padding: 16px 12px 24px 0px;
  width: 100%;
`;

const leftSpacer = `
  border-left: 4px solid #1a5a96;
  padding-left: 8px;
`;

const ColLeft = styled.div`
  flex: 0 0 auto;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${leftSpacer}
`;

const ColCenter = styled.div`
  flex: 0 1 auto;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  ${leftSpacer}
`;

const ColRight = styled.div`
  flex: 0 0 auto;
  max-width: 600px;
  white-space: nowrap;
  ${leftSpacer}
`;

const StyledH1 = styled.h1`
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
  white-space: inherit;
  overflow: inherit;
  text-overflow: inherit;
`;

interface Props {
  record: any;
}

const CompactHeader: React.FC<Props> = ({ record }) => {
  const { showCompact, extraOffset } = useStickyHeader(STICKY_OFFSET);
  const OFF_SET = STICKY_OFFSET + extraOffset;

  const cbcJsonData = record?.cbcDataByCbcId?.edges[0].node?.jsonData;
  const projectNumber = record?.ccbcNumber ?? record?.projectNumber;
  const organizationName =
    record?.organizationName ?? cbcJsonData?.currentOperatingName;
  const projectName = record?.projectName ?? cbcJsonData?.projectTitle;

  return (
    <>
      <div id="sticky-marker" />
      <StyledCallout $visible={showCompact} $offset={OFF_SET}>
        <ColLeft>
          <StyledH1>{projectNumber}</StyledH1>
        </ColLeft>

        <ColCenter title={projectName}>
          <StyledH1>{projectName}</StyledH1>
        </ColCenter>

        <ColRight>
          <StyledH1>{organizationName}</StyledH1>
        </ColRight>
      </StyledCallout>
    </>
  );
};

export default CompactHeader;
