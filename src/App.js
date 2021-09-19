import styled from 'styled-components';
import './App.less';
import Wallet from './Wallet';
import { SendOneLamportToRandomAddress } from './SendLamports';
import Balances from './Balances';
import { Divider } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';

import experiment2 from './assets/images/experiment_2.mp4'

const Layout = styled.div`
  max-width: 1200px;
  padding: 0 30px;
  margin: auto;
`

const Main = styled.main``

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
`

const MainBanner = styled.div`
  height: 500px;
  background-color: #f2f2f2;
  border-radius: 5px;
  position: relative;
  margin: 25px 0;
  overflow: hidden;
`

const MainTitle = styled.h1`
  color: #fff;
  font-size: 32px;
  margin: 10%;
  position: absolute;
`

const VideoStyled = styled.video`
  object-fit: cover;
`

function App() {
  const { publicKey } = useWallet();

  return (
    <Layout className="App">
      <Header>
        <Wallet />
      </Header>

      {!publicKey && (
        <MainBanner>
          <MainTitle>Experiment with Wallet Adapter</MainTitle>

          <VideoStyled autoPlay muted loop width="100%" height={500}>
              <source src={experiment2} type="video/webm" />
              <source src={experiment2} type="video/mp4" />
              Sorry, your browser doesn't support embedded videos.
          </VideoStyled>
        </MainBanner>
      )}

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
