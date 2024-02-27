import { RJSFSchema } from '@rjsf/utils';

const announcements: RJSFSchema = {
  description: '',
  type: 'object',
  required: ['announcementType', 'announcementUrl', 'announcementDate'],
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
