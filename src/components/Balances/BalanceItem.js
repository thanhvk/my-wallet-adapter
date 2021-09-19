import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { Row, Col, Space, Typography } from 'antd';
import { 
  CaretRightOutlined,
  DollarCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import BigNumber from 'bignumber.js';

import { useSolanaTokens } from '../../providers/general';
import { abbr, toSol, formatNumber } from '../../utils';
import { AddressExternalLink } from '../common';
import { useCoinGecko } from '../../hooks/coingecko';
import {
  TextSmall,
  DividerStyled,
  JsonWrapper,
  TokenWrapper,
  TokenHeader,
  TokenInfo,
  TokenValue,
  TokenDetails,
} from './styles';

const { Text } = Typography

const BalanceItem = ({ acc }) => {
  const solanaTokens = useSolanaTokens();
  const [showDetails, setShowDetails] = useState(false);
  const { account, token } = acc;
  let tokenInfo = solanaTokens[token.address] ? { ...solanaTokens[token.address], ...token } : token;
  const priceInfo = useCoinGecko(tokenInfo.extensions && tokenInfo.extensions.coingeckoId)
  tokenInfo = { ...tokenInfo, ...priceInfo }

  console.log(tokenInfo);

  return (
    <TokenWrapper>
      <TokenHeader onClick={() => setShowDetails(!showDetails)}>
        <TokenInfo>
          <div style={{marginRight: '10px'}}>
            {solanaTokens[token.address] && <img src={solanaTokens[token.address].logoURI} alt="" width={40} height={40}/>}
            {!solanaTokens[token.address] && <DollarCircleOutlined style={{fontSize: "40px", color: "rgba(0, 0, 0, 0.2)"}} />}
          </div>
          <div>
            <AddressExternalLink type="token" address={token.address}>
              <div>
                <Text strong>{solanaTokens[token.address] ? solanaTokens[token.address].name : abbr(token.address)}</Text>
              </div>
              <div>
                <Space>
                  {formatNumber(token.tokenAmount.uiAmount)}
                  {solanaTokens[token.address] && solanaTokens[token.address].symbol}
                </Space>
              </div>
            </AddressExternalLink>
          </div>
        </TokenInfo>

        <TokenValue>
          {tokenInfo.priceInfo && (
            <>
              <div><Text strong>${formatNumber(BigNumber(token.tokenAmount.uiAmount).times(tokenInfo.priceInfo.price).toNumber(), 2)}</Text></div>
              <div>
                <Space>
                  <Text type="secondary">${tokenInfo.priceInfo.price}</Text>

                  {(tokenInfo.priceInfo.price_change_percentage_24h > 0) && 
                    <TextSmall type="success">(<ArrowUpOutlined /> {formatNumber(tokenInfo.priceInfo.price_change_percentage_24h, 1)}%)</TextSmall>
                  }

                  {(tokenInfo.priceInfo.price_change_percentage_24h < 0) && 
                    <TextSmall type="danger">(<ArrowDownOutlined /> {formatNumber(tokenInfo.priceInfo.price_change_percentage_24h, 1)}%)</TextSmall>
                  }

                  {(tokenInfo.priceInfo.price_change_percentage_24h === 0) && 
                    <TextSmall type="secondary">({formatNumber(tokenInfo.priceInfo.price_change_percentage_24h, 1)}%)</TextSmall>
                  }
                </Space>
              </div>
            </>
          )}
        </TokenValue>

        <CaretRightOutlined rotate={showDetails ? 90 : 0} style={{ color: "rgba(0, 0, 0, 0.4)"}} />
      </TokenHeader>

      {showDetails && (
        <TokenDetails>
          <Row>
            <Col span={12}>
              <div><Text strong>Associated Token Account</Text></div>
              <div>pubkey: <AddressExternalLink address={account.address}>{account.address}</AddressExternalLink></div>
              <div>owner: <AddressExternalLink address={account.owner}>{account.owner}</AddressExternalLink></div>
              <div>lamports: {toSol(account.lamports)}</div>
              <DividerStyled />
              <div><Text strong>SPL Token</Text></div>
              <div>mint: <AddressExternalLink type="token" address={token.address}>{token.address}</AddressExternalLink></div>
              <div>owner: <AddressExternalLink address={token.owner}>{token.owner}</AddressExternalLink></div>
              <div>uiAmount: {formatNumber(token.tokenAmount.uiAmount)}</div>
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

export default BalanceItem;