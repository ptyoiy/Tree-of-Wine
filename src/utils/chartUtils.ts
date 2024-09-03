/* eslint-disable no-var */
import * as d3 from 'd3';
import { MutableRefObject } from 'react';
import { Tree, WineData } from './makeTree';

export const color = d3
  .scaleOrdinal<string>()
  .domain(['France', 'Spain', 'Italy', 'Portugal', 'Germany', 'Argentina', 'Chile', 'Australia'])
  .range([
    '#0055A4', // France: Blue from the French flag
    '#FFD700', // Spain: Gold from the Spanish flag
    '#008C45', // Italy: Green from the Italian flag
    '#FF5E00', // Portugal: Orange from the Portuguese flag
    '#000000', // Germany: Black from the German flag
    '#74ACDF', // Argentina: Light blue from the Argentine flag
    '#D52B1E', // Chile: Red from the Chilean flag
    '#FFCC00'  // Australia: Gold from the Australian flag
  ]);

/** node의 Country를 찾아 반환하는 함수
 * @variation depth 0 ~ n
 */
export const getCountryAtTreeOfWine = (d: d3.HierarchyNode<Tree | WineData>) => {
  const { depth, data } = d;
  // 말단 노드일 때
  if ('Country' in data) return data.Country;
  // 중간 노드일 때
  if (depth === 1) return data.name;
  else {
    // 2 ~ n-1 depth의 노드면 depth 1을 찾아감
    for (var current = d; current.depth !== 1; current = current.parent!);
    return (current?.data as Tree).name;
  }
};

/**
 * node의 Country를 말단 노드에서 찾아 반환하는 함수
 */
export const getCountryAtBubble = (d: d3.HierarchyNode<WineData>) => {
  for (var current = d; !('Country' in current.data); current = current.children![0]);
  return current?.data.Country;
};

/** 보색 구하기 */
export function getContrastingColor(color: string) {
  const labColor = d3.lab(color); // 입력된 색상을 LAB 색상 공간으로 변환
  return labColor.l > 50 ? '#000000' : '#FFFFFF'; // 명도(l)가 50 이상이면 검은색, 아니면 흰색 반환
}

/** 부모 요소 추출 */
export function getParent<T extends SVGElement>(ref: MutableRefObject<T>): HTMLDivElement | null {
  return ref.current?.parentElement as HTMLDivElement;
}

/**
 * Tree flatten
 * dfs대신 원본 데이터 배열에서 탐색하여 반환
 * */
export function getAllChildren(d: d3.HierarchyNode<WineData | Tree>) {
  return d.descendants().filter(node => !node.children).map(node => node.data as WineData);
}
