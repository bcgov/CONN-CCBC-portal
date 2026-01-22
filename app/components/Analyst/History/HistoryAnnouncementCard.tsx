import styled, { css } from 'styled-components';
import Image from 'next/image';
import { DateTime } from 'luxon';
import { useEffect, useMemo, useState } from 'react';

const StyledAnnouncement = styled.div<{ $isStriked?: boolean }>`
  font-style: normal;
  display: grid;
  grid-template-columns: 10% 55% 35%;
  grid-gap: 16px;
  padding: 0px 8px;
  border-radius: 8px;
  border-width: 0px 4px;
  border-style: solid;
  border-color: #dbe6f0;
  margin-bottom: 12px;
  ${({ $isStriked }) =>
    $isStriked &&
    css`
      color: #6b6b6b;
      text-decoration: line-through;
    `}
`;

const StyledPreview = styled.div`
  display: grid;
  grid-template-columns: 20% 80%;
  grid-gap: 8px;
  justify-content: space-between;
  border-radius: 8px;
  border: 1px solid #d6d6d6;
  word-break: break-word;
  min-width: 0;
  cursor: pointer;

  & img {
    border-radius: 8px;
    padding: 1px;
    object-fit: contain;
  }
`;

const StyledPreviewTitleDescription = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 4px;
`;

const StyledTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 19px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledDescription = styled.div`
  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledLink = styled.a`
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: #1a5a96;
`;

const fallbackPreview = {
  image: '/images/noPreview.png',
  title: null,
  description: 'No preview available',
};

const HistoryAnnouncementCard = ({
  announcement,
  applicationId,
  isStriked = false,
}) => {
  const { jsonData } = announcement || {};
  const [preview, setPreview] = useState(() =>
    jsonData?.previewed && jsonData?.preview
      ? jsonData.preview
      : fallbackPreview
  );

  const announcementDate = jsonData?.announcementDate;
  const formattedDate = useMemo(() => {
    if (!announcementDate) return null;
    return DateTime.fromJSDate(new Date(announcementDate), {
      zone: 'utc',
    }).toFormat('MMMM dd, yyyy');
  }, [announcementDate]);

  useEffect(() => {
    if (!jsonData?.announcementUrl) {
      setPreview(fallbackPreview);
      return undefined;
    }
    if (jsonData?.previewed && jsonData?.preview) {
      setPreview(jsonData.preview);
      return undefined;
    }
    const controller = new AbortController();
    const getLinkPreview = async () => {
      const response = await fetch(`/api/announcement/linkPreview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: jsonData?.announcementUrl,
          jsonData,
          rowId: announcement?.rowId,
          ccbcNumbers: announcement?.ccbcNumbers,
        }),
        signal: controller.signal,
      });
      const previewResponse = await response.json();
      if (previewResponse?.error) {
        setPreview(fallbackPreview);
        return;
      }
      setPreview(previewResponse);
    };

    getLinkPreview().catch(() => {
      setPreview(fallbackPreview);
    });

    return () => {
      controller.abort();
    };
  }, [
    announcement?.ccbcNumbers,
    announcement?.rowId,
    jsonData?.announcementUrl,
    jsonData?.preview,
    jsonData?.previewed,
  ]);

  if (!announcement) return null;

  const handlePreviewClick = () => {
    if (!jsonData?.announcementUrl) return;
    window.open(jsonData.announcementUrl, '_blank');
  };

  return (
    <StyledAnnouncement $isStriked={isStriked}>
      <div>{formattedDate}</div>
      <StyledPreview onClick={handlePreviewClick}>
        <Image
          src={preview.image}
          alt={jsonData?.announcementTitle || jsonData?.announcementUrl}
          width={120}
          height={100}
          style={{ marginRight: '8px', marginBottom: 0 }}
        />

        <StyledPreviewTitleDescription>
          <StyledTitle>
            {preview.title || jsonData?.announcementUrl}
          </StyledTitle>
          <StyledDescription>{preview.description}</StyledDescription>
        </StyledPreviewTitleDescription>
      </StyledPreview>
      <div>
        <div style={{ fontSize: '14px' }}>
          Other projects in this announcement
        </div>
        <div>
          {jsonData?.otherProjectsInAnnouncement
            ?.filter((project) => project.rowId !== applicationId)
            .map((project) => (
              <div key={project.id}>
                <StyledLink
                  href={`/analyst/application/${project.rowId}/project?section=announcements`}
                  rel="noreferrer"
                  target="_blank"
                >
                  {project.ccbcNumber}
                </StyledLink>
              </div>
            ))}
        </div>
      </div>
    </StyledAnnouncement>
  );
};

export default HistoryAnnouncementCard;
