const timeMachine = {
  timeMachine: {
    title: 'Time Mashine',
    type: 'object',
    description:
      'Internal tool to test application behavior at the varous points of time in the past or the future',
    required: [
      'targetDate' 
    ],
    properties: {
      targetDate: {
        title: 'Target Date (YYYY/MM/DD)',
        type: 'string',
      },
    },
  },
};

export default timeMachine;
