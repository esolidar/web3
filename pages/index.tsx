import { useContractKit } from '@celo-tools/use-contractkit';
// import styles from '../styles/Home.module.css';

// TODO: gas price
// TODO: success / error das transactions

export default function Home() {
  const toAccount = '0x7F38B1585d55A9bc881da27e2FB927d0db30fD41';
  const { address, network, connect, destroy, kit, performActions } = useContractKit();

  const teste = ['item1', 'item2'];

  teste.forEach(item => {
    item = 'name';
  });

  async function transfer() {
    await performActions(async kit => {
      const stableToken = await kit.contracts.getStableToken();
      const amount = kit.web3.utils.toWei('1', 'ether');

      const gasLimit = await kit.connection.estimateGas({
        to: toAccount,
        from: address,
        value: amount,
      });

      let gasPrice = '500000000';
      const adjustedGasLimit = gasLimit * 2;

      // try {
      //   gasPrice = await kit.connection.gasPrice.toString();
      // } catch (_) {}

      const tx = await stableToken
        .transfer(toAccount, amount)
        .send({ from: address, feeCurrency: stableToken.address, gas: adjustedGasLimit, gasPrice });

      const hash = await tx.getHash();
      const receipt = await tx.waitReceipt();
      console.log('hash', hash);
      console.log('receipt', receipt);
    });
  }

  // function getGas() {
  //   const gasLimit = await kit.connection.estimateGas(celoTx);
  //   let gasPrice = '500000000';

  //   // try {
  //   //   gasPrice = await kit.connection.gasPrice.toString();
  //   // } catch (_) {}

  //   const adjustedGasLimit = gasLimit * 2;

  //   return gasPrice;
  // }

  async function getBalances() {
    // 7. Get your account
    await performActions(async kit => {
      let totalBalance = await kit.getTotalBalance(address);

      console.log(totalBalance);

      // // 8. Get the token contract wrappers
      let celotoken = await kit.contracts.getGoldToken();
      let cUSDtoken = await kit.contracts.getStableToken();
      let cEURtoken = await kit.contracts.getStableToken('cEUR');

      // // 9. Get your token balances
      let celoBalance = await celotoken.balanceOf(account.address);
      let cUSDBalance = await cUSDtoken.balanceOf(account.address);
      let cEURBalance = await cEURtoken.balanceOf(account.address);

      // // Print your account info
      // console.log(`Your account address: ${account.address}`);
      // console.log(`Your account CELO balance: ${celoBalance.toString()}`);
      // console.log(`Your account cUSD balance: ${cUSDBalance.toString()}`);
      // console.log(`Your account cEUR balance: ${cEURBalance.toString()}`);
    });
  }

  return (
    <div>
      <main>
        {address ? (
          <>
            {address}
            <button onClick={getBalances}>getBalances</button>
            <button onClick={transfer}>Transfer</button>
            <button onClick={destroy}>Disconnect</button>
          </>
        ) : (
          <button onClick={() => connect().catch(e => console.log(e))}>Connect wallet</button>
        )}
      </main>
    </div>
  );
}
