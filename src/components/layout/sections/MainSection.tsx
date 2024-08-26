import { useRecoilValue } from 'recoil';
import { treeDataSelector } from '../../../recoil/wineData';
import { RadialDendrogram } from '../../charts/TreeOfWine';
import { Chart } from '../../charts/wrapper';

export default function MainSection() {
  const data = useRecoilValue(treeDataSelector);
  const chartProps = {
    fontSize: 11,
    data
  };
  return (
    <Chart
      elevation={5}
      sx={{
        display: 'grid',
        gridTemplateRows: '10% auto',
        gridTemplateColumns: '90% auto',
        width: '60%',
        overflow: 'hidden',
      }}
      render={RadialDendrogram}
      chartProps={chartProps}
    />
  );
}
