const sharedItems = {
  announcementUrl: {
    'ui:title': 'Announcement URL',
    'ui:widget': 'TextWidget',
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
      items: {
        ...sharedItems,
        'ui:options': {
          flexDirection: 'row',
        },
      },
    },
    secondary: {
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
