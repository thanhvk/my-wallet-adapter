import React from 'react';
import { Space } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-ant-design';
import { useWallet } from '@solana/wallet-adapter-react';

const Wallet = () => {
    const { publicKey } = useWallet();

    return (
        <WalletModalProvider>
            <Space>
                {!publicKey && <WalletMultiButton />}
                {publicKey && (
                    <>
                        <a target="_blank" rel="noreferrer" href={`https://solscan.io/account/${publicKey.toBase58()}`}>
                            <WalletOutlined />
                            {publicKey.toBase58().slice(0, 6) + "..." + publicKey.toBase58().slice(-6)}
                        </a>
                        <WalletDisconnectButton />
                    </>
                )}
            </Space>
        </WalletModalProvider>
    );
};

export default Wallet;
