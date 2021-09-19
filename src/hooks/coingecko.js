import { useState, useEffect } from "react";
import * as CoinGecko from "coingecko-api";

const PRICE_REFRESH = 10000;

const CoinGeckoClient = new CoinGecko();

export function useCoinGecko(coinId) {
  const [priceInfo, setPriceInfo] = useState({});
  
  useEffect(() => {
    let interval;
    if (coinId) {
      const getCoinInfo = () => {
        CoinGeckoClient.coins
          .fetch(coinId)
          .then((info) => {
            setPriceInfo({
              priceInfo: {
                price: info.data.market_data.current_price.usd,
                volume_24: info.data.market_data.total_volume.usd,
                market_cap: info.data.market_data.market_cap.usd,
                market_cap_rank: info.data.market_data.market_cap_rank,
                price_change_percentage_24h:
                  info.data.market_data.price_change_percentage_24h,
                last_updated: new Date(info.data.last_updated),
              },
              status: 'success',
            });
          })
          .catch((error) => {
            setPriceInfo({
              status: 'failed',
            });
          });
      };

      getCoinInfo();
      interval = setInterval(() => {
        getCoinInfo();
      }, PRICE_REFRESH);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [setPriceInfo, coinId]);

  return priceInfo;
}
