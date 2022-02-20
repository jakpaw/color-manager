import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateColor } from './hooks';

interface CreateColorForm {
  name: string;
  value: string;
}

const CreateColor = () => {
  const { createColor, creating } = useCreateColor();

  const { handleSubmit, register, reset } = useForm<CreateColorForm>();
  const handleCreate = useCallback(
    async (formData: CreateColorForm) => {
      await createColor(formData);
      reset(); // TODO: do not reset on error
    },
    [createColor, reset]
  );

  return (
    <form onSubmit={handleSubmit(handleCreate)}>
      <input {...register('name')} disabled={creating} />
      #<input {...register('value')} disabled={creating} />
      <button type="submit" disabled={creating}>
        {creating ? 'Creating...' : 'Create color'}
      </button>
    </form>
  );
};

export default CreateColor;
