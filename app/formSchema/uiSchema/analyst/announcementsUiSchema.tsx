import AnnouncementsHeader from 'components/Analyst/Project/Announcements/AnnouncementsHeader';

const sharedItems = {
  announcementUrl: {
    'ui:title': 'Announcement URL',
    'ui:widget': 'UrlWidget',
    'ui:options': {
      boldTitle: true,
    },
  },
  announcementDate: {
    'ui:title': 'Announcement date',
    'ui:widget': 'DatePickerWidget',
    'ui:options': {
      boldTitle: true,
    },
  },
  otherProjectsInAnnouncement: {
    'ui:title': 'Other projects in announcement',
    'ui:widget': 'TextWidget',
    'ui:options': {
      boldTitle: true,
    },
  },
  'ui:inline': [
    {
      columns: 3,
      announcementUrl: 1,
      announcementDate: 2,
      otherProjectsInAnnouncement: 3,
    },
  ],
  'ui:array-buttons': {
    addBtnLabel: 'Add announcement',
    removeBtnLabel: 'Remove',
  },
};

const announcementsUiSchema = {
  'ui:options': {
    flexDirection: 'column',
  },
  announcements: {
    primary: {
      'ui:before': <AnnouncementsHeader title="Primary news release" />,
      items: {
        ...sharedItems,
        'ui:options': {
          flexDirection: 'row',
        },
      },
    },
    secondary: {
      'ui:before': <AnnouncementsHeader title="Secondary news release" />,
      items: {
        ...sharedItems,
        'ui:options': {
          flexDirection: 'row',
        },
      },
    },
  },
};

export default announcementsUiSchema;
