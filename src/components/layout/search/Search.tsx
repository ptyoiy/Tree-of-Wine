import { useTheme } from '@emotion/react';
import { Theme } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { HierarchyNode } from 'd3';
import { ReactElement, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { searchTextAtom, wineSelectionAtom, wineSelectionSelector } from '../../../recoil/search';
import { treeDataSelector, wineCsvDataSelector } from '../../../recoil/wineData';
import { Tree } from '../../../utils/makeTree';
import { RenderGroup, RenderOption, RenderOptionProps } from './style';

export default function Search() {
  const {
    tree,
    theme,
    selection,
    selectionArray,
    setSelection,
    data,
    keyBoundaries,
    handleGroupSelect,
    searchText,
    setSearchText,
  } = useSearch();
  return (
    <Autocomplete
      id="grouped-demo"
      sx={{ width: '100%', padding: '8px 0' }}
      value={selectionArray}
      inputValue={searchText}
      options={data}
      groupBy={(option) => option.group}
      getOptionLabel={(option) => option.values}
      disableCloseOnSelect
      multiple
      fullWidth
      onChange={(_event, value) => {
        setSelection(new Set(value));
      }}
      onClose={() => {
        setSearchText('');
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={selection.size ? `Selected ${selection.size} items` : 'Search'}
          InputProps={{ ...params.InputProps, startAdornment: null }}
          onChange={(event) => {
            console.log('onchange');
            setSearchText(event.target.value);
          }}
        />
      )}
      renderGroup={(params) => (
        <RenderGroup
          key={params.key}
          searchText={searchText}
          handleGroupSelect={handleGroupSelect}
          keyBoundaries={keyBoundaries}
          params={params}
          theme={theme}
        />
      )}
      renderOption={(props, option, { selected }) => {
        const findGroup = tree.find((node) => (node.data as Tree).name == option.Region)!
          .data as Tree;
        return (
          <RenderOption
            key={props.key}
            groupData={findGroup}
            selection={selection}
            props={props}
            option={option}
            selected={selected}
            searchText={searchText}
          />
        );
      }}
    />
  );
}

function useSearch() {
  const data = useRecoilValue(wineCsvDataSelector);
  const tree = useRecoilValue(treeDataSelector);
  const selectionArray = useRecoilValue(wineSelectionSelector);
  const [selection, setSelection] = useRecoilState(wineSelectionAtom);
  const [searchText, setSearchText] = useRecoilState(searchTextAtom);
  const theme = useTheme() as Theme;

  const keyBoundaries = useMemo(() => {
    return Object.values(Object.groupBy(data, (item) => item.Country)).reduce(
      (acc, val, idx, arr) => {
        if (idx < arr.length - 1) {
          acc.push(acc[idx] + val!.length);
        }
        return acc;
      },
      [0] as number[]
    );
  }, [data]);

  /**
   * @param group react children
   * @returns {"checked" | "indeterminate" | undefined} 
   ** checked: 전부 선택
   ** indeterminate: 일부 선택
   ** undefined: 선택 안됨
   */
  const handleGroupSelect = (group: ReactElement<RenderOptionProps>[], region: string) => {
    const currentGroup = group.map((child) => child.props.option);
    const groupData = (tree as HierarchyNode<Tree>).find((node) => node.data.name === region)?.data
      .children;
    const groupDataSet = new Set(groupData);
    const newSelection = new Set(currentGroup);
    const alreadySelected = newSelection.difference(selection);
    const isUnion = alreadySelected.size;
    const nextSelection = selection[isUnion ? 'union' : 'difference'](newSelection);
    setSelection(nextSelection);
    const intersectionSize = nextSelection.intersection(groupDataSet).size;
    if (intersectionSize == groupDataSet.size) return 'checked';
    if (intersectionSize) return 'indeterminate';
    return undefined;
  };

  return {
    tree,
    theme,
    searchText,
    setSearchText,
    selection,
    selectionArray,
    setSelection,
    data,
    keyBoundaries,
    handleGroupSelect,
  };
}
