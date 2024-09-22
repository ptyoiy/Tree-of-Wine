export type csvWineData = {
  Appellation: string;
  Country: string;
  Designation: string;
  EstateDate: string;
  Latitude: string;
  Longitude: string;
  Region: string;
  State: string;
};

export type WineData = csvWineData & {
  id: string;
  group: string;
  values: string;
};

export type Tree = {
  name: string;
  children: Array<Tree | WineData>;
};

export function isChildrenTree(value: Tree | WineData): value is Tree {
  return 'name' in value;
}

export function makeTree(csvData: WineData[], ...columns: (keyof WineData)[]): Tree | WineData {
  console.log({ csvData });
  return buildTree(csvData, [...columns]);
}

const buildTree = (rows: WineData[], columns: (keyof WineData)[]) => {
  const tree: Tree = {
    name: 'wine',
    children: rows,
  };
  if (columns.length <= 1) return tree;

  // depth 1 제작
  const { result, nextColumns } = buildNodes(tree.children, columns);

  tree.children = result;

  // depth 1 리스트 bfs로 buildNodes 수행
  loop(tree, nextColumns);
  updateChildrenWithLength(tree)
  return tree;
};

const buildNodes = (rows: (Tree | WineData)[], columns: (keyof WineData)[]) => {
  const { entries, nextColumns } = entriesOfgroupBy(rows, columns);
  if (entries.length == 1 && entries[0][0] == 'undefined') {
    return { result: entries[0][1], nextColumns };
  }
  const result = entries.reduce((acc, [name, children]) => {
    const child = {
      name,
      children,
    };
    acc.push(child);
    return acc;
  }, [] as Tree[]);
  return { result, nextColumns };
};

function loop(current: Tree, columns: (keyof WineData)[]) {
  if (!columns.length) return;
  (current.children as Tree[]).forEach((child: Tree) => {
    const { result, nextColumns } = buildNodes(child.children, columns);
    child.children = result;
    loop(child, nextColumns);
  });
}

function entriesOfgroupBy(rows: (Tree | WineData)[], columns: (keyof WineData)[]) {
  const groupBy = Object.groupBy(rows, (row: any) => row[columns[0]]);
  const entries = Object.entries(groupBy) as [string, WineData[]][];
  if (columns.length && entries.length === 1 && (!entries[0][0] || entries[0][0] == 'undefined')) {
    return entriesOfgroupBy(entries[0][1], columns.slice(1));
  }
  return { entries, nextColumns: columns.slice(1) };
}

function updateChildrenWithLength(node: any) {
  node.children = node.children.filter((child: Tree) => child.name != '');
  if (!Array.isArray(node.children)) {
    return;
  }

  const filter = node.children?.filter?.((child: Tree) =>
    Object.prototype.hasOwnProperty.call(child, 'name')
  );

  if (!filter?.length) {
    node.children = node.children.length;
    return;
  }

  const allChildrenAreObjects = node.children
    ?.filter((child: Tree) => Object.prototype.hasOwnProperty.call(child, 'name'))
    ?.every((child: Tree) => Object.prototype.hasOwnProperty.call(child, 'name'));

  if (!allChildrenAreObjects) {
    node.children = node.children.length;
  } else {
    node.children.forEach(updateChildrenWithLength);
  }

  return node;
}
