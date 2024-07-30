/* eslint-disable @typescript-eslint/no-unused-vars */
import * as d3 from 'd3';
import { MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import { Tree, WineData } from '../../../utils/makeTree';
import { Tooltip, useTooltip } from '../../layout/tooltip';
import { render, setLayoutAndInteraction } from './render';

type RadialDendrogramProps = {
  width: number;
  fontSize: number;
  data: Tree | WineData;
  columns: (keyof WineData)[];
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
      <svg ref={svgRef}></svg>
    </>
  );
}

function useRenderChart({
  width,
  data,
  fontSize,
  columns,
  fittingToTheEnd,
}: RadialDendrogramProps) {
  const svgRef = useRef() as MutableRefObject<SVGSVGElement>;
  const size = useRef(0);
  const radius = width / 2;
  const { tooltipContent, tooltipVisible, tooltipCoords, onMouseOver, onMouseOut } = useTooltip();
  const { nodeData, linkData, color, getCountry } = useChartData(fittingToTheEnd, data, radius);

  useEffect(() => {
    render(svgRef, columns, nodeData, linkData, color, getCountry, onMouseOver, onMouseOut);
    setLayoutAndInteraction(svgRef, size, fontSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fittingToTheEnd]);

  return { svgRef, tooltipContent, tooltipVisible, tooltipCoords };
}

function useChartData(fittingToTheEnd: boolean, data: Tree | WineData, radius: number) {
  /** Tree data 생성
   * @param fittingToTheEnd 값에 따라 layout만 다른 동일한 tree 데이터 생성
   */
  const { nodeData, linkData } = useMemo(() => {
    let tree: d3.HierarchyNode<Tree | WineData>;
    if (fittingToTheEnd) {
      const treeConstructor = d3.cluster<Tree | WineData>().size([2 * Math.PI, radius - 100]);
      const hierarchy = d3.hierarchy(data).sort((a, b) => a.height - b.height);
      tree = treeConstructor(hierarchy);
    } else {
      tree = d3.hierarchy(data).sort((a, b) => a.height - b.height);
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

  /** Country 색 매핑 함수 */
  const color = useMemo(
    () =>
      d3
        .scaleOrdinal<string>()
        .domain(['France', 'Spain', 'Italy'])
        .range(['#0055A4', '#FFD700', '#008C45']),
    []
  );

  /** node의 Country를 찾아 반환하는 함수
   * @variation depth 0 ~ n
   */
  const getCountry = useCallback((d: d3.HierarchyNode<Tree | WineData>) => {
    const { depth, data } = d;
    // 말단 노드일 때
    if ('Country' in data) return data.Country;
    // 중간 노드일 때
    if (depth === 1) return data.name;
    else {
      // 2 ~ n-1 depth의 노드면 depth 1을 찾아감
      // eslint-disable-next-line no-var
      for (var current = d; current.depth !== 1; current = current.parent!);
      return (current?.data as Tree).name;
    }
  }, []);

  return { nodeData, linkData, color, getCountry };
}
