import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import React, { useCallback, useMemo } from 'react';
import { Button, message } from 'antd';

export const SendOneLamportToRandomAddress = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    //alts bag
    const toPubkey = useMemo(() => new PublicKey('3dbd7m8wzZ5Gej7b3cTPEN46q8cYGsbYv7G5VufwE64A'), [])

    const onClick = useCallback(async () => {
      try {
        if (!publicKey) throw new WalletNotConnectedError();

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey,
                lamports: 1,
            })
        );

        const signature = await sendTransaction(transaction, connection);

        const result = await connection.confirmTransaction(signature, 'processed');
        message.success(`Success send at slot ${result.context.slot}`);
      } catch (error) {
        console.log(error)
        message.error('Error');
      }
    }, [publicKey, toPubkey, sendTransaction, connection]);

    return (
        <Button size="large" type="primary" onClick={onClick} disabled={!publicKey}>
            Send 1 lamport from this account to&nbsp;
            {toPubkey && <>{toPubkey.toBase58().slice(0, 6) + "..." + toPubkey.toBase58().slice(-6)}</>}!
        </Button>
    );
};
