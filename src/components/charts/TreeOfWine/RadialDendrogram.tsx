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
    /** 회전을 위해 두 g 생성
     * @var {mouse-move} mousemove 이벤트때 회전시킬 요소
     * @var {mouse-up} mouseup 이벤트때 회전량을 증분 및 360도로 정규화 하면서 회전시킬 요소
     *
     * 두 회전은 따로 작동함
     ** move일땐 g.mouse-move만 단독으로 증분 없이 회전시킴
     ** up일땐 g.mouse-up만 단독으로 증분 및 정규화하며 회전시킴
     *
     * move도 up처럼 증분하며 회전시키면 비정상적으로 빠르게 회전하기 때문에 이런 방식으로 구현함
     * 한 g 대신 svg를 회전시키면 svg의 width, height를 똑같이 맞춰야 하는 불편함이 있음
     */
    const outerG = svg.append('g').attr('class', 'mouse-move');
    const g = outerG.append('g').attr('class', 'mouse-up');

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
      .attr('fill', (d) => d.depth === 0 ? '#555' : color(getCountry(d)))
      .attr('r', r)
      .on('mouseover', (e, d) => {
        if ('Country' in d.data) onMouseOver(e, d.data);
      })
      .on('mouseout', (_e, d) => {
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
      .on('mouseout', (_e, d) => {
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
    const parent = d3.select(svgRef.current.parentElement);
    const parentLeft = +parent.style('offsetLeft');
    const parentTop = +parent.style('offsetTop');
    const size = box.width - 100;
    const halfSize = size / 2;
    const { PI } = Math;
    svg
      .attr('width', size)
      .attr('height', size)
      .attr('transform', `translate(50, -10)`)
      .style('box-sizing', 'border-box')

      .style('font', `${fontSize}px sans-serif`);

    svg.select('g.mouse-up').attr('transform', `translate(${halfSize}, ${halfSize})`);

    function cross(a: number[], b: number[]) {
      return a[0] * b[1] - a[1] * b[0];
    }
    function dot(a: number[], b: number[]) {
      return a[0] * b[0] + a[1] * b[1];
    }
    function mouse({ pageX, pageY }: MouseEvent) {
      return [pageX - parentLeft - halfSize, pageY - parentTop - halfSize];
    }
    function toRadian(rotate: number) {
      return (rotate * PI) / 180;
    }
    function normalizeAngle(angle: number) {
      return angle % (2 * PI);
    }
    let start: number[] | null = null,
      rotate = 0;
    parent
      .on('mousedown', function (e: MouseEvent) {
        svg.style('cursor', 'move');
        start = mouse(e);
        e.preventDefault();
      })
      .on('mousemove', function (e: MouseEvent) {
        if (start) {
          const m = mouse(e);
          const delta = (Math.atan2(cross(start, m), dot(start, m)) * 180) / PI;
          svg
            .select('g.mouse-move')
            .attr('transform', `rotate(${delta}, ${halfSize}, ${halfSize})`);
        }
      })
      .on('mouseup', function (e: MouseEvent) {
        if (start) {
          svg.style('cursor', 'auto');
          const m = mouse(e);
          const delta = (Math.atan2(cross(start, m), dot(start, m)) * 180) / PI;
          rotate += delta;
          if (rotate > 360) rotate %= 360;
          else if (rotate < 0) rotate = (360 + rotate) % 360;
          start = null;
          const rotateToRadian = toRadian(rotate);
          svg.select('g.mouse-move').attr('transform', null);
          svg
            .select('g.mouse-up')
            .attr('transform', `translate(${size / 2}, ${size / 2})rotate(${rotate})`)
            .selectAll('text')
            .attr('x', (d: any) =>
              normalizeAngle(d.x! + rotateToRadian) < PI === !d.children ? 6 : -6
            )
            .attr('text-anchor', (d: any) =>
              normalizeAngle(d.x! + rotateToRadian) < PI === !d.children ? 'start' : 'end'
            )
            .attr(
              'transform',
              (d: any) =>
                'rotate(' + (normalizeAngle(d.x! + rotateToRadian) < PI ? 0 : 180) + ')'
            );
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
