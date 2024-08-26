// src/recoil/wineData.ts
import Papa from 'papaparse';
import { selector } from 'recoil';
import { makeTree, Tree, WineData } from '../../utils/makeTree';

export const columns: (keyof WineData)[] = ['Country', 'Region', 'Designation'];

// CSV 데이터를 비동기로 가져오는 selector 정의
export const wineCsvDataSelector = selector<WineData[]>({
  key: 'wineCsvDataSelector',
  get: async () => {
    try {
      const response = await fetch('./test_data.csv');
      const reader = response.body?.getReader();
      const result = await reader?.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result?.value);
      const parsedData = Papa.parse<WineData>(csv, { header: true }).data;

      return parsedData;
    } catch (e) {
      console.error('Failed to fetch CSV data', e);
      return [];
    }
  },
});

export const treeDataSelector = selector<WineData | Tree>({
  key: 'treeDataSelector',
  get: ({ get }) => {
    const csvData = get(wineCsvDataSelector);
    const treeData = makeTree(csvData, ...columns);

    return treeData;
  },
});
