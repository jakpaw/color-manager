import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const DELETE_COLOR = gql`
  mutation DeleteColor($id: ID!) {
    deleteColor(id: $id) {
      id
      name
      value
    }
  }
`;

interface ColorProps {
  id: string;
  name: string;
  value: string;
}

const Color = ({ id, name, value }: ColorProps) => {
  // TODO: add types
  const [deleteColor] = useMutation(DELETE_COLOR, {
    variables: { id },
    refetchQueries: ['GetColors'],
  });

  const handleDelete = async () => {
    try {
      await deleteColor();
    } catch (error) {
      // TODO: show error
      console.error(error);
    }
  };

  return (
    <li>
      {name}: {value}
      <button type="button" onClick={handleDelete}>
        Delete color
      </button>
    </li>
  );
};

export default Color;
