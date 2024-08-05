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
  d3.select(svgRef.current).selectAll('*').remove();
  const linkRadial = d3
    .linkRadial<d3.HierarchyLink<Tree | WineData>, d3.HierarchyNode<Tree | WineData>>()
    .angle((d) => d.x!)
    .radius((d) => d.y!);
  const r = 3;
  const svg = d3.select(svgRef.current);
  const g = svg.append('g').attr('class', 'mouse-up');

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
