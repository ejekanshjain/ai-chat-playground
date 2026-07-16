export const formatCurrency = (
  currencyCode: string,
  num: number | string,
  precision = 2
) => {
  const numCopy = Number(num)

  switch (currencyCode) {
    case 'INR':
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        signDisplay: 'negative'
      }).format(numCopy)
    case 'USD':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        signDisplay: 'negative'
      }).format(numCopy)
    default:
      console.warn(
        `Unsupported currency: ${currencyCode}. Defaulting to fixed format.`
      )
      return numCopy.toFixed(precision)
  }
}
