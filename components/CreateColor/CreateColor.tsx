import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import ColorSample from '../ColorSample';
import { useCreateColor } from './hooks';

import styles from './CreateColor.module.scss';

interface CreateColorForm {
  name: string;
  value: string;
}

const CreateColor = () => {
  const { createColor, creating } = useCreateColor();

  const { handleSubmit, register, reset, watch } = useForm<CreateColorForm>();
  const handleCreate = useCallback(
    async ({ name, value }: CreateColorForm) => {
      await createColor({ name, value: `#${value}` });
      reset(); // TODO: do not reset on error
    },
    [createColor, reset]
  );

  return (
    <section>
      <h2>Create new color</h2>
      <form
        onSubmit={handleSubmit(handleCreate)}
        className={styles['create-color']}
      >
        <ColorSample color={`#${watch('value')}`} />
        <span>
          <label htmlFor="create-color-name">Name:</label>
          &nbsp;
          <input
            id="create-color-name"
            placeholder="Dark"
            {...register('name', { required: true })}
            disabled={creating}
          />
        </span>
        <span>
          <label htmlFor="create-color-value">Value: #</label>
          {/* TODO: client side validation */}
          <input
            id="create-color-value"
            placeholder="112233"
            {...register('value', { required: true })}
            disabled={creating}
          />
        </span>
        <button type="submit" disabled={creating}>
          {creating ? 'Creating...' : 'Create color'}
        </button>
      </form>
    </section>
  );
};

export default CreateColor;
