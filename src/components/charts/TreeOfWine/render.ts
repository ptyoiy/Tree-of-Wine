import * as d3 from 'd3';
import { MutableRefObject } from 'react';
import { Tree, WineData, isChildrenTree } from '../../../utils/makeTree';

export function render(
  svgRef: MutableRefObject<SVGSVGElement>,
  columns: (keyof WineData)[],
  nodeData: d3.HierarchyNode<Tree | WineData>[],
  linkData: d3.HierarchyLink<Tree | WineData>[],
  color: d3.ScaleOrdinal<string, string, never>,
  getCountry: (d: d3.HierarchyNode<Tree | WineData>) => string,
  onMouseOver: (e: MouseEvent, d: WineData) => void,
  onMouseOut: () => void
) {
  // TODO: key, join 기능 활용해서 remove 교체하기
  d3.select(svgRef.current).select('g').remove();
  const linkRadial = d3
    .linkRadial<d3.HierarchyLink<Tree | WineData>, d3.HierarchyNode<Tree | WineData>>()
    .angle((d) => d.x!)
    .radius((d) => d.y!);
  const r = 3;
  const svg = d3.select(svgRef.current);
  /** 회전을 위해 두 g 생성
   * @var g.mouse_move mousemove 이벤트때 회전시킬 g
   * @var g.mouse_up mouseup 이벤트때 회전량을 증분 및 360도로 정규화 하면서 회전시킬 g
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    .attr('fill', (d) => (d.depth === 0 ? '#555' : color(getCountry(d))))
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
}

export function setLayoutAndInteraction(
  svgRef: MutableRefObject<SVGSVGElement>,
  sizeRef: MutableRefObject<number>,
  fontSize: number
) {
  // set layout and interaction
  const svg = d3.select(svgRef.current);
  const parent = d3.select(svgRef.current.parentElement);
  const parentLeft = +parent.style('offsetLeft');
  const parentTop = +parent.style('offsetTop');

  const box = svg.select<SVGGElement>('g.node-group').node()!.getBBox();
  if (!sizeRef.current) sizeRef.current = box.width - 100;
  const size = sizeRef.current;
  const halfSize = size / 2;
  const { PI } = Math;
  let start: number[] | null = null,
    rotate = 0;
  svg
    .attr('width', size)
    .attr('height', size)
    .attr('transform', `translate(50, 0)`)
    .style('box-sizing', 'border-box')
    .style('font', `${fontSize}px sans-serif`);

  svg.select('g.mouse-up').attr('transform', `translate(${halfSize}, ${halfSize})`);

  parent
    .on('mousedown', onMousedown)
    .on('mousemove', onMousemove)
    .on('mouseup', onMouseup);
  
  // funtions
  function onMousedown(e: MouseEvent) {
    svg.style('cursor', 'move');
    start = mouse(e);
    e.preventDefault();
  }

  function onMousemove(e: MouseEvent) {
    if (start) {
      const m = mouse(e);
      const delta = (Math.atan2(cross(start, m), dot(start, m)) * 180) / PI;
      svg.select('g.mouse-move').attr('transform', `rotate(${delta}, ${halfSize}, ${halfSize})`);
    }
  }

  function onMouseup(e: MouseEvent) {
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
          (d: any) => 'rotate(' + (normalizeAngle(d.x! + rotateToRadian) < PI ? 0 : 180) + ')'
        );
    }
  }

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
}
