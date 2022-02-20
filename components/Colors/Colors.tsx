import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Color from '../Color';
import CreateColor from '../CreateColor';

import styles from './Colors.module.scss';

const GET_COLORS_QUERY = gql`
  query GetColors {
    colors {
      id
      name
      value
    }
  }
`;

const Colors = () => {
  const { data, error, loading } =
    useQuery<Pick<NexusGen['fieldTypes']['Query'], 'colors'>>(GET_COLORS_QUERY);

  return loading ? (
    <div>Loading colors...</div>
  ) : (
    <div>
      {error && <div>Loding colors failed: {error.message}</div>}

      {data && (
        <>
          <ul className={styles.colors__list}>
            {data?.colors.map(({ id, name, value }) => (
              <Color key={id} id={id} name={name} value={value} />
            ))}
          </ul>
          <CreateColor />
        </>
      )}
    </div>
  );
};

export default Colors;
