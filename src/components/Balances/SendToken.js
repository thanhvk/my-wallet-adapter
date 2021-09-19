import React, { useMemo, createRef, useCallback, useState } from 'react';
import { Form, Input, Button, Select, Space, Divider, Typography } from 'antd';
import { SendOutlined, DollarCircleOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Transaction } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import BigNumber from 'bignumber.js';

import { useSolanaTokens } from '../../providers/general';
import { formatNumber, abbr } from '../../utils';
import { TokenOptionContent, SplPanel, SplPanelHeader, SplPanelContent } from './styles';

const { Option } = Select;
const { Text } = Typography

const SendToken = ({ accounts }) =>  {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const solanaTokens = useSolanaTokens();

  let tokens = useMemo(() => accounts.filter(account => account.token.tokenAmount.uiAmount > 0), [accounts])

  tokens = tokens.reduce((acc, curr) => {
    curr.token = solanaTokens[curr.token.address] ? { ...solanaTokens[curr.token.address], ...curr.token} : { ...curr.token };

    acc = {
      ...acc,
      [curr.token.address]: curr,
    };

    return acc;
  }, {})

  const formRef = createRef();

  const onTokenChange = (tokenAddress) => {
    console.log(tokenAddress, 'token change====================');
  };

  const onFinish = (values) => {
    console.log(values);
  };

  // const onReset = () => {
  //   formRef.current.resetFields();
  // };

  // const onFill = () => {
  //   formRef.current.setFieldsValue({
  //     note: 'Hello world!',
  //     gender: 'male',
  //   });
  // };

  const onSendSunnyToken = useCallback(async () => {
    try {
      // Add token transfer instructions to transaction
      const transaction = new Transaction().add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          // sunny token account of alts bag wallet
          '9v9goAW5T2DPr2i52eH31Gq3b1Y3W8HBPh87D69LhR5R',
          // sunny token account of cm wallet
          'GAbxE7hWggMThNRXqD6EzVw61qQ5enJuTtLRhszdZ8u3',
          publicKey,
          [],
          BigNumber(1).times(10**6).toNumber(),
        ),
      );
    
      const signature = await sendTransaction(transaction, connection);
      const result = await connection.confirmTransaction(signature, 'processed');
    } catch (error) {
      console.log(error)
    }
  })

  const [showSplTokenForm, setShowSplTokenForm] = useState(false)

  return (
    <>
      {(publicKey.toBase58() === '3dbd7m8wzZ5Gej7b3cTPEN46q8cYGsbYv7G5VufwE64A') &&
        <>
          <Button size="large" type="primary" htmlType="submit" onClick={onSendSunnyToken}>
            <Space>Send 1 SUNNY from alts to cm wallet</Space>
          </Button>

          <Divider />
        </>
      }

      <SplPanel>
        <SplPanelHeader onClick={() => setShowSplTokenForm(!showSplTokenForm)}>
          <Text strong>Send SPL token</Text>
          <CaretRightOutlined rotate={showSplTokenForm ? 90 : 0} style={{ color: "rgba(0, 0, 0, 0.4)"}} />
        </SplPanelHeader>
        
        {showSplTokenForm && (
          <SplPanelContent>
            <Form 
              layout="vertical" 
              ref={formRef} 
              size="large"
              name="sendToken" 
              onFinish={onFinish}
            >
              <Form.Item
                name="token"
                label="Token"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  placeholder="Select a token"
                  onChange={onTokenChange}
                  allowClear
                >
                  {
                    Object.values(tokens).map((token, idx) => {

                      return (
                        <Option value={token.token.address} key={idx}>
                          <TokenOptionContent>
                            {token.token.logoURI && <img src={token.token.logoURI} height={25} width={25} alt="" />}
                            {!token.token.logoURI && <DollarCircleOutlined style={{fontSize: "25px", color: "rgba(0, 0, 0, 0.2)"}} />}
                            {token.token.name ? token.token.name : abbr(token.token.address)}
                            <span>
                              ({formatNumber(token.token.tokenAmount.uiAmount)} {token.token.symbol})
                            </span>
                          </TokenOptionContent>
                        </Option>
                      );
                    })
                  }
                </Select>
              </Form.Item>

              <Form.Item
                name="amount"
                label="Amount"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="Amount" />
              </Form.Item>

              <Form.Item
                name="destination"
                label="Destination"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="Destination address" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  <Space>Send <SendOutlined /></Space>
                </Button>
              </Form.Item>
            </Form>
          </SplPanelContent>
        )}
      </SplPanel>
    </>
  );
};

export default SendToken;