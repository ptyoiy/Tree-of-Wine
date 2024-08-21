/* eslint-disable @typescript-eslint/no-unused-vars */
import * as d3 from 'd3';
import { MutableRefObject, useEffect, useMemo, useRef } from 'react';
import { Tree, WineData } from '../../../utils/makeTree';
import RotateSlider from '../../layout/Slider';
import { Tooltip, useTooltip } from '../../layout/tooltip';
import autoSizingWrapper, { Size } from '../wrapper/Wrapper';
import { render, setLayout } from './render';

type RadialDendrogramProps = {
  fontSize: number;
  data: WineData | Tree;
  fittingToTheEnd: boolean;
  size?: Size;
};
const WrappedRadialDendrogram = autoSizingWrapper(RadialDendrogram);
function RadialDendrogram(props: RadialDendrogramProps) {
  const { svgRef, tooltipContent, tooltipVisible, tooltipCoords } = useRenderChart(props);
  return (
    <>
      <Tooltip
        content={tooltipContent}
        visible={tooltipVisible}
        x={tooltipCoords.x}
        y={tooltipCoords.y}
      />
      <svg style={{ gridRow: '2 / 3', gridColumn: '1 / 2' }} ref={svgRef} />
      <RotateSlider svgRef={svgRef} />
    </>
  );
}

function useRenderChart({ data, size, fontSize, fittingToTheEnd }: RadialDendrogramProps) {
  const svgRef = useRef() as MutableRefObject<SVGSVGElement>;
  const { tooltipContent, tooltipVisible, tooltipCoords, onMouseOver, onMouseOut } = useTooltip();
  const { nodeData, linkData, width } = useChartData(data, size!, fittingToTheEnd);

  useEffect(() => {
    setLayout(svgRef, width, fontSize);
    render(svgRef, nodeData, linkData, onMouseOver, onMouseOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fittingToTheEnd]);

  return { svgRef, tooltipContent, tooltipVisible, tooltipCoords };
}

function useChartData(data: Tree | WineData, { width }: Size, fittingToTheEnd: boolean) {
  const { nodeData, linkData } = useMemo(() => {
    let tree: d3.HierarchyNode<Tree | WineData>;
    const radius = width / 2 - 250; // 250: padding for chart size
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
    return { nodeData, linkData };
  }, [data, fittingToTheEnd, width]);
  return { nodeData, linkData, width };
}

export default WrappedRadialDendrogram;
