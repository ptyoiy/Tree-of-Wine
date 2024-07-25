/* eslint-disable @typescript-eslint/no-unused-vars */
import * as d3 from 'd3';
import { MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import { isChildrenTree, Tree, WineData } from '../../../utils/makeTree';
import { Tooltip, useTooltip } from '../../layout/tooltip';

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
  const radius = width / 2;
  const { tooltipContent, tooltipVisible, tooltipCoords, onMouseOver, onMouseOut } = useTooltip();
  const { nodeData, linkData, color, getCountry } = useChartData(fittingToTheEnd, data, radius);

  /** render */
  useEffect(() => {
    d3.select(svgRef.current).select('g').remove();
    const linkRadial = d3
      .linkRadial<d3.HierarchyLink<Tree | WineData>, d3.HierarchyNode<Tree | WineData>>()
      .angle((d) => d.x!)
      .radius((d) => d.y!);
    const r = 3;
    const svg = d3.select(svgRef.current);
    const g = svg.append('g').attr('transform', `translate(0, ${-30})`);
    const link = g
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(linkData)
      .join('path')
      .attr('d', linkRadial);

    const node = g
      .append('g')
      .attr('class', 'node-group')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .selectAll('g')
      .data(nodeData)
      .join('g')
      .attr('transform', (d) => `rotate(${(d.x! * 180) / Math.PI - 90}) translate(${d.y},0)`);

    node
      .append('circle')
      .attr('cursor', 'pointer')
      .attr('fill', (d) => {
        return d.depth === 0 ? '#555' : color(getCountry(d));
      })
      .attr('r', r)
      .on('mouseover', (e, d) => {
        if ('Country' in d.data) onMouseOver(e, d.data);
      })
      .on('mouseout', (e, d) => {
        if ('Country' in d.data) onMouseOut();
      });

    node
      .append('text')
      .attr('dy', '0.31em')
      .attr('x', (d) => (d.x! < Math.PI === !d.children ? 6 : -6))
      .attr('text-anchor', (d) => (d.x! < Math.PI === !d.children ? 'start' : 'end'))
      .attr('transform', (d) => (d.x! >= Math.PI ? 'rotate(180)' : null))
      .on('mouseover', (e, d) => {
        if ('Country' in d.data) onMouseOver(e, d.data);
      })
      .on('mouseout', (e, d) => {
        if ('Country' in d.data) onMouseOut();
      })
      .text((d) => {
        if (isChildrenTree(d.data)) {
          return d.data.name;
        } else {
          return d.data[columns.at(-1)!];
        }
      })
      .filter((d) => isChildrenTree(d.data))
      .clone(true)
      .lower()
      .attr('stroke', 'white');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fittingToTheEnd]);

  /** set layout */
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const box = svg.select<SVGGElement>('g.node-group').node()!.getBBox();
    const { x, y, width, height } = box;
    svg
      .attr('width', width)
      .attr('height', height - 100)
      .attr('viewBox', `${x} ${y} ${width} ${height - 100}`)
      .style('margin', '-50px')
      .style('box-sizing', 'border-box')
      .style('font', `${fontSize}px sans-serif`);
  }, [width]);

  return { svgRef, tooltipContent, tooltipVisible, tooltipCoords };
}

function useChartData(fittingToTheEnd: boolean, data: Tree | WineData, radius: number) {
  /** Tree 생성
   * @param fittingToTheEnd 값에 따라 layout만 다른 동일한 tree 데이터 생성
   */
  const tree = useMemo(() => {
    if (fittingToTheEnd) {
      const treeConstructor = d3.cluster<Tree | WineData>().size([2 * Math.PI, radius - 100]);
      const hierarchy = d3.hierarchy(data).sort((a, b) => a.height - b.height);
      return treeConstructor(hierarchy);
    }
    const tree = d3.hierarchy(data).sort((a, b) => a.height - b.height);
    d3
      .tree<Tree | WineData>()
      .size([2 * Math.PI, radius - 100])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)(tree);
    return tree;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fittingToTheEnd]);

  /** Tree의 node, link 데이터 */
  const { nodeData, linkData } = useMemo(
    () => ({ nodeData: tree.descendants().reverse(), linkData: tree.links() }),
    [tree]
  );

  /** Country 색 매핑 함수 */
  const color = useMemo(
    () =>
      d3
        .scaleOrdinal<string>()
        .domain(['France', 'Spain', 'Italy'])
        .range(['#0055A4', '#FFD700', '#008C45']),
    []
  );

  /** node의 Country를 찾아 반환하는 함수 */
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
