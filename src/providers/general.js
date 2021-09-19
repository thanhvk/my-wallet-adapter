import React, { useContext, useCallback, useEffect, useState } from 'react'
import axios from 'axios'

const GeneralContext = React.createContext(null)

export function GeneralProvider({ children }) {
  const [solanaTokens, setSolanaTokens] = useState({})

  const getSolanaTokens = useCallback(async () => {
    try {
      const response = await axios.get('https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json')
      const tokens = response.data.tokens.reduce((acc, curr) => {
        if (!acc[curr['address']] && curr.chainId === 101) {
          return {
            ...acc,
            [curr['address']]: curr
          }
        }

        return acc
      }, {})

      setSolanaTokens(tokens)
    } catch (error) {
      
    }
  }, [])

  useEffect(() => {
    getSolanaTokens()
  }, [getSolanaTokens])

  return (
    <GeneralContext.Provider value={{ solanaTokens }}>
      {children}
    </GeneralContext.Provider>
  );
}

export function useSolanaTokens() {
  let context = useContext(GeneralContext);

  if (!context) {
    throw new Error('Missing connection context');
  }
  return context.solanaTokens;
}