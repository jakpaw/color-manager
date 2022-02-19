import type { NextPage } from 'next';
import Head from 'next/head';
import Colors from '../components/Colors';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Color manager</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Colors />
      </main>
    </div>
  );
};

export default Home;
