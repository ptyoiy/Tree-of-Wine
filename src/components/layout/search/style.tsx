/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
  AutocompleteRenderGroupParams,
  Checkbox,
  darken,
  lighten,
  styled,
  Theme,
} from '@mui/material';
import { memo, MouseEvent, ReactElement, useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { groupCheckboxState } from '../../../recoil/search';
import { Tree, WineData } from '../../../utils/makeTree';

export const GroupHeader = styled('div')(({ theme }: { theme: Theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  zIndex: 999,
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

export const GroupItems = styled('ul')({
  padding: 0,
});
export const Icon = memo(() => <CheckBoxOutlineBlankIcon fontSize="small" />);
export const CheckedIcon = memo(() => <CheckBoxIcon fontSize="small" />);

type RenderGroupProps = {
  params: AutocompleteRenderGroupParams;
  keyBoundaries: number[];
  searchText: string;
  theme: Theme;
  handleGroupSelect: (group: ReactElement[], region: string) => "checked" | "indeterminate" | undefined;
};

export function RenderGroup({
  params,
  searchText,
  keyBoundaries,
  theme,
  handleGroupSelect,
}: RenderGroupProps) {
  const { group, key, children } = params;
  const [country, region] = useMemo(() => group.split(','), [group]);
  const showCountryHeader = useMemo(() => keyBoundaries.includes(+key), []);

  const [isOpen, setIsOpen] = useState(false);
  const [checked, setCheck] = useRecoilState(groupCheckboxState(region));
  const handleGroupHeaderClick = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const handleGroupHeaderContextMenu = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      const state = handleGroupSelect(children as ReactElement[], region);
      setCheck(state);
    },
    [handleGroupSelect]
  );
  const handleCheckBoxClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      const state = handleGroupSelect(children as ReactElement[], region);
      setCheck(state);
    },
    [handleGroupSelect]
  );

  useLayoutEffect(() => {
    searchText && setIsOpen(true);
  }, [searchText]);

  return (
    <li>
      {showCountryHeader && (
        <GroupHeader
          sx={{ color: 'white', backgroundColor: lighten(theme.palette.primary.dark, 0.3) }}
          theme={theme}
        >
          {country}
        </GroupHeader>
      )}
      <GroupHeader
        theme={theme}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: lighten(theme.palette.primary.light, 0.5),
          },
        }}
        onClick={handleGroupHeaderClick}
        onContextMenu={handleGroupHeaderContextMenu}
      >
        <Checkbox
          onClick={handleCheckBoxClick}
          checked={checked === 'checked'}
          indeterminate={checked === 'indeterminate'}
        />
        {region}
      </GroupHeader>
      {isOpen && <GroupItems>{children}</GroupItems>}
    </li>
  );
}

export type RenderOptionProps = {
  props: React.HTMLAttributes<HTMLLIElement> & {
    key: any;
  };
  selection: Set<WineData>;
  groupData: Tree;
  option: WineData;
  searchText: string;
  selected: boolean;
};

export function RenderOption({
  props,
  selection,
  groupData,
  option,
  searchText,
  selected,
}: RenderOptionProps) {
  const [groupState, setGroupState] = useRecoilState(groupCheckboxState(option.Region));
  // 검색어 하이라이팅을 위한 텍스트 분할 및 하이라이팅
  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const highlighted = text.replace(regex, (match) => `<mark>${match}</mark>`);

    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { key, id, onClick, ...optionProps } = props;
  const handleClick = (event: MouseEvent<HTMLLIElement>) => {
    onClick!(event);
    let value: 'checked' | 'indeterminate' | undefined;
    if (groupState === 'checked' || groupState === undefined) {
      value = 'indeterminate';
    } else {
      const groupSet = new Set(groupData.children);
      const diffSize = groupSet.difference(selection).size;
      if (selected) {
        value = groupSet.size - diffSize == 1 ? undefined : 'indeterminate';
      } else {
        const isAllChecked = diffSize == 1;
        value = isAllChecked ? 'checked' : 'indeterminate';
      }
    }
    setGroupState(value);
  };
  const text = highlightText(option.Designation, searchText);
  return (
    <li key={id} onClick={handleClick} {...optionProps}>
      <Checkbox
        icon={<Icon />}
        checkedIcon={<CheckedIcon />}
        style={{ marginRight: 8 }}
        checked={selected}
      />
      {text}
    </li>
  );
}
