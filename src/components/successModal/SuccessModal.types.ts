interface shareProps {
  title: string;
  showFacebook?: boolean;
  showTwitter?: boolean;
  showLinkedin?: boolean;
  showEmail?: boolean;
  showWhatsapp?: boolean;
  showCopyToClipboard?: boolean;
  windowLocationHref: string;
}

export interface ModalBodyProps extends shareProps {
  transactionID: string;
  nonProfitName: string;
}

interface Props {
  transactionID: string;
  nonProfitName: string;
  shareProps: shareProps;
  openModal: boolean;
  onCloseModal(): void;
}

export default Props;
