import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { WineData } from './makeTree';

export function useWineDataCsv() {
  const [data, setData] = useState<WineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCsv = async () => {
      try {
        const response = await fetch('./test_data.csv'); // public 폴더에 있는 CSV 파일
        const reader = response.body?.getReader();
        const result = await reader?.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result?.value);
        const parsedData = parseCsv(csv);
        setData(parsedData);
        setIsLoading(false);
      } catch (e) {
        throw { e };
      }
    };

    const parseCsv = (text: string) => {
      const result = Papa.parse<WineData>(text, { header: true });
      return result.data;
    };
    fetchCsv();
  }, []);

  return { data, isLoading };
}
