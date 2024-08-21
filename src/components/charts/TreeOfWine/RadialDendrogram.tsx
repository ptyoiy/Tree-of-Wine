/* eslint-disable @typescript-eslint/no-unused-vars */
import * as d3 from 'd3';
import { MutableRefObject, useEffect, useRef } from 'react';
import { getParent } from '../../../utils/chartUtils';
import { Tree, WineData } from '../../../utils/makeTree';
import RotateSlider from '../../layout/Slider';
import { Tooltip, useTooltip } from '../../layout/tooltip';
import { render, setLayout } from './render';

type RadialDendrogramProps = {
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

function useRenderChart({ data, fontSize, fittingToTheEnd }: RadialDendrogramProps) {
  const svgRef = useRef() as MutableRefObject<SVGSVGElement>;
  const { tooltipContent, tooltipVisible, tooltipCoords, onMouseOver, onMouseOut } = useTooltip();

  useEffect(() => {
    const { nodeData, linkData, size } = getChartData(svgRef, data, fittingToTheEnd);
    setLayout(svgRef, size, fontSize);
    render(svgRef, nodeData, linkData, onMouseOver, onMouseOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fittingToTheEnd]);

  return { svgRef, tooltipContent, tooltipVisible, tooltipCoords };
}

function getChartData(
  ref: MutableRefObject<SVGSVGElement>,
  data: Tree | WineData,
  fittingToTheEnd: boolean
) {
  const parent = getParent(ref);
  const size = parent!.clientWidth;
  const radius = (size / 2) - 250;

  let tree: d3.HierarchyNode<Tree | WineData>;
  if (fittingToTheEnd) {
    const treeConstructor = d3.cluster<Tree | WineData>().size([2 * Math.PI, radius]);
    const hierarchy = d3.hierarchy(data).sort((a, b) => a.height - b.height);
    tree = treeConstructor(hierarchy);
  } else {
    tree = d3.hierarchy(data).sort((a, b) => a.height - b.height);
    d3
      .tree<Tree | WineData>()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)(tree);
  }

  const nodeData = tree.descendants().reverse();
  const linkData = tree.links();
  return { nodeData, linkData, size: size };
}
