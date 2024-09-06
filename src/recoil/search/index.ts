import { atom, atomFamily, DefaultValue, selector, selectorFamily } from 'recoil';
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

export const groupIds = atom({
  key: 'groupIds',
  default: new Set<string>(),
});

// 그룹의 하위 리스트 상태를 기반으로 그룹의 체크박스 상태를 결정하는 selectorFamily
export const groupCheckboxState = selectorFamily({
  key: 'groupCheckboxState',
  get:
    (group) =>
    ({ get }) =>
      get(groupState(group)),
  set:
    (group: string) =>
    ({ set, reset }, newValue) => {
      if (newValue instanceof DefaultValue) {
        reset(groupState(group));
        set(groupIds, (prev) => prev.difference(new Set([group])));
      }
      set(groupState(group), newValue);
      set(groupIds, (prev) => new Set([...prev, group]));
    },
});
