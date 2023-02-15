import _ from 'lodash';
import moment from 'moment';

export const addYears = (dateString, length, format = 'YYYY-MM-DD') => {
  return moment(dateString, format).add(length, 'years');
};

export const formatRupiah = (number, toFixed = 0) => {
  if (number) {
    let div = 1000;
    number = Number(number);
    while (number / div >= 1) {
      div *= 1000;
    }
    div /= 1000;
    return `${formatSeparator(Number(number / div), toFixed)} ${getRupiahSuffix(div)}`;
  }

  return '0';
};
export const addMonths = (dateString, length, format = 'YYYY-MM-DD') => {
  return moment(dateString, format).add(length, 'months');
};

export const formatSeparator = (number, fixed = 0) => {
  if (number === undefined || _.isEmpty(String(number))) return '0';
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: fixed
  }).format(Number(number || '0').toFixed(fixed));
};

export const getRupiahSuffix = div => {
  switch (div) {
    case 1000:
      return 'Ribu';
    case 1000000:
      return 'Juta';
    case 1000000000:
      return 'Miliar';
    case 1000000000000:
      return 'Triliun';
    case 1000000000000000:
      return 'Kuadriliun';

    default:
      return '';
  }
};