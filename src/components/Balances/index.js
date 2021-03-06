import React, { useEffect, useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SyncOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { TOKEN_PROGRAM_ID } from '../../constants';
import BalanceItem from './BalanceItem';
import { Divider } from 'antd';
import SendToken from './SendToken';
import { BalanceHeader } from './styles';

const parseAssociatedAccount = (acc) => {
  const account = {
    address: acc.pubkey.toBase58(), 
    owner: acc.account.owner.toBase58(),
    lamports: acc.account.lamports
  }

  const token = {
    address: acc.account.data.parsed.info.mint,
    owner: acc.account.data.parsed.info.owner,
    tokenAmount: acc.account.data.parsed.info.tokenAmount,
  }

  return {
    account,
    token,
    json: acc,
  }
}

const BalanceList = ({ accounts }) => {
  return accounts.map((acc, idx) => <BalanceItem key={idx} acc={acc} />);
};

const Balances = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [refresh, setRefresh] = useState(false);
  const [associatedAccounts, setAssociatedAccounts] = useState([]);

  const getAssociatedAccounts = useCallback(async (pubkey) => {
    try {
      const { value } = await connection.getParsedTokenAccountsByOwner(pubkey, { programId: TOKEN_PROGRAM_ID });
      const parsedAccounts = value.map(account => parseAssociatedAccount(account));

      setAssociatedAccounts(parsedAccounts);
    } catch (error) {
      console.log(error);
      setAssociatedAccounts([]);
    }

    setRefresh(false)
  }, [connection])

  useEffect(() => {
    if (!publicKey) return setAssociatedAccounts([]);

    getAssociatedAccounts(publicKey);
  }, [getAssociatedAccounts, publicKey, refresh])

  if (!publicKey || (associatedAccounts.length === 0)) return null;

  return (
    <>
      <SendToken accounts={associatedAccounts} />
      <Divider />
      <BalanceHeader>
        <div>{associatedAccounts.length} tokens</div>
        <Button size="large" onClick={() => setRefresh(true)}><SyncOutlined spin={refresh} /> Refresh</Button>
      </BalanceHeader>
      <BalanceList accounts={associatedAccounts} />
    </>
  );
};

export default Balances;