import { selector } from 'recoil';
import { WineData } from '../../utils/makeTree';
import { wineSelectionSelector } from '../search';

export type Rows = Pick<WineData, 'Country' | 'Region'> & { id: string };

export const wineSelectionTableSelector = selector({
  key: 'wineSelectionTableSelector',
  get: ({ get }) => {
    const selection = get(wineSelectionSelector).map(
      ({ Country, Region, Designation }): Rows => ({
        Country,
        Region,
        id: Designation,
      })
    );
    
    console.log('selection table selector', selection);
    return selection;
  },
});
