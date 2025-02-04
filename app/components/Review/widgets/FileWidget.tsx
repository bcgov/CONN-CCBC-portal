import React, { useMemo } from 'react';
import { WidgetProps } from '@rjsf/utils';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import DownloadLink from 'components/DownloadLink';
import { DateTime } from 'luxon';

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

const FileWidget: React.FC<WidgetProps> = ({
  formContext,
  id,
  options,
  value,
}) => {
  // seems like the id is the only way to get the field name from widget props
  // id is in the format root_[pageName]_[fieldName]
  const fieldName = id?.split('_')?.[2];
  const rfiList = formContext?.rfiList;
  const isRfi = rfiList?.length > 0;

  const filesArray = useMemo(() => {
    return value || [];
  }, [value]);
  const filesWithIcon = [];
  return (
    <div>
      {rfiList?.map((rfi) => {
        // loop through the rfis and check if there are any files for the current field
        const rfiFiles = rfi.jsonData.rfiAdditionalFiles;
        const isFileField =
          rfiFiles && Object.keys(rfiFiles).includes(fieldName);
        if (!isFileField) return null;
        const fileFields = rfiFiles[fieldName] || [];
        // Sorting the file fields by id, latest file will always have higher id
        // not sorting by uploadedAt as it is not available for all files
        const sortedFileFields = fileFields.slice().sort((a, b) => b.id - a.id);
        const attachments = rfi?.attachments?.nodes;

        return (
          <StyledFile key={rfi.id}>
            {sortedFileFields?.map((el, index) => {
              // loop through the list of files for the current field
              const isSingleFile = !options?.allowMultipleFiles;
              const isDisplayIcon =
                isSingleFile && !filesWithIcon.includes(fieldName);
              filesWithIcon.push(fieldName);
              const attachmentData = attachments?.find(
                (attachment) => attachment?.file === el.uuid
              );

              const fileDate =
                el.fileDate ??
                (attachmentData?.createdAt &&
                  DateTime.fromISO(attachmentData.createdAt).toLocaleString(
                    DateTime.DATETIME_MED
                  ));
              return (
                <React.Fragment key={el.uuid}>
                  {isDisplayIcon ? (
                    <StyledIconDiv>
                      <FontAwesomeIcon
                        data-testid="rfi-star-icon"
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
                  {index !== rfiFiles[fieldName].length - 1 ? (
                    <StyledSingleDetails>
                      <span>{fileDate}</span>
                    </StyledSingleDetails>
                  ) : (
                    <StyledDetails>
                      <span>Received from RFI: {rfi.rfiNumber}</span>
                      <span>{fileDate}</span>
                    </StyledDetails>
                  )}
                </React.Fragment>
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
