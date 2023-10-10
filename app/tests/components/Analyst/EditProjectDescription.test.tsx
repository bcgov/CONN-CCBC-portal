import { graphql } from 'react-relay';
import compiledQuery, {
  EditProjectDescriptionTestQuery,
} from '__generated__/EditProjectDescriptionTestQuery.graphql';
import { act, screen, fireEvent } from '@testing-library/react';
import EditProjectDescription from 'components/Analyst/EditProjectDescription';
import ComponentTestingHelper from '../../utils/componentTestingHelper';

const testQuery = graphql`
  query EditProjectDescriptionTestQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      ...EditProjectDescription_query
    }
  }
`;

const mockQueryPayload = {
  Application() {
    return {
      rowId: 1,
      internalDescription: 'test description',
    };
  },
};

const componentTestingHelper =
  new ComponentTestingHelper<EditProjectDescriptionTestQuery>({
    component: EditProjectDescription,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.applicationByRowId,
    }),
  });

describe('The EditProjectDescription component', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
  });

  it('displays the read only project description', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText('test description')).toBeInTheDocument();
  });

  it('displays the edit form when the description is clicked', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const text = screen.getByText('test description');

    await act(async () => {
      fireEvent.click(text);
    });

    const textarea = screen.getByDisplayValue('test description');

    expect(textarea).toBeInTheDocument();
  });

  it('calls the mutation when the description is changed', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const text = screen.getByText('test description');

    await act(async () => {
      fireEvent.click(text);
    });

    const textarea = screen.getByDisplayValue('test description');

    await act(async () => {
      fireEvent.change(textarea, { target: { value: 'test description 2' } });
    });

    // select textarea and press enter key
    await act(async () => {
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' });
    });

    componentTestingHelper.expectMutationToBeCalled(
      'createApplicationInternalDescriptionMutation',
      {
        input: {
          _applicationId: 1,
          _description: 'test description 2',
        },
      }
    );

    componentTestingHelper.environment.mock.resolveMostRecentOperation({
      errors: [],
      data: {
        application: {
          id: 'test-id',
          rowId: 1,
          internalDescription: 'test description 2',
        },
      },
    });

    expect(screen.getByText('test description 2')).toBeVisible();
  });

  it('displays the original description when the escape key is pressed', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const text = screen.getByText('test description');

    await act(async () => {
      fireEvent.click(text);
    });

    const textarea = screen.getByDisplayValue('test description');

    await act(async () => {
      fireEvent.change(textarea, { target: { value: 'test description 2' } });
    });

    expect(textarea).toHaveValue('test description 2');

    await act(async () => {
      fireEvent.keyDown(textarea, { key: 'Escape', code: 'Escape' });
    });

    expect(screen.getByText('test description')).toBeInTheDocument();
  });

  it('displays the remaining character count', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const text = screen.getByText('test description');

    await act(async () => {
      fireEvent.click(text);
    });

    expect(screen.getByText('304 characters remaining')).toBeInTheDocument();

    const textarea = screen.getByDisplayValue('test description');

    await act(async () => {
      fireEvent.change(textarea, { target: { value: 'test description 2' } });
    });

    expect(screen.getByText('302 characters remaining')).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(textarea, {
        target: {
          value: 'test description 2 more testing',
        },
      });
    });

    expect(screen.getByText('289 characters remaining')).toBeInTheDocument();
  });
});
