import { useTheme } from '@emotion/react';
import { Checkbox, Theme } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { lighten } from '@mui/system';
import { useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { searchTextAtom, wineSelectionAtom, wineSelectionSelector } from '../../../recoil/search';
import { wineCsvDataSelector } from '../../../recoil/wineData';
import { checkedIcon, GroupHeader, GroupItems, icon } from './style';

export default function RenderGroup() {
  const {
    theme,
    selection,
    selectionArray,
    setSelection,
    options,
    keyBoundaries,
    handleGroupSelect,
    searchText,
    setSearchText,
  } = useSearch();
  return (
    <Autocomplete
      id="grouped-demo"
      options={options}
      groupBy={(option) => option.group}
      getOptionLabel={(option) => option.values}
      isOptionEqualToValue={(option, value) => option.values === value.values}
      sx={{ width: '100%', padding: '8px 0' }}
      disableCloseOnSelect
      multiple
      fullWidth
      value={selectionArray}
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
          onChange={(event) => setSearchText(event.target.value)}
        />
      )}
      renderGroup={(params) => {
        const [country, region] = params.group.split(',');
        return (
          <li key={params.key}>
            {keyBoundaries.includes(+params.key) && (
              <GroupHeader theme={theme}>{country}</GroupHeader>
            )}
            <GroupHeader
              theme={theme}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: lighten(theme.palette.primary.light, 0.5),
                },
              }}
              onClick={() => handleGroupSelect(params.group)}
            >
              {region}
            </GroupHeader>
            <GroupItems>{params.children}</GroupItems>
          </li>
        );
      }}
      renderOption={(props, option, { selected }) => {
        // 검색어 하이라이팅을 위한 텍스트 분할 및 하이라이팅
        const highlightText = (text: string, query: string) => {
          if (!query) return text;

          const regex = new RegExp(`(${query})`, 'gi');
          const highlighted = text.replace(regex, (match) => `<mark>${match}</mark>`);

          return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { key, id, ...optionProps } = props;
        const text = highlightText(option.Designation, searchText);
        return (
          <li key={id} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {text}
          </li>
        );
      }}
    />
  );
}

function useSearch() {
  const data = useRecoilValue(wineCsvDataSelector);
  const theme = useTheme() as Theme;
  const [selection, setSelection] = useRecoilState(wineSelectionAtom);
  const selectionArray = useRecoilValue(wineSelectionSelector);
  const [searchText, setSearchText] = useRecoilState(searchTextAtom);

  const options = useMemo(() => {
    const options = data.map((d) => ({
      ...d,
      group: `${d.Country},${d.Region}`,
      values: Object.values(d).join(''),
    }));
    options.sort((a, b) => {
      const countryComparison = a.Country.localeCompare(b.Country);
      return countryComparison !== 0 ? countryComparison : a.Region.localeCompare(b.Region);
    });
    return options;
  }, [data]);

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

  const handleGroupSelect = (group: string) => {
    // group에 포함된 모든 데이터
    const newSelection = new Set(options.filter((val) => val.group === group));
    // selection에 포함되지 않은 newSelection
    const notSelected = newSelection.difference(selection);
    if (notSelected.size) {
      // 그룹 목록 중 하나라도 선택되지 않았다면 모두 추가
      const newValue = selection.union(newSelection);
      setSelection(newValue);
    } else {
      // 모두 선택된 상태이면 해당 그룹의 항목을 제거
      const newValue = selection.difference(newSelection);
      if (newValue.size !== selection.size) {
        setSelection(newValue);
      }
    }
  };

  return {
    theme,
    searchText,
    setSearchText,
    selection,
    selectionArray,
    setSelection,
    options,
    keyBoundaries,
    handleGroupSelect,
  };
}
