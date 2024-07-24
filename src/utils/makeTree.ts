export type WineData = {
  Appellation: string;
  Country: string;
  Designation: string;
  EstateDate: string;
  Latitude: string;
  Longitude: string;
  Region: string;
};

export type Tree = {
  name: string;
  children: Array<Tree | WineData>;
};

export function isChildrenTree(value: Tree | WineData): value is Tree {
  return 'name' in value;
}

export function makeTree(csvData: WineData[], ...columns: (keyof WineData)[]): Tree {
  return buildTree(csvData, columns);
}

const buildTree = (rows: WineData[], columns: (keyof WineData)[]) => {
  const tree: Tree = {
    name: 'wine',
    children: rows,
  };
  const shift = columns.shift();
  if (!shift) return tree;
  tree.children = buildNodes(tree.children, shift);
  loop(tree, columns);
  return tree;
};

function loop(current: Tree, columns: (keyof WineData)[]) {
  if (columns.length == 1) return;
  const col = columns.shift();
  if (!col) return;
  (current.children as Tree[]).forEach((child: Tree) => {
    child.children = buildNodes(child.children, col);
    loop(child, [...columns]);
  });
}

const buildNodes = (rows: (Tree | WineData)[], col: keyof WineData) => {
  const groupBy = Object.groupBy(rows, (row: any) => row[col]);
  const entries = Object.entries(groupBy) as [string, WineData[]][];
  if (entries.length === 1 && entries[0][0] === '') {
    return rows;
  }
  return entries.reduce((node: Tree[], [name, children]) => {
    const child = {
      name,
      children,
    };
    node.push(child);
    return node;
  }, []);
};
