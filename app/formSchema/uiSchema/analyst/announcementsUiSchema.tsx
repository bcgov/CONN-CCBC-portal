const announcementsUiSchema = {
  'ui:options': {
    flexDirection: 'row',
  },
  announcementType: {
    'ui:title': 'Announcement type',
  },
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
    'ui:widget': 'CcbcIdWidget',
    'ui:options': {
      boldTitle: true,
    },
  },
};

export default announcementsUiSchema;
