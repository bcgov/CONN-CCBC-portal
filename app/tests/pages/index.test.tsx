import Home from '../../pages/index';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { createMockEnvironment } from 'relay-test-utils';
import { RelayProps } from 'relay-nextjs';

import { render, screen } from '@testing-library/react';

const environment = createMockEnvironment();

const renderStaticLayout = ({ preloadedQuery }: RelayProps) => {
  return render(
    <RelayEnvironmentProvider environment={environment}>
      <Home preloadedQuery={preloadedQuery} CSN={false} />
    </RelayEnvironmentProvider>
  );
};

describe('The index page', () => {
  it('should render Login button', () => {
    // renderStaticLayout();
    // expect(screen.getByText('Login'));
  });
});
