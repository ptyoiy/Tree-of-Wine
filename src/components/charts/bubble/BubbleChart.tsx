import { Button } from '@mui/material';
import * as d3 from 'd3';
import { MutableRefObject, useEffect, useMemo, useRef } from 'react';
import { Tree, WineData } from '../../../utils/makeTree';
import { Tooltip, useTooltip } from '../../layout/tooltip';
import { Size } from '../wrapper';
import { renderBubbleChart, setLayout } from './render';

type BubbleChartProps = {
  data: d3.HierarchyNode<WineData | Tree>;
  size?: Size;
};
export default function BubbleChart(props: BubbleChartProps) {
  const {
    svgRef,
    btnRef,
    tooltipVisible,
    tooltipCoords: { x, y },
    tooltipContent,
  } = useRenderChart(props);
  return (
    <>
      <div style={{ position: 'relative', float: 'right', zIndex: 999 }}>
        <Button variant="contained" ref={btnRef}>
          ↑
        </Button>
      </div>
      <svg ref={svgRef} />
      <Tooltip content={tooltipContent} visible={tooltipVisible} x={x} y={y} />
    </>
  );
}

// pack, data 제작
function useRenderChart({ data, size }: BubbleChartProps) {
  const svgRef = useRef<SVGSVGElement>() as MutableRefObject<SVGSVGElement>;
  const btnRef = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>;
  const { tooltipVisible, tooltipCoords, tooltipContent, onMouseOver, onMouseOut } = useTooltip();
  const { pack, originTree } = useChartData(data);
  useEffect(() => {
    setLayout(svgRef, size!, pack);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    renderBubbleChart(svgRef, btnRef, pack, originTree, onMouseOver, onMouseOut);
    // renderCirclePacking(svgRef, originTree, pack, onMouseOver, onMouseOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return {
    svgRef,
    btnRef,
    tooltipVisible,
    tooltipCoords,
    tooltipContent,
  };
}

function useChartData(data: d3.HierarchyNode<WineData | Tree>) {
  const pack = useMemo(() => {
    return d3.pack<Tree | WineData>().padding(3);
  }, []);

  const originTree = useMemo(
    () =>
      pack(
        data
          .count()
          .sort((a, b) => b.value! - a.value!)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );
  return { pack, originTree };
}
