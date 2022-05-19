export interface Form {
  amount: number | string | null;
  errors: any;
}

export interface ModalBodyProps {
  balance: number | undefined;
  form: Form;
  shortcuts?: Array<string | number>;
  onChangeForm(e: any): void;
  onClickShortcut(e: any): void;
}

interface Props {
  balance: number | undefined;
  openModal: boolean;
  nonProfitName: string;
  onCloseModal(): void;
  onclickDonate(form: Form): Promise<any>;
}

export default Props;
