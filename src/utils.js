import BigNumber from 'bignumber.js'

export const abbr = (str, num=6, symbol='...') => {
  if (!str || (typeof str !== 'string')) return ''

  return `${str.slice(0, num)}${symbol}${str.slice(-num)}`
}

export function toSol(amount, decimals = 9) {
  if (!amount) return amount

  return BigNumber(amount).div(10**decimals).toNumber()
}

export function formatNumber(number, precision = 9) {
  if (!number) return number

  let formated =  BigNumber(number).toFormat(precision)

  if (formated.match(/\.[0]+$/g)) {
    formated = formated.replace(/\.[0]+$/g, '')
  }

  if (formated.match(/\.\d+[0]+$/g)) {
    formated = formated.replace(/[0]+$/g, '')
  }

  return formated
}