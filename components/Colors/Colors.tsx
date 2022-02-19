import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Color from '../Color';
import CreateColor from '../CreateColor';

const GET_COLORS = gql`
  query GetColors {
    colors {
      id
      name
      value
    }
  }
`;

const Colors = () => {
  const { data, error } =
    useQuery<Pick<NexusGen['fieldTypes']['Query'], 'colors'>>(GET_COLORS);

  // TODO: loader
  return (
    <div>
      {error && <>error: {JSON.stringify(error)}</>}

      <ul>
        {data?.colors.map(({ id, name, value }) => (
          <Color key={id} id={id} name={name} value={value} />
        ))}
      </ul>
      <CreateColor />
    </div>
  );
};

export default Colors;
