import commonAssessment from './commonAssessment';

const screeningSchema = {
  screening: {
    properties: {
      ...commonAssessment,
      decision: {
        title: 'Decision',
        default: 'No decision',
      },
      contestingMap: {
        title: 'Contesting Map',
      },
      connectedCoastNetworkDependent: {
        title: 'Connected Coast Network Dependent',
      },
      crtcProjectDependent: {
        title: 'CRTC Project Dependent',
      },
    },
  },
};

export default screeningSchema;
