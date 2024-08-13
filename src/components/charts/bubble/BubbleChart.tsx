import { MutableRefObject, useEffect, useRef } from 'react';
import { WineData } from '../../../utils/makeTree';
import { Tooltip, useTooltip } from '../../layout/tooltip';
import { renderBubbleChart, renderCirclePacking } from './render';

type BubbleChartProps = {
  data: WineData[];
  columns: (keyof WineData)[];
};

export default function BubbleChart(props: BubbleChartProps) {
  const {
    svgRef,
    tooltipVisible,
    tooltipCoords: { x, y },
    tooltipContent,
  } = useRenderChart(props);
  return (
    <>
      <svg ref={svgRef}></svg>
      <Tooltip content={tooltipContent} visible={tooltipVisible} x={x} y={y} />
    </>
  );
}

function useRenderChart({ data, columns }: BubbleChartProps) {
  const svgRef = useRef<SVGSVGElement>() as MutableRefObject<SVGSVGElement>;
  const { tooltipVisible, tooltipCoords, tooltipContent, onMouseOver, onMouseOut } = useTooltip();
  useEffect(() => {
    renderBubbleChart(svgRef, data, columns, onMouseOver, onMouseOut);
    // renderCirclePacking(svgRef, data, columns, onMouseOver, onMouseOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return { svgRef, tooltipVisible, tooltipCoords, tooltipContent };
}
