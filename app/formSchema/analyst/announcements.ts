import { JSONSchema7 } from 'json-schema';

const announcements: JSONSchema7 = {
  description: '',
  type: 'object',
  properties: {
    announcements: {
      type: 'object',
      properties: {
        primary: {
          title: 'Primary news release',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              announcementUrl: {
                type: 'string',
                title: 'Announcement URL',
              },
              announcementDate: {
                type: 'string',
                title: 'Announcement date',
              },
              otherProjectsInAnnouncement: {
                type: 'string',
                title: 'Other projects in announcement',
              },
            },
          },
        },
        secondary: {
          title: 'Secondary news releases',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              announcementUrl: {
                type: 'string',
                title: 'Announcement URL',
              },
              announcementDate: {
                type: 'string',
                title: 'Announcement date',
              },
              otherProjectsInAnnouncement: {
                type: 'string',
                title: 'Other projects in announcement',
              },
            },
          },
        },
      },
    },
  },
};

export default announcements;
