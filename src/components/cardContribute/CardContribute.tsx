import Button from '@esolidar/toolkit/build/elements/button';
import truncateAddress from '../../utils/truncateAddress';

const CardContribute = ({ address, onClickDonate }) => {
  // const valora = `https://chart.googleapis.com/chart?chs=160x160&cht=qr&chl=celo://wallet/pay?address=0x7F38B1585d55A9bc881da27e2FB927d0db30fD41&displayName=esolidar&chld=L%7C0`;
  const metamask = `https://chart.googleapis.com/chart?chs=160x160&cht=qr&chl=wc:099df4c1-8d6d-4432-b6b1-f8fe5e243efe@1?bridge=https%3A%2F%2Fz.bridge.walletconnect.org&key=2625629f0670a8a5d660471621a727effbdaf28d32b23fa7a34ccfa143779bb7
  &displayName=esolidar&chld=L%7C0`;

  return (
    <div className="card-contribute">
      <h3>Contribute in Celo Dollar </h3>
      {/* <h2>Opens valora</h2>
      <img alt={String(address)} src={valora} /> */}
      {/* <h2>Opens metamask</h2> */}
      <img className="card-contribute__qr-code" alt={String(address)} src={metamask} />
      <p>{truncateAddress(address, 5)}</p>
      <div className="card-contribute__actions">
        <Button
          extraClass="primary-full"
          text="Donate cUSD"
          onClick={onClickDonate}
          size="lg"
          fullWidth
        />
        <Button extraClass="secondary" text="Share" onClick={() => {}} size="lg" fullWidth />
      </div>
    </div>
  );
};

export default CardContribute;
