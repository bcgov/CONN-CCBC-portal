import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/router'; 
import { JSONSchema7 } from 'json-schema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import AnnouncementsHeader from './AnnouncementsHeader';
import DeleteModal from './DeleteModal'; 

const StyledEmpty = styled.div`
  margin: 8px 0;
`;

const StyledContainer = styled.div`
  background: #ffffff;
  position: relative;
`;

const StyledAnnouncement = styled.div`
  display: flex;
  flex - direction: column;
  margin: 8px 0;

  ${(props) => props.theme.breakpoint.smallUp} {
  flex - direction: row;
  align - items: center;
}

  & div {
  margin - left: 16px;
}
`;
const StyledDate = styled.div`
  float:left;
  min-width: 100px;
`;
const StyledIcon = styled.div`
  float:left;
  min-width: 100px;
  margin-left:1em;
`;
const StyledIconBtn = styled.button`
  margin-left: 8px;
  & svg {
    color: ${(props) => props.theme.color.links};
    margin-left: 16px;
  }

  &:hover {
    opacity: 0.7;
  }
`;
const StyledText = styled.div`
  float:left;
  min-width: 300px;
  margin-left:1em;
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.color.links};
  margin-bottom: '0px';
  overflow: hidden;
  max-height: 30px;
  min-width: 2em;
  transition: max-height 0.5s;

  & svg {
    margin-left: 16px;
  }

  &:hover {
    opacity: 0.7;
  }
`;
const concatCCBCNumbers = (currentCcbcNumber, ccbcNumberList) => {
  if (!ccbcNumberList || ccbcNumberList?.length === 0)
    return currentCcbcNumber;
  let projectNumbers = '';
  ccbcNumberList.forEach((application) => {
    projectNumbers += `${application.ccbcNumber},`;
  });
  return `${currentCcbcNumber},${projectNumbers}`;
};

const Announcement = ({ 
  ccbcNumber, 
  handleDelete,
  announcement,
  isFormEditMode,
  setAnnouncementData,
  setFormData,
  setIsFormEditMode
 }) => {
  const goTo = () => {window.open(announcement.jsonData?.announcementUrl, '_blank', 'width=800,scrollbars=yes,height=600,resizable = yes');}
  const ccbcList = announcement.jsonData?.otherProjectsInAnnouncement;  
  const projectNumbers = concatCCBCNumbers(ccbcNumber, ccbcList);

  return (
    <>
    <StyledAnnouncement>
      <StyledDate>{announcement.jsonData?.announcementDate}</StyledDate>
      <StyledIcon>
        <img src='/icons/bcid-apple-icon.svg'
        width={100} height={100} onClick={goTo} alt=''></img>
        </StyledIcon>
      <StyledText>Canada and British Columbia invest over $20 million 
        in infrastructure projects across the province to build more resilient, greener communities.</StyledText>
      <StyledText>
        {projectNumbers}
      </StyledText>
      <StyledButton key={`rm_${announcement.id}`} onClick={() => handleDelete(announcement.rowId)}>X</StyledButton>
      {!isFormEditMode && (
        <StyledIconBtn
          onClick={() => {
            setIsFormEditMode(true);
            setAnnouncementData({
              id: announcement.id,
              rowId: announcement.rowId,
            });
            setFormData(announcement.jsonData);
          }}
          aria-label="Edit announcement"
          data-testid="project-form-edit-button"
        >
          <FontAwesomeIcon icon={faPen} size="xs" />
        </StyledIconBtn>
      )} 
    </StyledAnnouncement>
    </>
  );
};


interface Props {
  ccbcNumber: any,
  announcements: any;
  style?: any;
  startEdit?: ()=>void;
  resetFormData?: ()=>void;
  isFormEditMode: boolean;
  setAnnouncementData: (announcementId: string) => void;
  setFormData: (formData: JSONSchema7) => void;
  setIsFormEditMode: (isFormEditMode: boolean) => void;
}

const ViewAnnouncements: React.FC<Props> = ({ 
  ccbcNumber,
  announcements,
  isFormEditMode,
  setAnnouncementData,
  setFormData,
  setIsFormEditMode,
  style, startEdit, resetFormData,
}) => {
  const router = useRouter();
  const applicationId = router.query.applicationId as string;
  const [toBeDeleted, setToBeDeleted] = useState(-1);
  const primaryAnnouncements = announcements.filter(
    (announcement) => announcement.jsonData.jsonData.announcementType === 'Primary'
  );

  const secondaryAnnouncements = announcements.filter(
    (announcement) => announcement.jsonData.jsonData.announcementType === 'Secondary'
  );

  const isPrimary = primaryAnnouncements.length > 0;
  const isSecondary = secondaryAnnouncements.length > 0;

  const handleDelete = (id: number) => {
    setToBeDeleted(id);
    startEdit();
    window.history.replaceState(null, null, ' ');
    window.location.hash = 'delete-announcement';
  };
  return (
    <StyledContainer style={style}>
      <AnnouncementsHeader title="Primary news release" />
      {isPrimary ? (
        primaryAnnouncements.map((announcement) => {
          return (<div key={`w_${announcement.id}`}>
            <Announcement
              key={announcement.id}
              announcement={announcement}
              ccbcNumber={ ccbcNumber}
              isFormEditMode={isFormEditMode}
              setAnnouncementData={setAnnouncementData}
              setFormData={setFormData}
              setIsFormEditMode={setIsFormEditMode}
              handleDelete = {handleDelete}
            /> 
            </div>
          );
        })
      ) : (
        <StyledEmpty>None</StyledEmpty>
      )}
      <AnnouncementsHeader title="Secondary news releases" />
      {isSecondary ? (
        secondaryAnnouncements.map((announcement) => {
          return (
            <div key={`w_${announcement.id}`}>
            <Announcement
              key={announcement.id}
              announcement={announcement}
              ccbcNumber={ ccbcNumber}
              isFormEditMode={isFormEditMode}
              setAnnouncementData={setAnnouncementData}
              setFormData={setFormData}
              setIsFormEditMode={setIsFormEditMode}
              handleDelete = {handleDelete}
            />
            </div>
          );
        })
      ) : (
        <StyledEmpty>None</StyledEmpty>
      )}
      <DeleteModal id='delete-announcement' rowId={toBeDeleted} applicationId={applicationId} resetFormData={resetFormData}/>
    </StyledContainer>
  );
};

export default ViewAnnouncements;
