export interface Form {
  amount: number | string | null;
  errors: any;
}

export interface ModalBodyProps {
  balance: number;
  form: Form;
  shortcuts?: Array<string | number>;
  onChangeForm(e: any): void;
  onClickShortcut(e: any): void;
}

interface Props {
  balance: number;
  openModal: boolean;
  isDonateLoading?: boolean;
  nonProfitName: string;
  onCloseModal(): void;
  onclickDonate(form: Form): void;
}

export default Props;
