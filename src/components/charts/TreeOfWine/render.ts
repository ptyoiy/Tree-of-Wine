import * as d3 from 'd3';
import { MutableRefObject } from 'react';
import { color, getCountryAtTreeOfWine } from '../../../utils/chartUtils';
import { Tree, WineData, isChildrenTree } from '../../../utils/makeTree';

export function render(
  svgRef: MutableRefObject<SVGSVGElement>,
  nodeData: d3.HierarchyNode<Tree | WineData>[],
  linkData: d3.HierarchyLink<Tree | WineData>[],
  onMouseOver: (e: MouseEvent, d: WineData) => void,
  onMouseOut: () => void
) {
  // TODO: key, join 기능 활용해서 remove 교체하기
  d3.select(svgRef.current).selectAll('*').remove();
  const linkRadial = d3
    .linkRadial<d3.HierarchyLink<Tree | WineData>, d3.HierarchyNode<Tree | WineData>>()
    .angle((d) => d.x!)
    .radius((d) => d.y!);
  const r = 3;
  const svg = d3.select(svgRef.current);
    /** 회전에 사용될 두 g
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

  g // link
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
    .attr('fill', (d) => (d.depth === 0 ? '#555' : color(getCountryAtTreeOfWine(d))))
    .attr('r', r)
    .on('mousemove', (e, d) => {
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
    .on('mousemove', (e, d) => {
      if ('Country' in d.data) onMouseOver(e, d.data);
    })
    .on('mouseout', (_e, d) => {
      if ('Country' in d.data) onMouseOut();
    })
    .text((d) => {
      if (isChildrenTree(d.data)) {
        return d.data.name;
      } else {
        return d.data.Designation;
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
  svg.select<SVGGElement>('g').attr('transform', `translate(50, 0)`);

  const box = svg.select<SVGGElement>('g.node-group').node()!.getBBox();
  if (!sizeRef.current) sizeRef.current = box.width - 100;
  const size = sizeRef.current;
  const halfSize = size / 2;

  svg
    .attr('width', size + 150)
    .attr('height', size)
    .style('box-sizing', 'border-box')
    .style('font', `${fontSize}px sans-serif`);

  svg.select('g.mouse-up').attr('transform', `translate(${halfSize}, ${halfSize})`);
}
