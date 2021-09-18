export const abbr = (str, num=6, symbol='...') => {
  if (!str || (typeof str !== 'string')) return ''
  
  return `${str.slice(0, num)}${symbol}${str.slice(-num)}`
}