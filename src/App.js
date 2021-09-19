import styled from 'styled-components';
import './App.less';
import { Divider } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';

import Wallet from './components/Wallet';
import { SendOneLamportToRandomAddress } from './components/SendLamports';
import Balances from './components/Balances';
import Banner from './components/Banner';

const Layout = styled.div`
  max-width: 1200px;
  padding: 0 30px;
  margin: auto;
`

const Main = styled.main``

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  padding: 15px 0;
`

function App() {
  const { publicKey } = useWallet();

  return (
    <Layout className="App">
      <Header>
        <Wallet />
      </Header>

      {!publicKey && (<Banner />)}

      {publicKey && (
        <Main>
          <SendOneLamportToRandomAddress />
          <Divider />
          <Balances />
        </Main>
      )}
    </Layout>
  );
}

export default App;
