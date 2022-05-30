export interface Form {
  amount: number | string | null;
  errors: any;
}

export interface ModalBodyProps {
  balance: number | null | undefined;
  form: Form;
  shortcuts?: Array<string | number>;
  isDonateLoading: boolean;
  onChangeForm(e: any): void;
  onClickShortcut(e: any): void;
}

interface Props {
  balance: number | null | undefined;
  openModal: boolean;
  nonProfitName: string;
  onCloseModal(): void;
  onclickDonate(form: Form): Promise<any>;
}

export default Props;
