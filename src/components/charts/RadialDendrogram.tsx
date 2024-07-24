/* eslint-disable @typescript-eslint/no-unused-vars */
import * as d3 from 'd3';
import { MutableRefObject, useEffect, useMemo, useRef } from 'react';
import { isChildrenTree, Tree, WineData } from '../../utils/makeTree';

type RadialDendrogramProps = {
  width: number;
  data: Tree | WineData;
  columns: (keyof WineData)[];
  fittingToTheEnd: boolean;
};

export function RadialDendrogram({ width, data, columns, fittingToTheEnd }: RadialDendrogramProps) {
  const { svgRef } = useRenderChart({ width, data, columns, fittingToTheEnd });

  return <svg ref={svgRef}></svg>;
}

function useRenderChart({ width, data, columns, fittingToTheEnd }: RadialDendrogramProps) {
  const svgRef = useRef() as MutableRefObject<SVGSVGElement>;
  const radius = width / 2;

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

  useEffect(() => {
    d3.select(svgRef.current).select('g').remove();
    const linkRadial = d3
      .linkRadial<d3.HierarchyLink<Tree | WineData>, d3.HierarchyNode<Tree | WineData>>()
      .angle((d) => d.x!)
      .radius((d) => d.y!);
    const r = 2.5;
    const svg = d3.select(svgRef.current);

    const g = svg.append('g');
    const link = g
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(tree.links())
      .join('path')
      .attr('d', linkRadial);

    const node = g
      .append('g')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .selectAll('g')
      .data(tree.descendants().reverse())
      .join('g')
      .attr('transform', (d) => `rotate(${(d.x! * 180) / Math.PI - 90}) translate(${d.y},0)`);

    node
      .append('circle')
      .attr('fill', (d) => (d.children ? '#555' : '#999'))
      .attr('r', r);

    node
      .append('text')
      .attr('dy', '0.31em')
      .attr('x', (d) => (d.x! < Math.PI === !d.children ? 6 : -6))
      .attr('text-anchor', (d) => (d.x! < Math.PI === !d.children ? 'start' : 'end'))
      .attr('transform', (d) => (d.x! >= Math.PI ? 'rotate(180)' : null))
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
  }, [width, data, columns, fittingToTheEnd]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const box = svg.select<SVGGElement>('g').node()!.getBBox();
    svg
      .attr('width', box.width)
      .attr('height', box.height)
      .attr('viewBox', `${box.x} ${box.y} ${box.width} ${box.height}`)
      .style('margin', '-50px')
      .style('box-sizing', 'border-box')
      .style('font', '9px sans-serif');
  }, [width])
  return { svgRef };
}
