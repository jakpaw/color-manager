import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useCallback, useState } from 'react';

interface ColorData {
  name: string;
  value: string;
}

export const CREATE_COLOR_MUTATION = gql`
  mutation CreateColor($name: String!, $value: String!) {
    createColor(name: $name, value: $value) {
      id
      name
      value
    }
  }
`;

export function useCreateColor() {
  const [creating, setCreating] = useState(false);

  // TODO: add types
  const [createColor] = useMutation(CREATE_COLOR_MUTATION, {
    refetchQueries: ['GetColors'],
    awaitRefetchQueries: true,
  });

  const handleCreate = useCallback(
    async ({ name, value }: ColorData) => {
      try {
        setCreating(true);
        await createColor({ variables: { name, value } });
      } catch (error) {
        // TODO: extract error handling to a common place
        const errorWithMessage = error as { message?: string };
        if (errorWithMessage.message) {
          // TODO: replace with toast message
          alert(`Creating color failed: ${errorWithMessage.message}`);
        } else {
          alert(`Creating color failed`);
        }
      } finally {
        setCreating(false);
      }
    },
    [setCreating, createColor]
  );

  return {
    createColor: handleCreate,
    creating,
  };
}
