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
    'ui:widget': 'DateWidget',
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
      title: 'Placeholder',
      columns: 3,
      announcementUrl: 1,
      announcementDate: 2,
      otherProjectsInAnnouncement: 3,
    },
  ],
};

const announcementsUiSchema = {
  primary: {
    items: {
      ...sharedItems,
    },
  },
  secondary: {
    items: {
      ...sharedItems,
    },
  },
};

export default announcementsUiSchema;
