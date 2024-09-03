import { useTheme } from '@emotion/react';
import { Checkbox, Theme } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { lighten } from '@mui/system';
import { useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { searchTextAtom, wineSelectionAtom, wineSelectionSelector } from '../../../recoil/search';
import { wineCsvDataSelector } from '../../../recoil/wineData';
import { toggleSelection } from '../../../utils/dataUtils';
import { CheckedIcon, GroupHeader, GroupItems, Icon } from './style';

export default function RenderGroup() {
  const {
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
      options={data}
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
        console.log({ params });
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
      // ListboxComponent={(props) => {
        
      // }}
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
              icon={<Icon />}
              checkedIcon={<CheckedIcon />}
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
    const newSelection = new Set(data.filter((val) => val.group === group));
    toggleSelection(selection, newSelection, setSelection);
  };

  return {
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
