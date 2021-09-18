import React, { useEffect, useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import ReactJson from 'react-json-view';
import styled from 'styled-components';
import { Row, Col, Divider, Space, Typography } from 'antd';
import { CaretRightOutlined, DollarCircleOutlined } from '@ant-design/icons';

import { TOKEN_PROGRAM_ID } from './constants';
import { useSolanaTokens } from './general';
import { abbr } from './utils';
import { AddressExternalLink } from './common';

const { Text } = Typography

const JsonWrapper = styled.div`
  overflow: auto;
`;

const TokenWrapper = styled.div`
  margin-bottom: 7px;
  border-radius: 5px;
  background-color: #f2f2f2;
`

const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  cursor: pointer;
`

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
`

const TokenDetails = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0 15px 10px;
`

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
  }
}

const BalanceItem = ({ acc }) => {
  const solanaTokens = useSolanaTokens();
  const [showDetails, setShowDetails] = useState(false);
  const { account, token } = parseAssociatedAccount(acc);

  console.log(solanaTokens);

  return (
    <TokenWrapper>
      <TokenHeader onClick={() => setShowDetails(!showDetails)}>
        <div>
          <TokenInfo>
            <div style={{marginRight: '10px'}}>
              {solanaTokens[token.address] && <img src={solanaTokens[token.address].logoURI} width={40} height={40}/>}
              {!solanaTokens[token.address] && <DollarCircleOutlined style={{fontSize: "40px"}} />}
            </div>
            <div>
              <AddressExternalLink type="token" address={token.address}>
                <div>
                  <Text strong>{solanaTokens[token.address] ? solanaTokens[token.address].name : abbr(token.address)}</Text>
                </div>
                <div>
                  <Space>
                    {token.tokenAmount.uiAmount}
                    {solanaTokens[token.address] && solanaTokens[token.address].symbol}
                  </Space>
                </div>
              </AddressExternalLink>
            </div>
          </TokenInfo>
        </div>
        <CaretRightOutlined rotate={showDetails ? 90 : 0} />
      </TokenHeader>

      {showDetails && (
        <TokenDetails>
          <Row>
            <Col span={12}>
              <div>Associated Token Account</div>
              <div>pubkey: <AddressExternalLink address={account.address}>{account.address}</AddressExternalLink></div>
              <div>owner: <AddressExternalLink address={account.owner}>{account.owner}</AddressExternalLink></div>
              <div>lamports: {account.lamports}</div>
              <Divider />
              <div>SPL Token</div>
              <div>mint: <AddressExternalLink type="token" address={token.address}>{token.address}</AddressExternalLink></div>
              <div>owner: <AddressExternalLink address={token.owner}>{token.owner}</AddressExternalLink></div>
              <div>uiAmount: {token.tokenAmount.uiAmount}</div>
            </Col>
            <Col span={12}>
              <JsonWrapper>
                <ReactJson src={acc} collapsed={true} />
              </JsonWrapper>
            </Col>
          </Row>
        </TokenDetails>
      )}
    </TokenWrapper>
  )
}

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
    getAssociatedAccounts(publicKey);
  }, [getAssociatedAccounts, publicKey])

  if (associatedAccounts.length === 0) return null;

  return (
    <>
      <div>{associatedAccounts.length} tokens</div>
      {associatedAccounts.map((acc, idx) => <BalanceItem key={idx} acc={acc} />)}
    </>
  );
};

export default Balances;