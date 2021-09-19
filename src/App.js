import styled from 'styled-components';
import './App.less';
import Wallet from './Wallet';
import { SendOneLamportToRandomAddress } from './SendLamports';
import Balances from './Balances';
import { Divider } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';

import solanaLogo from './assets/images/solana_no_radius.png'
import videoBg from './assets/images/galaxy_2.mp4'

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

const Banner = styled.div`
  height: 700px;
  background-color: #f2f2f2;
  border-radius: 5px;
  position: relative;
  margin: 25px 0;
  overflow: hidden;
`

const BannerTitle = styled.h1`
  font-size: 32px;
  font-family: 'Raleway', sans-serif;
  color: #fff;
  background: linear-gradient(to right,#7846de 0%,#1890ff 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
  margin: 10%;
  position: absolute;
`

const SolLogoWrapper = styled.div`
  display: flex;
  align-items: center;
`

const SolLogo = styled.img`
  width: ${({ size }) => size ? size : '40px'};
  height: ${({ size }) => size ? size : '40px'};
  margin-right: 8px;
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
        <Banner>
          <BannerTitle>
            <SolLogoWrapper>
              <SolLogo src={solanaLogo} alt="solana" size="30px" />
              <span>Solana Summer</span>
            </SolLogoWrapper>

            <span>Experiment with Wallet Adapter</span>
          </BannerTitle>

          <VideoStyled autoPlay muted loop width="100%" height={700}>
            <source src={videoBg} type="video/webm" />
            <source src={videoBg} type="video/mp4" />
            Sorry, your browser doesn't support embedded videos.
          </VideoStyled>
        </Banner>
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
