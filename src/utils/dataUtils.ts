import { SetterOrUpdater } from 'recoil';
import { WineData } from './makeTree';

export function toggleSelection(
  currentSelection: Set<WineData>,
  newSelection: Set<WineData>,
  setSelection: SetterOrUpdater<Set<WineData>>
) {
  // selection에 포함되지 않은 newSelection
  const notSelected = newSelection.difference(currentSelection);
  if (notSelected.size) {
    // 그룹 목록 중 하나라도 선택되지 않았다면 모두 추가
    const newValue = currentSelection.union(newSelection);
    setSelection(newValue);
  } else {
    // 모두 선택된 상태이면 해당 그룹의 항목을 제거
    const newValue = currentSelection.difference(newSelection);
    if (newValue.size !== currentSelection.size) {
      setSelection(newValue);
    }
  }
}
