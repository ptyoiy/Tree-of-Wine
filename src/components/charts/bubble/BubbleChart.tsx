import { MutableRefObject, useEffect, useRef } from 'react';
import { Tree } from '../../../utils/makeTree';
import { Tooltip, useTooltip } from '../../layout/tooltip';
import { renderBubbleChart } from './render';

type BubbleChartProps = {
  data: Tree;
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

function useRenderChart({ data }: BubbleChartProps) {
  const svgRef = useRef<SVGSVGElement>() as MutableRefObject<SVGSVGElement>;
  const { tooltipVisible, tooltipCoords, tooltipContent, onMouseOver, onMouseOut } = useTooltip();
  useEffect(() => {
    renderBubbleChart(svgRef, data, onMouseOver, onMouseOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return { svgRef, tooltipVisible, tooltipCoords, tooltipContent };
}
