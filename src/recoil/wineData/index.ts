// src/recoil/wineData.ts
import { hierarchy, HierarchyNode } from 'd3';
import Papa from 'papaparse';
import { selector } from 'recoil';
import { csvWineData, makeTree, Tree, WineData } from '../../utils/makeTree';

export const COLUMNS: (keyof WineData)[] = ['Country', 'Region', 'Designation'];

// CSV 데이터를 비동기로 가져오는 selector 정의
export const wineCsvDataSelector = selector<WineData[]>({
  key: 'wineCsvDataSelector',
  get: async () => {
    try {
      const response = await fetch('./expanded_data.csv');
      const reader = response.body?.getReader();
      const result = await reader?.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result?.value);
      const parsedData: WineData[] = Papa.parse<csvWineData>(csv, { header: true }).data.map(
        (d, i) => ({
          ...d,
          id: i.toString(),
          group: `${d.Country},${d.Region}`,
          values: Object.values(d).join(''),
        })
      );
      parsedData.sort((a, b) => {
        const countryComparison = a.Country.localeCompare(b.Country);
        return countryComparison !== 0 ? countryComparison : a.Region.localeCompare(b.Region);
      });
      return parsedData;
    } catch (e) {
      console.error('Failed to fetch CSV data', e);
      return [];
    }
  },
});

export const treeDataSelector = selector<HierarchyNode<WineData | Tree>>({
  key: 'treeDataSelector',
  get: ({ get }) => {
    const csvData = get(wineCsvDataSelector);
    const treeData = makeTree(csvData, ...COLUMNS);
    const hier = hierarchy(treeData);
    return hier;
  },
  dangerouslyAllowMutability: true,
});
