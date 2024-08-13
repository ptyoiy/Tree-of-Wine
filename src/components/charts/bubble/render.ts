import * as d3 from 'd3';
import { MutableRefObject } from 'react';
import { color, getContrastingColor, getCountryAtBubble } from '../../../utils/chartUtils';
import { Tree, WineData } from '../../../utils/makeTree';

export function setLayout(svgRef: MutableRefObject<SVGSVGElement>, pack: d3.PackLayout<any>) {
  const svg = d3.select(svgRef.current);
  const parent = svgRef.current.parentElement;
  const width = +parent!.clientWidth;
  const height = +parent!.clientHeight;
  const margin = 1;

  pack.size([width - margin * 2, height - margin * 2]);

  svg
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-margin, -margin, width, height])
    .attr('text-anchor', 'middle');

  svg.selectAll('*').remove();
  const container = svg.append('g').attr('class', 'container').attr('transform', 'translate(3, 1)');

  container.append('g').attr('class', 'node-group');
  container.append('g').attr('class', 'text-group');
}

export function renderBubbleChart(
  svgRef: MutableRefObject<SVGSVGElement>,
  btnRef: MutableRefObject<HTMLButtonElement>,
  pack: d3.PackLayout<Tree | WineData>,
  tree: d3.HierarchyCircularNode<WineData | Tree>,
  onMouseover: (e: MouseEvent, d: WineData | undefined, text?: string) => void,
  onMouseout: () => void
) {
  const svg = d3.select(svgRef.current);
  const node = svg.select('g.node-group');
  const text = svg.select('g.text-group');

  btnRef.current.onclick = () => {
    const parent = tree.find((node) => (node.data as Tree).name === currentNodeName)?.parent;
    makeBubble(parent!.data);
  };

  /**
   * 클릭을 통해 반복 호출해야 하기 때문에 함수로 작성
   * 데이터(노드) 클릭 -> 클릭한 노드로 tree를 변경(onClick) -> 좌표 재계산(pack) -> 클릭한 데이터 시각화
   */
  let currentNodeName = '';
  function makeBubble(treeData: Tree | WineData) {
    currentNodeName = (treeData as Tree).name;
    btnRef.current.classList.toggle('Mui-disabled', currentNodeName === 'wine');
    const root = pack(
      d3
        .hierarchy(treeData)
        .count()
        .sort((a, b) => b.value! - a.value!)
    );
    node
      .selectAll('circle')
      .data(root.children!)
      .join('circle')
      .on('mousemove', (e, d) => {
        const prevNodesNameJoin = d
          .ancestors()
          .map((d) => (d.data as Tree)?.name || (d.data as WineData)?.Designation)
          .reverse()
          .filter((d) => d !== 'wine')
          .join(' / ');
        const text = d.children ? `${prevNodesNameJoin || 'wine'} : ${d.value}` : undefined;
        const data = d.children ? undefined : (d.data as WineData);
        onMouseover(e, data, text);
      })
      .on('mouseout', onMouseout)
      .on('click', (_e, d) => {
        if (d.children) {
          makeBubble(d.data);
        }
      })
      .attr('cursor', 'pointer')
      .transition()
      .duration(500)
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .attr('fill', (d) => color(getCountryAtBubble(d as d3.HierarchyNode<WineData>)))
      .attr('stroke', '#bbb')
      .attr('r', (d) => d.r);

    text
      .selectAll('text.text-name')
      .data(root.children!)
      .join('text')
      .transition()
      .duration(500)
      .attr('class', 'text-name')
      .attr('pointer-events', 'none')
      .attr('dy', '0.3em')
      .attr('text-anchor', 'middle')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .text((d) => `${(d.data as Tree).name || (d.data as WineData)?.Designation}`)
      .attr('font-size', (d) => `${Math.min((2 * d.r) / 5, 11)}px`)
      .attr('fill', (d) =>
        getContrastingColor(color(getCountryAtBubble(d as d3.HierarchyNode<WineData>)))
      );
    text
      .selectAll('text.text-value')
      .data(root.children!)
      .join('text')
      .transition()
      .duration(500)
      .attr('class', 'text-value')
      .attr('pointer-events', 'none')
      .attr('dy', '1.5em')
      .attr('text-anchor', 'middle')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .text((d) => `${d.children ? d.value : ''}`)
      .attr('font-size', (d) => `${Math.min((2 * d.r) / 5, 11)}px`)
      .attr('fill', (d) =>
        getContrastingColor(color(getCountryAtBubble(d as d3.HierarchyNode<WineData>)))
      );
  }
  makeBubble(tree.data);
}

export function renderCirclePacking(
  svgRef: MutableRefObject<SVGSVGElement>,
  tree: d3.HierarchyCircularNode<Tree | WineData>,
  pack: d3.PackLayout<Tree | WineData>,
  onMouseover: (e: MouseEvent, d: WineData | undefined, text?: string) => void,
  onMouseout: () => void
) {
  const node = d3.select(svgRef.current).select('g.node-group');
  tree = pack(
    d3
      .hierarchy(tree.data)
      .count()
      .sort((a, b) => b.value! - a.value!)
  );
  node
    .selectAll('circle')
    .data(tree.descendants())
    .join('circle')
    .on('mousemove', (e, d) => {
      const prevNodeNameJoin = d
        .ancestors()
        .map((d) => (d.data as Tree)?.name || (d.data as WineData)?.Designation)
        .reverse()
        .filter((d) => d !== 'wine')
        .join(' / ');
      const text = d.children ? `${prevNodeNameJoin || 'wine'} : ${d.value}` : undefined;
      const data = d.children ? undefined : (d.data as WineData);
      onMouseover(e, data, text);
    })
    .on('mouseout', onMouseout)
    .attr('cursor', 'pointer')
    .transition()
    .duration(500)
    .attr('transform', (d) => `translate(${d.x},${d.y})`)
    .attr('fill', (d) => (d.children ? '#fff' : color((d.data as WineData).Country)))
    .attr('stroke', (d) => (d.children ? '#bbb' : null))
    .attr('r', (d) => d.r);

  // const text = node
  //   .filter(d => !d.children && d.r > 4)
  //   .append("text")
  //   .attr("clip-path", d => `circle(${d.r})`);

  // text.selectAll()
  //   .data(d => (d.data as WineData).Designation.split(/(?=[A-Z][a-z])|\s+/g))
  //   .join("tspan")
  //   .attr("x", 0)
  //   .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
  //   .text(d => d);

  // text.append("tspan")
  //   .attr("x", 0)
  //   .attr("y", d => `${(d.data as WineData).Designation.split(/(?=[A-Z][a-z])|\s+/g).length / 2 + 0.35}em`)
  //   .attr("fill-opacity", 0.7)
  //   .text(d => format(d.value!));
}
