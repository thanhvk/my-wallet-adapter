import React from 'react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-ant-design';

const Wallet = () => {
    return (
        <WalletModalProvider>
            <WalletMultiButton />
            <WalletDisconnectButton />
        </WalletModalProvider>
    );
};

export default Wallet;
