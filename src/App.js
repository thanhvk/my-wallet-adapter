import styled from 'styled-components';
import './App.less';
import Wallet from './Wallet';
import { SendOneLamportToRandomAddress } from './SendLamports';
import Balances from './Balances';

const Layout = styled.div`
  max-width: 1200px;
  padding: 0 30px;
  margin: auto;
`

const Main = styled.main``
const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
`

function App() {
  return (
    <Layout className="App">
      <Header>
        <Wallet />
      </Header>
      <Main>
        <SendOneLamportToRandomAddress />
        <Balances />
      </Main>
    </Layout>
  );
}

export default App;
