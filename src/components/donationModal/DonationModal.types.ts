export interface Form {
  amount: number | null;
  errors: any;
}

export interface ModalBodyProps {
  balance: number;
  form: Form;
  shortcuts?: Array<string | number>;
  onChangeForm(e: any): void;
  onClickShortcut(e: any): void;
}

interface Props extends ModalBodyProps {
  openModal: boolean;
  isAllowCusdLoading: boolean;
  doneAllowCusdLoading: boolean;
  isDonateLoading: boolean;
  nonProfitName: string;
  allowCusdError: string;
  onCloseModal(): void;
  onclickDonate(form: Form): void;
  onClickAllowCusd(): void;
}

export default Props;
