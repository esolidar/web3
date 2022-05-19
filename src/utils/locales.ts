/* eslint-disable global-require */
import { SUPPORTED_LOCALES } from '../constants/locales';

const getLocaleTranslations = (lang: string) => {
  switch (lang) {
    case SUPPORTED_LOCALES.BR.id:
      return Object.assign(
        require('@esolidar/i18n/projects/toolkit/br'),
        require('@esolidar/i18n/projects/web3/br')
      );
    case SUPPORTED_LOCALES.EN.id:
      return Object.assign(
        require('@esolidar/i18n/projects/toolkit/en'),
        require('@esolidar/i18n/projects/web3/en')
      );
    case SUPPORTED_LOCALES.PT.id:
      return Object.assign(
        require('@esolidar/i18n/projects/toolkit/pt'),
        require('@esolidar/i18n/projects/web3/pt')
      );
    default:
  }
  return true;
};
export default getLocaleTranslations;
