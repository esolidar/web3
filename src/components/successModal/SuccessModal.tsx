/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
import React, { FC, useState } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import CustomModal from '@esolidar/toolkit/build/elements/customModal';
import Button from '@esolidar/toolkit/build/elements/button';
import Icon from '@esolidar/toolkit/build/elements/icon';
import truncateAddress from '../../utils/truncateAddress';
import Props, { ModalBodyProps } from './SuccessModal.types';
import openCeloTransaction from '../../utils/openCeloTransaction';
import useToast from '../../hooks/useToast/useToast';
import LINKS from '../../constants/links';

const SuccessModal: FC<Props> = ({
  transactionID,
  nonProfitName,
  openModal,
  onCloseModal,
  shareProps,
}: Props) => {
  const intl: IntlShape = useIntl();

  return (
    <CustomModal
      show={openModal}
      onHide={onCloseModal}
      size="md"
      title={intl.formatMessage({ id: 'web3.thankYou' })}
      dialogClassName="successModal"
      backdrop="static"
      showFooter={false}
      bodyChildren={
        <ModalBody {...shareProps} transactionID={transactionID} nonProfitName={nonProfitName} />
      }
    />
  );
};

export default SuccessModal;

const ModalBody: FC<ModalBodyProps> = ({
  transactionID,
  nonProfitName,
  title = '',
  showFacebook = true,
  showTwitter = true,
  showLinkedin = true,
  showEmail = true,
  showWhatsapp = true,
  showCopyToClipboard = true,
  windowLocationHref,
}: ModalBodyProps) => {
  const [openModalInfo, setOpenModalInfo] = useState<boolean>(false);

  const intl: IntlShape = useIntl();
  const toast = useToast();

  const fbShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?display=popup&u=${windowLocationHref}&quote=${title}`;
    const options =
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,left=660,top=190,width=600,height=600';
    window.open(url, 'sharer', options);
  };

  const handleClickCopyToClipboard = () => {
    navigator.clipboard.writeText(windowLocationHref);
    toast.success(intl.formatMessage({ id: 'web3.copied' }));
  };

  return (
    <div className="successModal__body">
      <div className="successModal__subtitle">
        {intl.formatMessage(
          {
            id: 'web3.successModal.subtitle',
          },
          { nonProfitName }
        )}
      </div>
      <div className="successModal__transition">
        <div className="successModal__transition-title">
          {intl.formatMessage({
            id: 'web3.successModal.transition.id',
          })}
        </div>
        <div className="successModal__transition-id">
          <span
            onClick={() => openCeloTransaction(transactionID)}
            onKeyDown={() => openCeloTransaction(transactionID)}
            role="presentation"
          >
            {truncateAddress(transactionID, 6)}
          </span>
          <span className="successModal__transition-icon">
            <Icon
              name="InfoBold"
              size="sm"
              onClick={() => {
                setOpenModalInfo(true);
              }}
            />
          </span>
        </div>
      </div>
      <div className="successModal__separator" />
      <div className="successModal__share">
        <div className="successModal__share-title">
          {intl.formatMessage({
            id: 'web3.successModal.share.title',
          })}
        </div>
        <span className="successModal__share-subtitle">
          {intl.formatMessage({
            id: 'web3.successModal.share.subtitle',
          })}
        </span>
        <div className="successModal__share-icons">
          <ul>
            {showFacebook && (
              <li>
                <a
                  onClick={fbShare}
                  title="Facebook"
                  data-testid="share-facebook"
                  role="presentation"
                >
                  <Button
                    className="share-icon share-facebook"
                    icon={<Icon name="Facebook" />}
                    type="icon"
                    theme="light"
                  />
                  <span>Facebook</span>
                </a>
              </li>
            )}
            {showLinkedin && (
              <li>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${windowLocationHref}&title=${title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="linkedin"
                  title="Linkedin"
                  data-testid="share-linkedin"
                >
                  <Button
                    className="share-icon share-linkedin"
                    icon={<Icon name="Linkedin" />}
                    type="icon"
                    theme="light"
                  />
                  <span>Linkedin</span>
                </a>
              </li>
            )}
            {showCopyToClipboard && (
              <li>
                <a
                  onClick={handleClickCopyToClipboard}
                  title="copyToClipboard"
                  data-testid="share-copyToClipboard"
                  role="presentation"
                >
                  <Button
                    className="share-icon share-Link"
                    icon={<Icon name="Link" />}
                    type="icon"
                    theme="light"
                  />
                  <span>
                    {intl.formatMessage({
                      id: 'web3.successModal.copy.link',
                    })}
                  </span>
                </a>
              </li>
            )}
          </ul>
          <ul>
            {showTwitter && (
              <li>
                <a
                  href={`https://twitter.com/intent/tweet?text=${title}&url=${windowLocationHref}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="twitter"
                  title="Twitter"
                  data-testid="share-twitter"
                >
                  <Button
                    className="share-icon share-twitter"
                    icon={<Icon name="Twitter" />}
                    type="icon"
                    theme="light"
                  />
                  <span>Twitter</span>
                </a>
              </li>
            )}
            {showWhatsapp && (
              <li>
                <a
                  href={`https://api.whatsapp.com/send?text=${title} ${windowLocationHref}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-action="share/whatsapp/share"
                  title="Whatsapp"
                  data-testid="share-whatsapp"
                >
                  <Button
                    className="share-icon share-whatsapp"
                    icon={<Icon name="Whatsapp" />}
                    type="icon"
                    theme="light"
                  />
                  <span>WhatsApp</span>
                </a>
              </li>
            )}
            {showEmail && (
              <li>
                <a
                  href={`mailto:?subject=${title}&body=${windowLocationHref}`}
                  title="Email"
                  data-testid="share-email"
                >
                  <Button
                    className="share-icon share-email"
                    icon={<Icon name="Email" />}
                    type="icon"
                    theme="light"
                  />
                  <span>Email</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <CustomModal
        show={openModalInfo}
        onHide={() => setOpenModalInfo(false)}
        size="md"
        title={intl.formatMessage({
          id: 'web3.successModal.transition.id',
        })}
        dialogClassName="sdg-description"
        backdrop="static"
        showFooter={false}
        bodyChildren={
          <>
            <p>
              {intl.formatMessage({
                id: 'web3.successModal.blockchain.text',
              })}
            </p>
            <Button
              className="popover-btn m-0 p-0"
              extraClass="link"
              href={LINKS.blockchainTransactions}
              target="_blank"
              text={intl.formatMessage({ id: 'learn.more' })}
              size="sm"
            />
          </>
        }
      />
    </div>
  );
};
