import * as crypto from 'crypto';
import { Race } from '../interfaces';

const NUM = '0123456789';

export function createIdNumber() {
  const rnd = crypto.randomBytes(11);
  const value = new Array(11);
  const charsLength = NUM.length;

  for (let i = 0; i < value.length; i++) {
    if (i === 5) {
      value[5] = '-';
    } else {
      value[i] = NUM[rnd[i] % charsLength];
    }
  }

  return value.join('');
}

export function calculateRegistrationSummary(
  raceIds: string[],
  races: Race[],
  isdraRaceFee: number,
  trailFee: number
) {
  const selectedRaces = races.filter(race => raceIds.includes(race.id));
  const subtotal = selectedRaces.reduce(
    (acc, currRace) => acc + currRace.price,
    0
  );
  const isdraFee = selectedRaces.reduce((acc, currRace) => {
    if (currRace.isdraFee) {
      acc + isdraRaceFee;
    }
    return acc;
  }, 0);
  const total = subtotal + isdraFee + trailFee;
  return { subtotal, trailFee, isdraFee, total };
}

export function formatPhoneNumber(input: string) {
  const digits = removeNonDigits(input);
  const digitsArray = digits.split('');
  return digitsArray
    .map((v, i) => {
      if (i === 0) return `(${v}`;
      if (i === 2) return `${v}) `;
      if (i === 5) return `${v}-`;
      return v;
    })
    .join('');
}

export function formatToMoney(input: number, includeDecimal = false) {
  const price = input / 100;

  if (includeDecimal) {
    return `$${price.toFixed(2)}`;
  } else {
    return `$${price}`;
  }
}

export function getUrlParam(param: string | string[] | undefined) {
  if (!param) return '';
  return Array.isArray(param) ? param[0] : param;
}

export function includeISDRAfee(raceIds: string[], races: Race[] | undefined) {
  if (!races) return;
  return raceIds.some(id =>
    races.some(race => race.id === id && race.isdraFee)
  );
}

export function removeNonDigits(input: string) {
  return input.replace(/\D/g, '');
}
