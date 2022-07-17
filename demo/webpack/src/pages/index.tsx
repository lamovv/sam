import Demo from '@/components/index';
import styles from './index.module.scss';

function Pages() {
  return (
    <div className={styles.page}>
      <h1>Demo 66</h1>
      <Demo
        defaultValue={1}
      />
    </div>
  );
}

export default Pages;
