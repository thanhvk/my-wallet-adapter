import React, { useMemo, useCallback, useState } from 'react';
import { Form, Input, Button, Select, Space, Divider, Typography, message } from 'antd';
import { DollarCircleOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Transaction, PublicKey, TransactionInstruction, SYSVAR_RENT_PUBKEY, SystemProgram } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import BigNumber from 'bignumber.js';
import { TokenInstructions } from '@project-serum/serum';

import { useSolanaTokens } from '../../providers/general';
import { formatNumber, abbr } from '../../utils';
import { TokenOptionContent, SplPanel, SplPanelHeader, SplPanelContent } from './styles';
import { ASSOCIATED_TOKEN_PROGRAM_ID } from '../../constants';

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
      message.success(`Success send at slot ${result.context.slot}`);
    } catch (error) {
      console.log(error)
      message.error('Error');
    }
  }, [connection, publicKey, sendTransaction])

  // Send SPL token
  const [form] = Form.useForm();
  const [showSplTokenForm, setShowSplTokenForm] = useState(true)

  // const handleSenTokenFormValuesChange = async (values) => {
  //   try {
  //     const validateFields = await form.validateFields()
  //     console.log(validateFields, 'get validateFields ==============================')
  //   } catch (error) {
  //     console.log(error && error.errorFields, 'errors ===========================');
  //   }
  // }

  const getOrCreateAssociatedTokenAddress = async (
    desOwnerAddress, // public key
    tokenMintAddress // public key
  ) => {
    const associatedTokenAddress = await PublicKey.findProgramAddress(
      [
        desOwnerAddress.toBuffer(),
        TokenInstructions.TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    const associatedAccountInfo = await connection.getAccountInfo(
      associatedTokenAddress[0],
    );

    if (associatedAccountInfo) return associatedTokenAddress[0]

    return await createAssociatedTokenAccountInternal(
      tokenMintAddress,
      desOwnerAddress,
      associatedTokenAddress[0],
    );
  }

  function createAssociatedTokenAccountInstruction(
    mint, // PublicKey,
    associatedAccount, // PublicKey,
    owner, // PublicKey,
    payer, // PublicKey,
  ) {
    const data = Buffer.alloc(0);

    let keys = [
      {pubkey: payer, isSigner: true, isWritable: true},
      {pubkey: associatedAccount, isSigner: false, isWritable: true},
      {pubkey: owner, isSigner: false, isWritable: false},
      {pubkey: mint, isSigner: false, isWritable: false},
      {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
      {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
      {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
    ];

    return new TransactionInstruction({
      keys,
      programId: ASSOCIATED_TOKEN_PROGRAM_ID,
      data,
    });
  }

  async function createAssociatedTokenAccountInternal(
    tokenAddress,
    owner, // PublicKey
    associatedAddress, // PublicKey
  ) {
    const transaction = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        tokenAddress, // token public key
        associatedAddress,
        owner,
        publicKey, // payer
      ),
    )

    await sendTransaction(
      transaction,
      connection
    );

    return associatedAddress;
  }

  const sendSplToken = async (
    fromTokenAddress,
    desTokenAddress,
    amount, // include decimals
  ) => {
    // Add token transfer instructions to transaction
    const transaction = new Transaction().add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        fromTokenAddress,
        desTokenAddress,
        publicKey,
        [],
        amount,
      ),
    );
  
    return await sendTransaction(transaction, connection);
  }

  const onSendSplToken = async (values) => {
    try {
      const { tokenAddress, amount, destination } = values;

      const desOwnerAddress = new PublicKey(destination);
      const tokenMintAddress = new PublicKey(tokenAddress); // mint address
      const amountToken = BigNumber(amount).times(10**tokens[tokenAddress].token.tokenAmount.decimals).toNumber();

      const desTokenAddress = await getOrCreateAssociatedTokenAddress(desOwnerAddress, tokenMintAddress)
      const fromTokenAddress = tokens[tokenAddress].account.address

      const signature = await sendSplToken(
        fromTokenAddress, 
        desTokenAddress.toBase58(), 
        amountToken
      )
      const result = await connection.confirmTransaction(signature, 'processed');
      message.success(`Success send at slot ${result.context.slot}`);
    } catch (error) {
      console.log(error, '==================================');
      message.error('Error');
    }
  }

  return (
    <SplPanel>
      <SplPanelHeader onClick={() => setShowSplTokenForm(!showSplTokenForm)}>
        <Text strong>Send SPL token</Text>
        <CaretRightOutlined rotate={showSplTokenForm ? 90 : 0} style={{ color: "rgba(0, 0, 0, 0.4)"}} />
      </SplPanelHeader>
      
      {showSplTokenForm && (
        <SplPanelContent>
          <Form 
            layout="vertical"
            form={form}
            size="large"
            name="sendToken"
            // validate form and set validte value
            // onValuesChange={handleSenTokenFormValuesChange}
            // sen spl token
            onFinish={onSendSplToken}
          >
            <Form.Item
              name="tokenAddress"
              label="Token"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Select a token"
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
                <Space>Send</Space>
              </Button>
            </Form.Item>
          </Form>
        </SplPanelContent>
      )}
    </SplPanel>
  );
};

export default SendToken;