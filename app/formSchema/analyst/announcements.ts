import { JSONSchema7 } from 'json-schema';

const announcements: JSONSchema7 = {
  description: '',
  type: 'object',
  required: [
    'announcementType',
    'announcementUrl',
    'announcementDate',
    'otherProjectsInAnnouncement',
  ],
  properties: {
    announcementType: {
      type: 'string',
      enum: ['Primary', 'Secondary'],
    },
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
};

export default announcements;
