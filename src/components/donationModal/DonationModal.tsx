/* eslint-disable no-use-before-define */
import React, { FC, useState } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import classnames from 'classnames';
import CustomModal from '@esolidar/toolkit/build/elements/customModal';
import Button from '@esolidar/toolkit/build/elements/button';
import Icon from '@esolidar/toolkit/build/elements/icon';
import TextFieldNumber from '@esolidar/toolkit/build/elements/textFieldNumber';
import Props, { ModalBodyProps, Form } from './DonationModal.types';

const DEFAULT_FORM: Form = {
  amount: null,
  errors: null,
};

const DonationModal: FC<Props> = ({
  openModal,
  balance,
  isAllowCusdLoading = false,
  doneAllowCusdLoading = false,
  isDonateLoading = false,
  nonProfitName,
  allowCusdError,
  onCloseModal,
  onclickDonate,
  onClickAllowCusd,
}: Props) => {
  const [form, setForm] = useState<Form>(DEFAULT_FORM);

  const intl: IntlShape = useIntl();

  const handleChangeForm = ({ value }: any) => {
    let newValue: any = value + 0;
    if (balance < value) {
      newValue = balance;
    }
    const newForm: Form = { ...form };
    newForm.amount = newValue;
    setForm(newForm);
  };

  return (
    <CustomModal
      show={openModal}
      onHide={onCloseModal}
      size="md"
      title={intl.formatMessage({ id: 'web3.donateModal.to' }, { nonProfitName })}
      dialogClassName="donationModal"
      backdrop="static"
      bodyChildren={
        <ModalBody
          balance={balance}
          form={form}
          onChangeForm={handleChangeForm}
          onClickShortcut={handleChangeForm}
        />
      }
      actionsChildren={
        <>
          <Button
            className={classnames('donationModal__button-disabled', {
              isLoadind: isAllowCusdLoading,
            })}
            extraClass={classnames({ 'primary-full': !doneAllowCusdLoading })}
            size="md"
            text={intl.formatMessage({ id: 'web3.donateModal.allow.cusd' })}
            onClick={() => onClickAllowCusd}
            withLoading
            isLoading={isAllowCusdLoading}
            disabled={!form.amount || doneAllowCusdLoading}
            type={doneAllowCusdLoading && 'icon'}
            icon={doneAllowCusdLoading && <Icon name="CheckCircle" />}
            fullWidth
          />
          <span className="donationModal__error">{allowCusdError}</span>
          <Button
            className={classnames('donationModal__button-disabled', { isLoadind: isDonateLoading })}
            extraClass={classnames({
              'primary-full': (form.amount && doneAllowCusdLoading) || isDonateLoading,
            })}
            size="md"
            text={intl.formatMessage({ id: 'web3.donate' })}
            onClick={() => onclickDonate(form)}
            withLoading
            isLoading={isDonateLoading}
            disabled={!form.amount || !doneAllowCusdLoading}
            fullWidth
          />
        </>
      }
    />
  );
};

export default DonationModal;

const ModalBody: FC<ModalBodyProps> = ({
  balance,
  form = DEFAULT_FORM,
  shortcuts = [25, 50, 150, 500],
  onChangeForm,
  onClickShortcut,
}: ModalBodyProps) => {
  const intl: IntlShape = useIntl();

  const { amount, errors } = form;

  return (
    <div className="donationModal__body">
      <div className="donationModal__subtitle">
        {intl.formatMessage({ id: 'web3.donateModal.subtitle' })}
      </div>
      <div className="donationModal__balance">
        <div className="donationModal__balance-coin">
          <Button className="cusd-icon" icon={<Icon name="AtSign" />} type="icon" theme="light" />
          <span>cUSD balance</span>
        </div>
        <div className="donationModal__balance-value">{balance} cUSD</div>
      </div>
      <div className="donationModal__amount">
        <TextFieldNumber
          field="amount"
          id="amount"
          suffix=" cUSD"
          thousandSeparator
          label={intl.formatMessage({ id: 'web3.donateModal.amount' })}
          decimalScale={2}
          placeholder="0.00 cUSD"
          value={amount}
          onChange={() => onChangeForm}
          error={errors?.amount || errors?.balance}
          dataTestId="amount"
        />
      </div>
      <div className="donationModal__shortcuts">
        <span>{intl.formatMessage({ id: 'web3.donateModal.shortcuts' })}</span>
        <div className="donationModal__shortcuts-list">
          {shortcuts.map(val => (
            <Button
              onClick={() => onClickShortcut({ value: val })}
              className={classnames('donationModal__shortcuts-item', { active: amount === val })}
              text={
                <div>
                  {val} <span>cUSD</span>
                </div>
              }
              ghost
              theme="light"
              key={val}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
