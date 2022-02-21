import userEvent from '@testing-library/user-event';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import Colors, { GET_COLORS_QUERY } from './Colors';
import { DELETE_COLOR_MUTATION } from '../Color/hooks';
import { CREATE_COLOR_MUTATION } from '../CreateColor/hooks';

jest.spyOn(window, 'alert').mockImplementation((text) => console.error(text));

const COLOR_RED = {
  id: '1',
  name: 'red',
  value: '#f00',
};

const COLOR_GREEN = {
  id: '2',
  name: 'green',
  value: '#0f0',
};

describe('Colors component', () => {
  it('should render list of colors', async () => {
    // GIVEN
    render(
      <MockedProvider
        mocks={[
          {
            request: { query: GET_COLORS_QUERY },
            result: {
              data: {
                colors: [COLOR_RED, COLOR_GREEN],
              },
            },
          },
        ]}
      >
        <Colors />
      </MockedProvider>
    );

    // WHEN
    await waitForElementToBeRemoved(() =>
      screen.getByText('Loading colors...')
    );

    // THEN
    expect(screen.getByText('red')).toBeInTheDocument();
    expect(screen.getByText('f00')).toBeInTheDocument();

    expect(screen.getByText('green')).toBeInTheDocument();
    expect(screen.getByText('0f0')).toBeInTheDocument();
  });

  it('should delete a color', async () => {
    //GIVEN
    const user = userEvent.setup();
    render(
      <MockedProvider
        mocks={[
          {
            request: { query: GET_COLORS_QUERY },
            result: {
              data: {
                colors: [COLOR_RED, COLOR_GREEN],
              },
            },
          },
          {
            request: {
              query: DELETE_COLOR_MUTATION,
              variables: {
                id: '2',
              },
            },
            result: {
              data: {
                deleteColor: COLOR_GREEN,
              },
            },
          },
          {
            request: { query: GET_COLORS_QUERY },
            result: {
              data: {
                colors: [COLOR_RED],
              },
            },
          },
        ]}
      >
        <Colors />
      </MockedProvider>
    );

    // WHEN
    await waitForElementToBeRemoved(() =>
      screen.getByText('Loading colors...')
    );

    const deleteButton = screen.getByRole('button', {
      name: 'Delete color green',
    });
    await user.click(deleteButton);

    // THEN
    await waitForElementToBeRemoved(() => screen.getByText('Deleting...'));

    expect(screen.getByText('red')).toBeInTheDocument();
    expect(screen.getByText('f00')).toBeInTheDocument();

    expect(screen.queryByText('green')).not.toBeInTheDocument();
    expect(screen.queryByText('0f0')).not.toBeInTheDocument();
  });

  it('should create a new color', async () => {
    // GIVEN
    const user = userEvent.setup();
    render(
      <MockedProvider
        mocks={[
          {
            request: { query: GET_COLORS_QUERY },
            result: {
              data: {
                colors: [COLOR_RED],
              },
            },
          },
          {
            request: {
              query: CREATE_COLOR_MUTATION,
              variables: {
                name: 'green',
                value: '#0f0',
              },
            },
            result: {
              data: {
                createColor: COLOR_GREEN,
              },
            },
          },
          {
            request: { query: GET_COLORS_QUERY },
            result: {
              data: {
                colors: [COLOR_RED, COLOR_GREEN],
              },
            },
          },
        ]}
      >
        <Colors />
      </MockedProvider>
    );

    // WHEN
    await waitForElementToBeRemoved(() =>
      screen.getByText('Loading colors...')
    );

    const nameInput = screen.getByRole('textbox', {
      name: 'Name:',
    });
    await user.type(nameInput, 'green');

    const valueInput = screen.getByRole('textbox', {
      name: 'Value: #',
    });
    await user.type(valueInput, '0f0');

    const createButton = screen.getByRole('button', {
      name: 'Create color',
    });
    await user.click(createButton);

    // THEN
    await waitForElementToBeRemoved(() => screen.getByText('Creating...'));

    expect(screen.getByText('red')).toBeInTheDocument();
    expect(screen.getByText('f00')).toBeInTheDocument();

    expect(screen.getByText('green')).toBeInTheDocument();
    expect(screen.getByText('0f0')).toBeInTheDocument();
  });
});
