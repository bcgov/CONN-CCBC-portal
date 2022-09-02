import { NumberWidget, ReadOnlyWidget } from '../../../lib/theme/widgets';

const estimatedProjectEmployment = {
  uiOrder: [
    'currentEmployment',
    'numberOfEmployeesToWork',
    'hoursOfEmploymentPerWeek',
    'personMonthsToBeCreated',
    'estimatedFTECreation',
    'numberOfContractorsToWork',
    'hoursOfContractorEmploymentPerWeek',
    'contractorPersonMonthsToBeCreated',
    'estimatedFTEContractorCreation',
  ],
  currentEmployment: {
    'ui:widget': NumberWidget,
    'ui:options': {
      maxLength: 7,
      commaSeparator: true,
      decimals: 0,
    },
  },
  numberOfEmployeesToWork: {
    'ui:widget': NumberWidget,
    'ui:options': {
      commaSeparator: true,
      decimals: 0,
    },
  },
  hoursOfEmploymentPerWeek: {
    'ui:widget': NumberWidget,
    'ui:options': {
      commaSeparator: true,
      decimals: 1,
    },
  },
  personMonthsToBeCreated: {
    'ui:widget': NumberWidget,
    'ui:options': {
      commaSeparator: true,
      decimals: 1,
    },
  },
  estimatedFTECreation: {
    'ui:widget': ReadOnlyWidget,
    'ui:options': {
      hideOptional: true,
    },
  },
  numberOfContractorsToWork: {
    'ui:widget': NumberWidget,
    'ui:options': {
      commaSeparator: true,
      decimals: 0,
    },
  },
  hoursOfContractorEmploymentPerWeek: {
    'ui:widget': NumberWidget,
    'ui:options': {
      commaSeparator: true,
      decimals: 1,
    },
  },
  contractorPersonMonthsToBeCreated: {
    'ui:widget': NumberWidget,
    'ui:options': {
      commaSeparator: true,
      decimals: 1,
    },
  },
  estimatedFTEContractorCreation: {
    'ui:widget': ReadOnlyWidget,
    'ui:options': {
      hideOptional: true,
    },
  },
  'ui:inline': [
    {
      columns: 1,
      currentEmployment: '1 / 2',
    },
    {
      title: 'Estimated direct employees',
      headline: true,
      columns: 4,
      numberOfEmployeesToWork: 1,
      hoursOfEmploymentPerWeek: 2,
      personMonthsToBeCreated: 3,
      estimatedFTECreation: 4,
    },
    {
      title: 'Estimated contracted labour',
      headline: true,
      columns: 4,
      numberOfContractorsToWork: 1,
      hoursOfContractorEmploymentPerWeek: 2,
      contractorPersonMonthsToBeCreated: 3,
      estimatedFTEContractorCreation: 4,
    },
  ],
};

export default estimatedProjectEmployment;
