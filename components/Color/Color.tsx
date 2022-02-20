import classNames from 'classnames';

import styles from './Color.module.scss';
import { useDeleteColor } from './hooks';

interface ColorProps {
  id: string;
  name: string;
  value: string;
}

const Color = ({ id, name, value }: ColorProps) => {
  const { deleteColor, deleting } = useDeleteColor(id);

  return (
    <li
      className={classNames(styles.color, deleting && styles.color__deleting)}
    >
      {name}: {value}
      <button type="button" onClick={deleteColor} disabled={deleting}>
        {deleting ? 'Deleting...' : 'Delete color'}
      </button>
    </li>
  );
};

export default Color;
