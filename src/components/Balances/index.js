import React, { useEffect, useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { TOKEN_PROGRAM_ID } from '../../constants';
import BalanceItem from './BalanceItem';

const Balances = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [associatedAccounts, setAssociatedAccounts] = useState([]);

  const getAssociatedAccounts = useCallback(async (pubkey) => {
    if (!pubkey) return;

    try {
      const result = await connection.getParsedTokenAccountsByOwner(pubkey, { programId: TOKEN_PROGRAM_ID });
      setAssociatedAccounts(result.value);
    } catch (error) {
      console.log(error);
      setAssociatedAccounts([]);
    }
  }, [connection])

  useEffect(() => {
    if (!publicKey) return setAssociatedAccounts([]);

    getAssociatedAccounts(publicKey);
  }, [getAssociatedAccounts, publicKey])

  if (!publicKey || (associatedAccounts.length === 0)) return null;

  return (
    <>
      <div>{associatedAccounts.length} tokens</div>
      {associatedAccounts.map((acc, idx) => <BalanceItem key={idx} acc={acc} />)}
    </>
  );
};

export default Balances;