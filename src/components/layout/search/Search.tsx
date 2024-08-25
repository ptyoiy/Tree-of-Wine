import { useTheme } from '@emotion/react';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Checkbox, Theme } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { darken, lighten, styled } from '@mui/system';
import { useMemo, useRef, useState } from 'react';
import { WineData } from '../../../utils/makeTree';

const GroupHeader = styled('div')(({ theme }: { theme: Theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  zIndex: 999,
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.mode === 'light'
    ? lighten(theme.palette.primary.light, 0.85)
    : darken(theme.palette.primary.main, 0.8),
}));
const GroupItems = styled('ul')({
  padding: 0,
});
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function RenderGroup({ data }: { data: WineData[] }) {
  const { theme, value, setValue, options, keyBoundaries, handleGroupSelect, searchTextRef } = useSearch(data);
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
      value={value}
      onChange={(_event, value) => {
        setValue(value);
      }}
      onClose={() => {
        searchTextRef.current = '';
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={value.length ? `Selected ${value.length} items` : "Search"}
          InputProps={{ ...params.InputProps, startAdornment: null }}
          onChange={(event) => searchTextRef.current = event.target.value}
        />
      )}
      renderGroup={(params) => {
        const [country, region] = params.group.split(',');
        return (
          <li key={params.key}>
            {keyBoundaries.includes(+params.key) && <GroupHeader theme={theme}>{country}</GroupHeader>}
            <GroupHeader theme={theme} sx={{
              cursor: 'pointer', '&:hover': {
                backgroundColor: lighten(theme.palette.primary.light, 0.5)
              }
            }} onClick={() => handleGroupSelect(params.group)} >{region}</GroupHeader>
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
        const text = highlightText(option.Designation, searchTextRef.current);
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

function useSearch(data: WineData[]) {
  const theme = useTheme() as Theme;
  const [value, setValue] = useState<(WineData & { group: string, values: string })[]>([]);
  const searchTextRef = useRef<string>('');
  const options = useMemo(() => {
    const options = data.map(d => ({
      ...d,
      group: `${d.Country},${d.Region}`,
      values: Object.values(d).join('')
    }));
    options.sort((a, b) => {
      const countryComparison = a.Country.localeCompare(b.Country);
      return countryComparison !== 0 ? countryComparison : a.Region.localeCompare(b.Region)
    });
    return options;
  }, [data]);
  const keyBoundaries = useMemo(() => {
    return Object.values(Object.groupBy(data, (item) => item.Country)).reduce((acc, val, idx, arr) => {
      if (idx < arr.length - 1) {
        acc.push(acc[idx] + val!.length);
      }
      return acc;
    }, [0] as number[])
  }, [data]);

  const handleGroupSelect = (group: string) => {
    const filtered = options.filter((val) => val.group === group);
    const valueSet = new Set(value);
    const allSelected = filtered.every((filter) => valueSet.has(filter));

    if (allSelected) {
      // 모두 선택된 상태이면 해당 그룹의 항목을 제거
      const newValue = value.filter((val) => !filtered.includes(val));
      if (newValue.length !== value.length) {
        setValue(newValue);
      }
    } else {
      // 하나라도 선택되지 않았다면 모두 추가
      const newValue = [...value, ...filtered];
      setValue(newValue);
    }
  }

  return { theme, searchTextRef, value, setValue, options, keyBoundaries, handleGroupSelect }
}