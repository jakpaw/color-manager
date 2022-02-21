import { isValidColorHex } from '../../shared/validation';
import styles from './ColorSample.module.scss';

interface ColorSampleProps {
  color: string;
}

const ColorSample = ({ color }: ColorSampleProps) => {
  return (
    <div
      className={styles['color-sample']}
      style={isValidColorHex(color) ? { background: color } : {}}
    />
  );
};

export default ColorSample;
