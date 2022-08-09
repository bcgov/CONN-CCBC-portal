import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { CalculationForm } from '../../../components/Form/';
import type { JSONSchema7 } from 'json-schema';
import { getInitialPreloadedQuery, getRelayProps } from 'relay-nextjs/app';
import { getClientEnvironment } from '../../../lib/relay/client';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NumberWidget, ReadOnlyWidget } from '../../../lib/theme/widgets';
import { calculateProjectEmployment } from '../../../lib/theme/customFieldCalculations';

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

const schema = {
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

const uiSchema = {
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

describe('The CalculationForm should calculate filled fields', () => {
  beforeEach(() => {
    renderStaticLayout(schema as JSONSchema7, uiSchema as JSONSchema7);
  });

  it('should render the numberOfEmployeesToWork field', () => {
    expect(screen.getByTestId('root_numberOfEmployeesToWork'));
  });

  it('should contain the correct calculated value', () => {
    const people = screen.getByTestId('root_numberOfEmployeesToWork');
    const hours = screen.getByTestId('root_hoursOfEmploymentPerWeek');
    const months = screen.getByTestId('root_personMonthsToBeCreated');

    fireEvent.change(people, { target: { value: 12 } });
    fireEvent.change(hours, { target: { value: 40 } });
    fireEvent.change(months, { target: { value: 20 } });

    waitFor(() => expect(screen.getByText(22.86)));
  });
});
