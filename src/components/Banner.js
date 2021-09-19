import styled from 'styled-components';

import solanaLogo from '../assets/images/solana_no_radius.png'
import videoBg from '../assets/images/galaxy_2.mp4'

const BannerWrapper = styled.div`
  height: 700px;
  background-color: #f2f2f2;
  border-radius: 5px;
  position: relative;
  margin: 25px 0;
  overflow: hidden;
`

const BannerTitle = styled.h1`
  font-size: 38px;
  font-family: 'Raleway', sans-serif;
  font-weight: 800;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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

function Banner() {

  return (
    <BannerWrapper>
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
    </BannerWrapper>
  );
}

export default Banner;
