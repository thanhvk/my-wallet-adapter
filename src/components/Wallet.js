import React from 'react';
import { Space } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-ant-design';
import { useWallet } from '@solana/wallet-adapter-react';

import { AddressExternalLink } from './common';
import { abbr } from '../utils';

const Wallet = () => {
    const { publicKey } = useWallet();

    return (
        <WalletModalProvider>
            <Space>
                {!publicKey && <WalletMultiButton />}
                {publicKey && (
                    <>
                        <AddressExternalLink address={publicKey.toBase58()}>
                            <Space>
                                <WalletOutlined />
                                {abbr(publicKey.toBase58())}
                            </Space>
                        </AddressExternalLink>
                        <WalletDisconnectButton />
                    </>
                )}
            </Space>
        </WalletModalProvider>
    );
};

export default Wallet;
