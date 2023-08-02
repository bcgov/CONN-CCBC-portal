import React, { useMemo } from 'react';
import { WidgetProps } from '@rjsf/core';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import DownloadLink from 'components/DownloadLink';

const StyledFile = styled('div')`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
`;

const StyledDetails = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: #939393;
`;

const StyledSingleDetails = styled(StyledDetails)`
  justify-content: flex-end;
`;

const StyledIconDiv = styled('div')`
  position: relative;
  & svg {
    max-width: 14px;
    position: relative;
    top: 2px;
    left: -16px;
  }

  & a {
    position: relative;
    left: -16px;
  }
`;

const FileWidget: React.FC<WidgetProps> = ({ formContext, id, value }) => {
  // seems like the id is the only way to get the field name from widget props
  // id is in the format root_[pageName]_[fieldName]
  const fieldName = id?.split('_')?.[2];
  const rfiFileList = formContext?.rfiFileList?.[fieldName] || {};
  const rfiList = Object.keys(rfiFileList);

  const isRfi = rfiList.length > 0;
  const filesArray = useMemo(() => {
    return value || [];
  }, [value]);

  return (
    <div>
      {rfiList.map((rfi, i) => {
        return (
          <StyledFile key={rfi}>
            {rfiFileList[rfi]?.map((el, index) => {
              const isSingleFile = rfiFileList[rfi].length === 1;
              const isDisplayIcon = isSingleFile && i === 0;

              // placeholder for date until we get computed column. Will search for file date by uuid
              const fileDate = 'date placeholder';
              return (
                <>
                  {isDisplayIcon ? (
                    <StyledIconDiv>
                      <FontAwesomeIcon
                        icon={faStar}
                        style={{ color: '#FFC107' }}
                        size="xs"
                      />
                      <DownloadLink
                        key={el.uuid}
                        uuid={el.uuid}
                        fileName={el.name}
                      />
                    </StyledIconDiv>
                  ) : (
                    <DownloadLink
                      key={el.uuid}
                      uuid={el.uuid}
                      fileName={el.name}
                    />
                  )}
                  {index !== rfiFileList[rfi].length - 1 ? (
                    <StyledSingleDetails>
                      <span>{fileDate}</span>
                    </StyledSingleDetails>
                  ) : (
                    <StyledDetails>
                      <span>Received from {rfi}</span>
                      <span>{fileDate}</span>
                    </StyledDetails>
                  )}
                </>
              );
            })}
          </StyledFile>
        );
      })}

      {filesArray.length > 0 && (
        <StyledFile>
          {filesArray?.map((el, index) => {
            const isComma = index < filesArray.length - 1;
            return (
              <DownloadLink
                key={el.uuid}
                uuid={el.uuid}
                fileName={`${el.name}${isComma ? ',' : ''}`}
              />
            );
          })}

          {isRfi && <StyledDetails>Original</StyledDetails>}
        </StyledFile>
      )}
    </div>
  );
};

export default FileWidget;
