import * as d3 from 'd3';
import { MutableRefObject } from 'react';
import { color, Tree, WineData } from '../../../utils/makeTree';

export function renderBubbleChart(
  svgRef: MutableRefObject<SVGSVGElement>,
  data: Tree | WineData,
  onMouseover: (e: MouseEvent, d: WineData | undefined, text?: string) => void,
  onMouseout: () => void
) {
  (data as Tree).children.forEach((child) => {
    delete (child as any).children;
  });
  const svg = d3.select(svgRef.current);
  const parent = svgRef.current.parentElement;
  const width = +parent!.clientWidth;
  const height = +parent!.clientHeight;
  const margin = 1;

  const pack = d3
    .pack<any>()
    .size([width - margin * 2, height - margin * 2])
    .padding(3);

  const root = pack(
    d3
      .hierarchy(data)
      .count()
      .sort((a, b) => b.value! - a.value!)
  );
  console.log({ root });
  // TODO: children 데이터 잘 구성하기 - 어디까지 groupby할 지 단계를 정해야 함 - makeTree 함수에 columns를 적당히 조절하면 될 듯
  svg
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-margin, -margin, width, height])
    .attr('text-anchor', 'middle');

  svg.selectAll('*').remove();
  const container = svg.append('g').attr('class', 'container').attr('transform', 'translate(3, 1)');

  const node = container
    .append('g')
    .selectAll()
    .data(root.leaves())
    .join('g')
    .attr('transform', (d) => `translate(${d.x},${d.y})`)
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
    .on('mouseout', onMouseout);

  node
    .append('circle')
    .attr('fill', (d) => (d.children ? '#fff' : color((d.data as WineData).Country)))
    .attr('stroke', (d) => (d.children ? '#bbb' : null))
    .attr('r', (d) => d.r);
}

export function renderCirclePacking(
  svgRef: MutableRefObject<SVGSVGElement>,
  data: Tree | WineData,
  onMouseover: (e: MouseEvent, d: WineData | undefined, text?: string) => void,
  onMouseout: () => void
) {
  const svg = d3.select(svgRef.current);
  const parent = svgRef.current.parentElement;
  const width = +parent!.clientWidth;
  const height = +parent!.clientHeight;
  const margin = 1;

  const pack = d3
    .pack<Tree | WineData>()
    .size([width - margin * 2, height - margin * 2])
    .padding(3);

  const root = pack(
    d3
      .hierarchy(data)
      .count()
      .sort((a, b) => b.value! - a.value!)
  );

  svg
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-margin, -margin, width, height])
    .attr('text-anchor', 'middle');

  svg.selectAll('*').remove();
  const container = svg.append('g').attr('class', 'container').attr('transform', 'translate(3, 1)');

  const node = container
    .append('g')
    .selectAll()
    .data(root.descendants())
    .join('g')
    .attr('transform', (d) => `translate(${d.x},${d.y})`)
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
    .on('mouseout', onMouseout);

  node
    .append('circle')
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
