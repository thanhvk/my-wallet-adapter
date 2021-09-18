export const AddressExternalLink = ({ children, type='account', address }) => {
  return (
    <a target="_blank" rel="noreferrer" href={`https://solscan.io/${type}/${address}`}>
      {children}
    </a>
  )
}