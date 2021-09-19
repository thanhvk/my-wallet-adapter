import styled from 'styled-components';
import { Divider, Typography } from 'antd';

const { Text } = Typography;

export const TextSmall = styled(Text)`
  font-size: 12px;
`

export const DividerStyled = styled(Divider)`
  margin: 12px 0;
`

// BalanceItem component
export const JsonWrapper = styled.div`
  overflow: auto;
`;

export const TokenWrapper = styled.div`
  margin-bottom: 7px;
  border-radius: 5px;
  background-color: #f2f2f2;
`

export const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  cursor: pointer;
`

export const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  min-width: 30%;
`

export const TokenValue = styled.div`
  min-width: 30%;
`

export const TokenDetails = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 10px 15px;
`

// SendToken component
export const SplPanel = styled.div`
  margin-bottom: 7px;
  border-radius: 5px;
  background-color: #f2f2f2;
`

export const SplPanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  cursor: pointer;
`

export const SplPanelContent = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 10px 15px;
`

export const TokenOptionContent = styled.div`
  display: inline-flex;
  gap: 7px;
  align-items: center;
`