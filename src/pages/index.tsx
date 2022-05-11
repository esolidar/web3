import { useContractKit } from '@celo-tools/use-contractkit';
import Link from 'next/link';
import styles from '../styles/Home.module.scss';

// TODO: gas price
// TODO: success / error das transactions

export default function Home() {
  const toAccount = '0x7F38B1585d55A9bc881da27e2FB927d0db30fD41';
  const { address, connect, destroy, performActions } = useContractKit();

  async function transfer() {
    await performActions(async kit => {
      let account: string = '';
      const stableToken = await kit.contracts.getStableToken();
      const amount = kit.web3.utils.toWei('1', 'ether');

      if (address) account = address;
      const gasLimit = await kit.connection.estimateGas({
        to: toAccount,
        from: account,
        value: amount,
      });

      const gasPrice = '500000000';
      const adjustedGasLimit = gasLimit * 2;

      // try {
      //   gasPrice = await kit.connection.gasPrice.toString();
      // } catch (_) {}

      const tx = await stableToken
        .transfer(toAccount, amount)
        .send({ from: account, feeCurrency: stableToken.address, gas: adjustedGasLimit, gasPrice });

      // const hash = await tx.getHash();
      const receipt = await tx.waitReceipt();
      if (receipt.status) alert('success');
      else alert('error');
    });
  }

  async function getBalances() {
    await performActions(async kit => {
      let account: string = '';
      const celotoken = await kit.contracts.getGoldToken();
      const cUSDtoken = await kit.contracts.getStableToken();

      if (address) account = address;
      const celoBalance = await celotoken.balanceOf(account);
      const cUSDBalance = await cUSDtoken.balanceOf(account);
      console.log(`Your account CELO balance: ${celoBalance.toString()}`);
      console.log(`Your account cUSD balance: ${cUSDBalance.toString()}`);
    });
  }

  const valora = `https://chart.googleapis.com/chart?chs=160x160&cht=qr&chl=celo://wallet/pay?address=0x7F38B1585d55A9bc881da27e2FB927d0db30fD41&displayName=esolidar&chld=L%7C0`;
  const metamask = `https://chart.googleapis.com/chart?chs=160x160&cht=qr&chl=wc:099df4c1-8d6d-4432-b6b1-f8fe5e243efe@1?bridge=https%3A%2F%2Fz.bridge.walletconnect.org&key=2625629f0670a8a5d660471621a727effbdaf28d32b23fa7a34ccfa143779bb7
  &displayName=esolidar&chld=L%7C0`;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Home page</h1>
        <Link href="/institution/12">
          <p>Go to institution detail</p>
        </Link>
        {address ? (
          <>
            <p>My address</p>
            {address}
            <button type="button" onClick={getBalances}>
              getBalances
            </button>
            <button type="button" onClick={transfer}>
              Transfer
            </button>
            <button type="button" onClick={destroy}>
              Disconnect
            </button>
            <h2>Opens valora</h2>
            <img alt={address} src={valora} />
            <h2>Opens metamask</h2>
            <img alt={address} src={metamask} />
          </>
        ) : (
          <button type="button" onClick={() => connect().catch(e => console.log(e))}>
            Connect wallet
          </button>
        )}
      </main>
    </div>
  );
}
