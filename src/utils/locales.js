/* eslint-disable global-require */
import { SUPPORTED_LOCALES } from '../constants/locales';

const getLocaleTranslations = lang => {
  switch (lang) {
    case SUPPORTED_LOCALES.BR:
      return Object.assign(
        require('@esolidar/i18n/projects/toolkit/br'),
        require('@esolidar/i18n/projects/web3/br')
      );
    case SUPPORTED_LOCALES.EN:
      return Object.assign(
        require('@esolidar/i18n/projects/toolkit/en'),
        require('@esolidar/i18n/projects/web3/en')
      );
    case SUPPORTED_LOCALES.PT:
      return Object.assign(
        require('@esolidar/i18n/projects/toolkit/pt'),
        require('@esolidar/i18n/projects/web3/pt')
      );
    default:
  }
  return true;
};
export default getLocaleTranslations;
