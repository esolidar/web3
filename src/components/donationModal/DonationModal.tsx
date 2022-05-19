/* eslint-disable no-use-before-define */
import React, { FC, useEffect, useState } from 'react';
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
  nonProfitName,
  onCloseModal,
  onclickDonate,
}: Props) => {
  const [form, setForm] = useState<Form>(DEFAULT_FORM);
  const [isDonateLoading, setIsDonateLoading] = useState<boolean>(false);

  const intl: IntlShape = useIntl();

  useEffect(() => {
    setIsDonateLoading(false);
    handleChangeForm({ value: null });
  }, [openModal]);

  useEffect(() => {
    if (balance === 0) {
      const newForm: Form = { ...form };
      newForm.errors = { amount: 'not enought balance or gas' };
      setForm(newForm);
    }
  }, [balance]);

  const handleChangeForm = ({ value }: any) => {
    let newValue: any = +value;
    if (value === '') newValue = null;
    if (balance && newValue >= +balance) {
      newValue = balance;
    }
    const newForm: Form = { ...form };
    newForm.amount = newValue;
    setForm(newForm);
  };

  const handleClickDonate = () => {
    setIsDonateLoading(true);
    onclickDonate(form).then((value: any) => {
      if (value) {
        setIsDonateLoading(false);
        handleChangeForm({ value: null });
      }
    });
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
          isDonateLoading={isDonateLoading}
        />
      }
      actionsChildren={
        <Button
          className={classnames('donationModal__button-disabled', { isLoadind: isDonateLoading })}
          extraClass={classnames({
            'primary-full': form.amount || isDonateLoading,
          })}
          size="md"
          text={intl.formatMessage({ id: 'web3.donate' })}
          onClick={handleClickDonate}
          withLoading
          isLoading={isDonateLoading}
          disabled={!form.amount || form.amount === 0}
          fullWidth
        />
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
  isDonateLoading,
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
          onChange={(e: any) => onChangeForm(e)}
          error={errors?.amount || errors?.balance}
          dataTestId="amount"
          allowNegative={false}
          disabled={isDonateLoading}
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
              disabled={isDonateLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
