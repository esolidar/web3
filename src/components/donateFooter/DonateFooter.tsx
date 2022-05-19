import Icon from '@esolidar/toolkit/build/elements/icon';
import Button from '@esolidar/toolkit/build/elements/button';

interface Props {
  onClickDonate(): void;
  onClickShare(): void;
}

const DonateFooter = ({ onClickDonate, onClickShare }: Props) => (
  <div className="donate-footer">
    <Button
      extraClass="primary-full"
      text="Donate cUSD"
      onClick={onClickDonate}
      size="lg"
      fullWidth
    />
    <Button
      className="donate-footer__share--text"
      extraClass="secondary"
      text="Share"
      onClick={onClickShare}
      size="lg"
      iconLeft={<Icon name="Share3" />}
      fullWidth
    />
    <Button
      className="donate-footer__share--icon"
      extraClass="secondary"
      onClick={onClickShare}
      size="lg"
      type="icon"
      icon={<Icon name="Share3" />}
      fullWidth
    />
  </div>
);

export default DonateFooter;
