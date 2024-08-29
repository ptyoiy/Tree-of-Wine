import { atom, selector } from 'recoil';
import { WineData } from '../../utils/makeTree';

export const wineSelectionAtom = atom<Set<WineData>>({
  key: 'wineSelectionAtom',
  default: new Set(),
});

export const wineSelectionSelector = selector({
  key: 'wineSelectionSelector',
  get: ({ get }) => {
    const selectionSet = get(wineSelectionAtom);
    return [...selectionSet];
  },
});

export const searchTextAtom = atom<string>({
  key: 'searchTextAtom',
  default: '',
});
