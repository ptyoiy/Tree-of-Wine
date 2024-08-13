/* eslint-disable @typescript-eslint/no-unused-vars */
import * as d3 from 'd3';
import { MutableRefObject, useEffect, useMemo, useRef } from 'react';
import { Tree, WineData } from '../../../utils/makeTree';
import RotateSlider from '../../layout/Slider';
import { Tooltip, useTooltip } from '../../layout/tooltip';
import { render, setLayoutAndInteraction } from './render';

type RadialDendrogramProps = {
  width: number;
  fontSize: number;
  data: WineData | Tree;
  fittingToTheEnd: boolean;
};

export default function RadialDendrogram(props: RadialDendrogramProps) {
  const { svgRef, tooltipContent, tooltipVisible, tooltipCoords } = useRenderChart(props);
  return (
    <>
      <Tooltip
        content={tooltipContent}
        visible={tooltipVisible}
        x={tooltipCoords.x}
        y={tooltipCoords.y}
      />
      <svg style={{ gridRow: '2 / 3', gridColumn: '1 / 2' }} ref={svgRef}></svg>
      <RotateSlider svgRef={svgRef} />
    </>
  );
}

function useRenderChart({
  width,
  data,
  fontSize,
  fittingToTheEnd,
}: RadialDendrogramProps) {
  const svgRef = useRef() as MutableRefObject<SVGSVGElement>;
  const sizeRef = useRef(0);
  const radius = width / 2;
  const { tooltipContent, tooltipVisible, tooltipCoords, onMouseOver, onMouseOut } = useTooltip();
  const { nodeData, linkData } = useChartData(fittingToTheEnd, data, radius);

  useEffect(() => {
    render(svgRef, nodeData, linkData, onMouseOver, onMouseOut);
    setLayoutAndInteraction(svgRef, sizeRef, fontSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fittingToTheEnd]);

  return { svgRef, sizeRef, tooltipContent, tooltipVisible, tooltipCoords };
}

function useChartData(fittingToTheEnd: boolean, treeData: WineData | Tree, radius: number) {
  /** Tree data 생성
   * @param fittingToTheEnd 값에 따라 layout만 다른 동일한 tree 데이터 생성
   */
  const { nodeData, linkData } = useMemo(() => {
    let tree: d3.HierarchyNode<Tree | WineData>;
    if (fittingToTheEnd) {
      const treeConstructor = d3.cluster<Tree | WineData>().size([2 * Math.PI, radius - 100]);
      const hierarchy = d3.hierarchy(treeData).sort((a, b) => a.height - b.height);
      tree = treeConstructor(hierarchy);
    } else {
      tree = d3.hierarchy(treeData).sort((a, b) => a.height - b.height);
      d3
        .tree<Tree | WineData>()
        .size([2 * Math.PI, radius - 100])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)(tree);
    }

    const nodeData = tree.descendants().reverse();
    const linkData = tree.links();

    return { nodeData, linkData };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fittingToTheEnd]);

  return { nodeData, linkData };
}
