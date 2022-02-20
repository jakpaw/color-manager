import styles from './ColorSample.module.scss';

interface ColorSampleProps {
  color: string;
}

const ColorSample = ({ color }: ColorSampleProps) => {
  return (
    <div
      className={styles['color-sample']}
      style={{ backgroundColor: color }}
    />
  );
};

export default ColorSample;
