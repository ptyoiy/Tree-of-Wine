import { Tree, WineData } from '../../../utils/makeTree';
import { RadialDendrogram } from '../../charts/TreeOfWine';
import { Chart } from '../../charts/wrapper';

type MainSectionProps = {
  data: WineData | Tree;
};

export default function MainSection({ data }: MainSectionProps) {
  const chartProps = {
    data,
    fontSize: 11,
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
