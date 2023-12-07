import React from 'react';
import { render, screen } from '@testing-library/react';
import { ZoneMapWidget } from 'lib/theme/widgets';
import ObjectFieldTemplate from 'lib/theme/ObjectFieldTemplate';
import MaterialUI, { ThemeProvider } from '@mui/material';
import theme from 'styles/muiTheme';

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    useMediaQuery: jest.fn(),
  };
});

const mockSchema = {
  title: 'Project area',
  type: 'object',
  required: ['zoneMapTestField'],
  properties: {
    zoneMapTestField: {
      title: 'test',
      type: 'string',
    },
  },
};

const mockUiSchema = {
  zoneMapTestField: {
    'ui:widget': ZoneMapWidget,
    'ui:options': {
      customTitle: true,
    },
  },
  'ui:inline': [
    {
      columns: 2,
      title: 'test1',
      zoneMapTestField: '1 / 2',
    },
  ],
  'ui:inline:sm': [
    {
      columns: 1,
      title: 'test2',
      zoneMapTestField: '1 / 2',
    },
  ],
};

const singleColMockUiSchema = {
  ...mockUiSchema,
  'ui:inline': [
    {
      title: 'test1',
      zoneMapTestField: '1 / 2',
    },
  ],
};

const mockProps = {
  uiSchema: mockUiSchema,
  schema: mockSchema,
  description: 'Mock description',
  title: 'Mock title',
  properties: [],
};

const singleColMockProps = {
  ...mockProps,
  uiSchema: singleColMockUiSchema,
};

describe('ObjectFieldTemplate', () => {
  it('calculates uiInline correctly in normal screen', () => {
    render(
      <ThemeProvider theme={theme}>
        <ObjectFieldTemplate {...mockProps} />
      </ThemeProvider>
    );
    expect(screen.getByTestId('grid-row')).toHaveStyle(
      'grid-template-columns: repeat(2, 1fr)'
    );
  });

  it('calculates uiInline correctly in mobile view', () => {
    jest.spyOn(MaterialUI, 'useMediaQuery').mockImplementationOnce(() => true);
    render(
      <ThemeProvider theme={theme}>
        <ObjectFieldTemplate {...mockProps} />
      </ThemeProvider>
    );
    expect(screen.getByTestId('grid-row')).toHaveStyle(
      'grid-template-columns: repeat(1, 1fr)'
    );
  });

  it('renders grid correctly when no column configurations provided', () => {
    render(
      <ThemeProvider theme={theme}>
        <ObjectFieldTemplate {...singleColMockProps} />
      </ThemeProvider>
    );
    expect(screen.getByTestId('grid-row')).toHaveStyle(
      'grid-template-columns: repeat(1, 1fr)'
    );
  });
});
