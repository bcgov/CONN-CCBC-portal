import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { CalculationForm } from '../../../components/Form/';
import type { JSONSchema7 } from 'json-schema';
import { getInitialPreloadedQuery, getRelayProps } from 'relay-nextjs/app';
import { getClientEnvironment } from '../../../lib/relay/client';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  MoneyWidget,
  NumberWidget,
  ReadOnlyWidget,
  ReadOnlyMoneyWidget,
} from '../../../lib/theme/widgets';
import {
  calculateFundingRequestedCCBC,
  calculateProjectEmployment,
} from '../../../lib/theme/customFieldCalculations';

type Props = {
  formData: any;
  onSubmit: () => void;
  schema: JSONSchema7;
  uiSchema: any;
};

const clientEnv = getClientEnvironment();
const initialPreloadedQuery = getInitialPreloadedQuery({
  createClientEnvironment: () => getClientEnvironment()!,
});

const CalculationFormTestRenderer: React.FC<Props> = ({
  formData,
  onSubmit,
  schema,
  uiSchema,
}) => {
  const relayProps = getRelayProps({}, initialPreloadedQuery);
  const env = relayProps.preloadedQuery?.environment ?? clientEnv!;

  const calculate = (formData) => {
    formData = {
      ...formData,
      ...calculateFundingRequestedCCBC(formData),
      ...calculateProjectEmployment(formData),
    };
    return formData;
  };

  return (
    <RelayEnvironmentProvider environment={env}>
      <CalculationForm
        formData={formData}
        onSubmit={onSubmit}
        onCalculate={(formData) => calculate(formData)}
        schema={schema as JSONSchema7}
        uiSchema={uiSchema}
      />
    </RelayEnvironmentProvider>
  );
};

const mockEmploymentSchema = {
  title: 'Estimated project employment',
  type: 'object',
  required: [
    'numberOfEmployeesToWork',
    'hoursOfEmploymentPerWeek',
    'personMonthsToBeCreated',
  ],
  properties: {
    numberOfEmployeesToWork: {
      title: 'Number of people to work on the project',
      type: 'number',
    },
    hoursOfEmploymentPerWeek: {
      title: `Hours of employment per week (average)`,
      type: 'number',
    },
    personMonthsToBeCreated: {
      title: `Total person months of employment to be created (average)`,
      type: 'number',
    },
    estimatedFTECreation: {
      title: `Total estimated full-time equivalent (FTE) Job Creation`,
      type: 'number',
      readOnly: true,
    },
  },
};

const mockEmploymentUiSchema = {
  'ui:order': [
    'numberOfEmployeesToWork',
    'hoursOfEmploymentPerWeek',
    'personMonthsToBeCreated',
    'estimatedFTECreation',
  ],
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
  },
};

const mockFundingSchema = {
  title: 'Project funding',
  type: 'object',
  required: [
    'numberOfEmployeesToWork',
    'hoursOfEmploymentPerWeek',
    'personMonthsToBeCreated',
  ],
  properties: {
    fundingRequestedCCBC2223: {
      title: '2022-23',
      type: 'number',
    },
    fundingRequestedCCBC2324: {
      title: '2023-24',
      type: 'number',
    },
    fundingRequestedCCBC2425: {
      title: '2024-25',
      type: 'number',
    },
    fundingRequestedCCBC2526: {
      title: '2025-26',
      type: 'number',
    },
    fundingRequestedCCBC2627: {
      title: '2026-27',
      type: 'number',
    },
    totalFundingRequestedCCBC: {
      title: 'Total amount requested under CCBC',
      type: 'number',
      readOnly: true,
    },
  },
};

const mockFundingUiSchema = {
  'ui:order': [
    'totalFundingRequestedCCBC',
    'fundingRequestedCCBC2223',
    'fundingRequestedCCBC2324',
    'fundingRequestedCCBC2425',
    'fundingRequestedCCBC2526',
    'fundingRequestedCCBC2627',
  ],
  fundingRequestedCCBC2223: {
    'ui:widget': MoneyWidget,
  },
  fundingRequestedCCBC2324: {
    'ui:widget': MoneyWidget,
  },
  fundingRequestedCCBC2425: {
    'ui:widget': MoneyWidget,
  },
  fundingRequestedCCBC2526: {
    'ui:widget': MoneyWidget,
  },
  fundingRequestedCCBC2627: {
    'ui:widget': MoneyWidget,
  },
  totalFundingRequestedCCBC: {
    'ui:widget': ReadOnlyMoneyWidget,
  },
};

const renderStaticLayout = (schema: JSONSchema7, uiSchema: JSONSchema7) => {
  return render(
    <CalculationFormTestRenderer
      formData={{}}
      onSubmit={() => console.log('test')}
      schema={schema as JSONSchema7}
      uiSchema={uiSchema}
    />
  );
};

describe('The CalculationForm should calculate employment fields', () => {
  beforeEach(() => {
    jest.useFakeTimers();

    renderStaticLayout(
      mockEmploymentSchema as JSONSchema7,
      mockEmploymentUiSchema as JSONSchema7
    );
  });

  it('should render the numberOfEmployeesToWork field', () => {
    expect(screen.getByTestId('root_numberOfEmployeesToWork'));
  });

  it('should contain the correct calculated value', () => {
    const people = screen.getByTestId('root_numberOfEmployeesToWork');
    const hours = screen.getByTestId('root_hoursOfEmploymentPerWeek');
    const months = screen.getByTestId('root_personMonthsToBeCreated');

    act(() => {
      fireEvent.change(people, { target: { value: 12 } });
      jest.runOnlyPendingTimers();
      fireEvent.change(hours, { target: { value: 40 } });
      jest.runOnlyPendingTimers();
      fireEvent.change(months, { target: { value: 20 } });
      jest.runAllTimers();
    });

    expect(screen.getByText(22.9)).toBeInTheDocument();
  });
});

describe('The CalculationForm should calculate project funding fields', () => {
  beforeEach(() => {
    jest.useFakeTimers();

    renderStaticLayout(
      mockFundingSchema as JSONSchema7,
      mockFundingUiSchema as JSONSchema7
    );
  });

  it('should contain the correct calculated value', () => {
    const fundingRequestedCCBC2223 = screen.getByTestId(
      'root_fundingRequestedCCBC2223'
    );
    const fundingRequestedCCBC2324 = screen.getByTestId(
      'root_fundingRequestedCCBC2324'
    );
    const fundingRequestedCCBC2425 = screen.getByTestId(
      'root_fundingRequestedCCBC2425'
    );
    const fundingRequestedCCBC2526 = screen.getByTestId(
      'root_fundingRequestedCCBC2526'
    );
    const fundingRequestedCCBC2627 = screen.getByTestId(
      'root_fundingRequestedCCBC2627'
    );

    act(() => {
      fireEvent.change(fundingRequestedCCBC2223, { target: { value: 1 } });
      jest.runOnlyPendingTimers();
      fireEvent.change(fundingRequestedCCBC2324, { target: { value: 2 } });
      jest.runOnlyPendingTimers();
      fireEvent.change(fundingRequestedCCBC2425, { target: { value: 3 } });
      jest.runOnlyPendingTimers();
      fireEvent.change(fundingRequestedCCBC2526, { target: { value: 4 } });
      jest.runOnlyPendingTimers();
      fireEvent.change(fundingRequestedCCBC2627, { target: { value: 5 } });
      jest.runAllTimers();
    });

    expect(screen.getByTestId('root_totalFundingRequestedCCBC')).toHaveValue(
      '$15'
    );
  });
});
