import { render, fireEvent } from '@testing-library/react';
import {
  optionChecker,
  renderTags,
} from 'components/Analyst/Project/widgets/CcbcIdWidget';

describe('UrlWidget', () => {
  it('should not render tag if ccbcNumber matches', () => {
    // Sample tag data
    const tagValue = [
      { ccbcNumber: '123', rowId: '1' },
      { ccbcNumber: '456', rowId: '2' },
    ];

    // Sample getTagProps function
    const getTagProps = ({ index }) => ({ 'data-testid': `tag-${index}` });

    // Render tags using the extracted renderTags function
    const { getByTestId, queryByTestId } = render(
      <div>{renderTags(tagValue, getTagProps, '123')}</div>
    );

    // Assert the tags are rendered
    expect(queryByTestId('tag-0')).not.toBeInTheDocument();
    expect(getByTestId('tag-1')).toHaveTextContent('456');
  });

  it('renders tags and handles click events', () => {
    // Mock the window.open function
    const windowOpenSpy = jest
      .spyOn(window, 'open')
      .mockImplementation(() => null);

    // Sample tag data
    const tagValue = [
      { ccbcNumber: '123', rowId: '1' },
      { ccbcNumber: '456', rowId: '2' },
    ];

    // Sample getTagProps function
    const getTagProps = ({ index }) => ({ 'data-testid': `tag-${index}` });

    // Render tags using the extracted renderTags function
    const { getByTestId } = render(
      <div>{renderTags(tagValue, getTagProps, '')}</div>
    );

    // Assert the tags are rendered
    expect(getByTestId('tag-0')).toHaveTextContent('123');
    expect(getByTestId('tag-1')).toHaveTextContent('456');

    // Fire click event on the first tag
    fireEvent.click(getByTestId('tag-0'));

    // Assert window.open is called with the correct URL
    expect(windowOpenSpy).toHaveBeenCalledWith(
      '/analyst/application/1/project',
      '_blank'
    );

    // Clean up the window.open mock
    windowOpenSpy.mockRestore();
  });

  it('returns true when the rowId and ccbcNumber properties match', () => {
    const option1 = { rowId: '1', ccbcNumber: '123' };
    const option2 = { rowId: '1', ccbcNumber: '123' };

    expect(optionChecker(option1, option2)).toBe(true);
  });

  it('returns false when the rowId property does not match', () => {
    const option1 = { rowId: '1', ccbcNumber: '123' };
    const option2 = { rowId: '2', ccbcNumber: '123' };

    expect(optionChecker(option1, option2)).toBe(false);
  });

  it('returns false when the ccbcNumber property does not match', () => {
    const option1 = { rowId: '1', ccbcNumber: '123' };
    const option2 = { rowId: '1', ccbcNumber: '456' };

    expect(optionChecker(option1, option2)).toBe(false);
  });

  it('returns false when both rowId and ccbcNumber properties do not match', () => {
    const option1 = { rowId: '1', ccbcNumber: '123' };
    const option2 = { rowId: '2', ccbcNumber: '456' };

    expect(optionChecker(option1, option2)).toBe(false);
  });
});
