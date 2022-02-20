import { useMutation } from '@apollo/client';
import { useCallback, useState } from 'react';
import gql from 'graphql-tag';

const DELETE_COLOR_MUTATION = gql`
  mutation DeleteColor($id: ID!) {
    deleteColor(id: $id) {
      id
      name
      value
    }
  }
`;

export function useDeleteColor(id: string) {
  const [deleting, setDeleting] = useState(false);

  // TODO: add types
  const [deleteColor] = useMutation(DELETE_COLOR_MUTATION, {
    variables: { id },
    refetchQueries: ['GetColors'],
    awaitRefetchQueries: true,
  });

  const handleDelete = useCallback(async () => {
    try {
      setDeleting(true);
      await deleteColor();
    } catch (error: unknown) {
      const errorWithMessage = error as { message?: string };
      if (errorWithMessage.message) {
        // TODO: replace with toast message
        alert(`Deleting color failed: ${errorWithMessage.message}`);
      } else {
        alert(`Deleting color failed`);
      }
    } finally {
      setDeleting(false);
    }
  }, [setDeleting, deleteColor]);

  return {
    deleteColor: handleDelete,
    deleting,
  };
}
