import React, { useMemo, createRef } from 'react';
import { Form, Input, Button, Select, Space } from 'antd';
import { SendOutlined, DollarCircleOutlined } from '@ant-design/icons';

import { useSolanaTokens } from '../../providers/general';
import { formatNumber, abbr } from '../../utils';
import { TokenOptionContent } from './styles';

const { Option } = Select;

const SendToken = ({ accounts }) =>  {
  const solanaTokens = useSolanaTokens();
  const accountsWithBalance = useMemo(() => accounts.filter(account => account.token.tokenAmount.uiAmount > 0), [accounts])
  const formRef = createRef();

  const onTokenChange = (token) => {
    console.log(token, 'token change====================');
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

  return (
    <>
      <div>Send SPL token</div>
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
              accountsWithBalance.map((account, idx) => {
                const tokenInfo = solanaTokens[account.token.address]

                return (
                  <Option value={account.token.address} key={idx}>
                    <TokenOptionContent>
                      {tokenInfo && <img src={tokenInfo.logoURI} height={25} width={25} alt="" />}
                      {!tokenInfo && <DollarCircleOutlined style={{fontSize: "25px", color: "rgba(0, 0, 0, 0.2)"}} />}
                      {tokenInfo ? tokenInfo.name : abbr(account.token.address)}
                      <span>
                        ({formatNumber(account.token.tokenAmount.uiAmount)} {tokenInfo && tokenInfo.symbol})
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
    </>
  );
};

export default SendToken;