import { atom, atomFamily, selector, selectorFamily } from 'recoil';
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

// 각 그룹의 체크박스 상태를 저장하는 atomFamily
export const groupState = atomFamily({
  key: 'groupState',
  default: undefined as 'checked' | 'indeterminate' | undefined,
});

// 그룹의 하위 리스트 상태를 기반으로 그룹의 체크박스 상태를 결정하는 selectorFamily
export const groupCheckboxState = selectorFamily({
  key: 'groupCheckboxState',
  get:
    (parent) =>
    ({ get }) => {
      const state = get(groupState(parent));
      return state;
    },
  set:
    (parent) =>
    ({ set }, newValue) => {
      set(groupState(parent), newValue);
    },
});
