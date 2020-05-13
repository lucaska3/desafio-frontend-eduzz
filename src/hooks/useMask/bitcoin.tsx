import padStart from 'lodash/padStart';

import { IMaskFunction } from '.';

const bitcoin: IMaskFunction = {
  apply: (value: number | string, minDigits = 5, maxDigits = 20) => {
    if (value === null || value === undefined || value === '') return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'XBT',
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maxDigits
    })
      .format(Number(value) || 0)
      .replace(/\b(\w*XBT\w*)\b/, '₿');
  },
  clean: value => {
    value = (value || '').toString().replace(/[^\d,]/gi, '');

    if (!value.includes(',')) {
      value = '0,' + padStart(value, 5, '0');
    }

    const [, cents] = value.split(',');
    if (cents && cents.length !== 5) {
      value = value
        .replace(',', '')
        .replace(/(\d+)?(\d{5})/gi, '$1,$2,$3,$4,$5')
        .replace(/^,/gi, '0,');
    }

    return parseFloat(value.replace(/\./gi, '').replace(',', '.'));
  }
};

export default bitcoin;
