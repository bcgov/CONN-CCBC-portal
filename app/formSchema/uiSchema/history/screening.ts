import commonAssessment from './commonAssessment';

const screeningSchema = {
  screening: {
    properties: {
      ...commonAssessment,
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
