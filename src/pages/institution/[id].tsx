import Link from 'next/link';
import styles from '../../styles/Home.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Institution page</h1>
        <Link href="/">
          <a>Go to home page</a>
        </Link>
      </main>
    </div>
  );
}
