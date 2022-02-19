import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useForm } from 'react-hook-form';

const CREATE_COLOR = gql`
  mutation CreateColor($name: String!, $value: String!) {
    createColor(name: $name, value: $value) {
      id
      name
      value
    }
  }
`;

interface CreateColorForm {
  name: string;
  value: string;
}

const CreateColor = () => {
  // TODO: add types
  const [createColor] = useMutation(CREATE_COLOR, {
    refetchQueries: ['GetColors'],
  });

  const { handleSubmit, register } = useForm<CreateColorForm>();

  const handleCreate = async ({ name, value }: CreateColorForm) => {
    try {
      await createColor({ variables: { name, value: `#${value}` } });
    } catch (error) {
      // TODO: show error
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleCreate)}>
      <input {...register('name')} />
      #<input {...register('value')} />
      <button type="submit">Create color</button>
    </form>
  );
};

export default CreateColor;
