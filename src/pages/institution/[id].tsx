import Link from 'next/link';
import styles from '../../styles/Home.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Institution page</h1>
        <Link href="/">
          <p>Go to home page</p>
        </Link>
      </main>
    </div>
  );
}
