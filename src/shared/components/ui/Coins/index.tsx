import { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import {
  coinsSliceGet,
  setSelectedCoin,
} from '../../../../app/slices/coinsSlice';
import { store } from '../../../../app/store';
import { useAppSelector } from '../../../../app/hooks';

export const Coins = () => {
  const dataCoins = useAppSelector((state) => state.coins.coins);
  const selectedCoin = useAppSelector((state) => state.coins.selectedCoin);

  useEffect(() => {
    store.dispatch(coinsSliceGet()).unwrap();
    const savedCoin = localStorage.getItem('selectedCoin');
    if (savedCoin) {
      store.dispatch(setSelectedCoin(JSON.parse(savedCoin)));
    }
  }, []);

  const handleSelectCoin = (coinId: string) => {
    const selectedCoin = dataCoins?.find((coin) => coin._id === coinId);
    if (selectedCoin) {
      store.dispatch(setSelectedCoin(selectedCoin));
      localStorage.setItem('selectedCoin', JSON.stringify(selectedCoin));
    }
  };

  return (
    <Select onValueChange={handleSelectCoin} value={selectedCoin?._id || ''}>
      <SelectTrigger id="customer-type">
        <SelectValue placeholder="Seleccionar una moneda">
          {selectedCoin
            ? `${selectedCoin.nombre} (${selectedCoin.simbolo})`
            : ''}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="font-onest">
        {dataCoins?.map((coin) => (
          <SelectItem key={coin._id} value={coin._id}>
            {coin.nombre} ({coin.simbolo})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
