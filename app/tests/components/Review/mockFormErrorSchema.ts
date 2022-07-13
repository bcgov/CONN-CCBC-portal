const mockFormErrorSchema = {
  projectArea: {
    projectSpanMultipleLocations: {
      __errors: [
        'should be equal to one of the allowed values',
        'should be boolean',
      ],
    },
    provincesTerritories: {
      '0': {
        __errors: ['should be boolean'],
      },
      '1': {
        __errors: ['should be boolean'],
      },
    },
    __errors: ['should match exactly one schema in oneOf'],
    geographicArea: {
      '0': {
        __errors: ['should be boolean'],
      },
      '1': {
        __errors: ['should be boolean'],
      },
      '2': {
        __errors: ['should be boolean'],
      },
      '3': {
        __errors: ['should be boolean'],
      },
    },
  },
  otherFundingSources: {
    otherFundingSources: {
      __errors: ['should be boolean'],
    },
  },
  techSolution: {
    backboneTechnology: {
      '0': {
        __errors: ['should be boolean'],
      },
      '1': {
        __errors: ['should be boolean'],
      },
      '2': {
        __errors: ['should be boolean'],
      },
    },
    lastMileTechnology: {
      '0': {
        __errors: ['should be boolean'],
      },
      '1': {
        __errors: ['should be boolean'],
      },
      '2': {
        __errors: ['should be boolean'],
      },
      '3': {
        __errors: ['should be boolean'],
      },
    },
  },
  organizationProfile: {
    other: {
      __errors: ['is a required property'],
    },
    bandNumber: {
      __errors: ['is a required property'],
    },
    typeOfOrganization: {
      __errors: ['should be array'],
    },
    isNameLegalName: {
      __errors: ['should be boolean'],
    },
    isSubsidiary: {
      __errors: ['should be boolean'],
    },
    isIndigenousEntity: {
      __errors: ['should be boolean'],
    },
  },
  organizationLocation: {
    isMailingAddress: {
      __errors: [
        'should be equal to one of the allowed values',
        'should be boolean',
      ],
    },
    mailingAddress: {
      isMailingAddress: {
        __errors: ['is a required property'],
      },
    },
    __errors: ['should match exactly one schema in oneOf'],
  },
  declarations: {
    declarationsList: {
      '0': {
        __errors: [
          'should be boolean',
          'should be equal to one of the allowed values',
        ],
      },
      '1': {
        __errors: [
          'should be boolean',
          'should be equal to one of the allowed values',
        ],
      },
      '2': {
        __errors: ['should be boolean'],
      },
      '3': {
        __errors: ['should be boolean'],
      },
      '4': {
        __errors: ['should be boolean'],
      },
    },
  },
  declarationsSign: {
    declarationsCompletedFor: {
      __errors: ['is a required property'],
    },
    declarationsDate: {
      __errors: ['is a required property'],
    },
    declarationsCompletedBy: {
      __errors: ['is a required property'],
    },
    declarationsTitle: {
      __errors: ['is a required property'],
    },
  },
};

export default mockFormErrorSchema;
