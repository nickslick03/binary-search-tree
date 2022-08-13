export function buildTree<T>(initialArray: T[]) {
    let headNode = 
    chainNodes(
        removeDuplicates(
            mergeSort(initialArray)
            )
        ) as headNode<T>;
    headNode.insert = (value: T) => insert<T>(headNode, value);
    headNode.find = (value: T) => find<T>(headNode, value);
    headNode.remove = (value: T) => remove<T>(headNode, value);
    headNode.levelOrder = () => levelOrder<T>([headNode]);
    headNode.preOrder = () => preOrder<T>(headNode);
    headNode.inOrder = () => inOrder<T>(headNode);
    headNode.postOrder = () => postOrder<T>(headNode);
    headNode.height = (node: node<T>) => height<T>(node);
    headNode.depth = (node: node<T>) => depth<T>(headNode, node);
    headNode.isBalanced = () => isBalanced<T>(headNode);
    headNode.rebalance = () =>
        headNode = buildTree(headNode.inOrder().map(node => node.value));
    return headNode;
}

function mergeSort<T>(arr: T[]): T[] {
    if(arr.length < 2) return arr;
    const arr1 = mergeSort(arr.slice(0, arr.length / 2));
    const arr2 = mergeSort(arr.slice(arr.length / 2)); // if arr.length is odd, arr2.length > arr1.length
    const mergeArr: T[] = [];
    while(arr1.length > 0 || arr2.length > 0) {
        mergeArr[mergeArr.length] = (arr1.length === 0 || arr2[0] < arr1[0] ? arr2 : arr1).shift() as T;
    }
    return mergeArr;
}

const removeDuplicates = <T>(arr: T[]): T[] =>
    arr.filter((value, index) => value !== arr[index - 1]); //arr must be sorted first

type node<T> = {
    value: T,
    leftChild: node<T> | null,
    rightChild: node<T> | null,
};

type headNode<T> = node<T> & {
    insert(value: T): node<T> | null,
    find(value: T): node<T> | null,
    remove(value: T): boolean,
    levelOrder(): node<T>[],
    preOrder(): node<T>[],
    inOrder(): node<T>[],
    postOrder(): node<T>[],
    height(node: node<T>): number,
    depth(node: node<T>): number,
    isBalanced(): boolean,
    rebalance(): void,
}

type child = 'leftChild' | 'rightChild';

const createNode = <T>(value: T, leftChild: node<T> | null, rightChild: node<T> | null ): node<T> =>
    ({  
        value,
        leftChild,
        rightChild,
        });

const chainNodes = <T>(arr: T[]): node<T> | null => {
    if (arr.length < 1) return null;
    const middleIndex = Math.floor(arr.length / 2);
    return createNode(
        arr[middleIndex], 
        chainNodes(arr.slice(0, middleIndex)), 
        chainNodes(arr.slice(middleIndex + 1))
        );
};

const insert = <T>(node: node<T>, value: T): node<T> | null => {
    if(value === node.value) return null;
    return ((child: child): node<T> | null => {
        if(node[child] === null) {
            const newNode = createNode(value, null, null);
            node[child] = newNode;
            return newNode;
        }
        return insert(node[child] as node<T>, value);
    })(value < node.value ? 'leftChild' : 'rightChild');
};

const find = <T>(node: node<T> | null, value: T): node<T> | null => {
    const result = findParent(node, value);
    return result?.parent[result.child] || null;
};

const findParent = <T>(node: node<T> | null, value: T): { parent: node<T>, child: child } | null => {
    if(node === null || node?.leftChild === null && node?.rightChild === null) return null;
    if(node?.leftChild?.value === value) 
        return { parent: node, child: 'leftChild' };
    if(node?.rightChild?.value === value) 
        return { parent: node, child: 'rightChild' };
    return value < node.value ? findParent(node.leftChild, value) : findParent(node.rightChild, value);
}

const remove = <T>(root: node<T>, value: T): boolean => {
    //if headNode === value
    if(root.value === value) {
        if(root.leftChild !== null && root.rightChild !== null) {
            const { value: newValue } = minReplacement(root);
            remove(root, newValue);
            root.value = newValue;
            return true;
        }
        if(root.leftChild !== null && root.rightChild === null) {
            const { value: newValue } = root.leftChild;
            remove(root, newValue);
            root.value = newValue;
            return true;
        }
        if(root.leftChild === null && root.rightChild !== null) {
            const { value: newValue } = root.rightChild;
            remove(root, newValue);
            root.value = newValue;
            return true;
        }
        return false;
    }

    //FIND PARENT and CHILD (return false if cannot be found)
    const result = findParent<T>(root, value);
    if(result === null) return false;
    const { parent } = result;
    const child = parent[result.child] as node<T>;

    //if child has 2 children
    if(child.leftChild !== null && child.rightChild !== null) {
        const minNode = minReplacement(child);
        remove(root, minNode.value);
        child.value = minNode.value;
    }
    //if child has 1 child
    if(child.leftChild !== null && child.rightChild === null) {
        parent[result.child] = child.leftChild;
        child.leftChild = null;
        return true;
    }
    if(child.leftChild === null && child.rightChild !== null) {
        parent[result.child] = child.rightChild;
        child.rightChild = null;
        return true;
    }
    //if child has 0 children
    parent[result.child] = null;
    return true;
};

const minReplacement = <T>(node: node<T>): node<T> => {
    let minNode = node.rightChild as node<T>;
    while(minNode.leftChild !== null) {
        minNode = minNode.leftChild;
    }
    return minNode;
};

const levelOrder = <T>(nodeArray: node<T>[]): node<T>[] => {
    if (nodeArray.length === 0) return [];
    const children: node<T>[] = nodeArray
    .map(node => [node.leftChild, node.rightChild])
    .flat()
    .filter(node => node !== null) as node<T>[];
    return nodeArray.concat(levelOrder(children));
};

const preOrder = <T>(node: node<T>): node<T>[] => {
    if (node.leftChild === null && node.rightChild === null)
        return [node];
    if (node.leftChild === null)
        return [node].concat(preOrder(node.rightChild as node<T>));
    if (node.rightChild === null)
        return [node].concat(preOrder(node.leftChild));
    return [node].concat(preOrder(node.leftChild), preOrder(node.rightChild));
};

const inOrder = <T>(node: node<T>): node<T>[] => {
    if (node.leftChild === null && node.rightChild === null)
        return [node];
    if (node.leftChild === null)
        return [node].concat(inOrder(node.rightChild as node<T>));
    if (node.rightChild === null)
        return inOrder(node.leftChild).concat(node);
    return inOrder(node.leftChild).concat(node, inOrder(node.rightChild));
};

const postOrder = <T>(node: node<T>): node<T>[] => {
    if (node.leftChild === null && node.rightChild === null)
        return [node];
    if (node.leftChild === null)
        return postOrder(node.rightChild as node<T>).concat(node);
    if (node.rightChild === null)
        return postOrder(node.leftChild).concat(node);
    return postOrder(node.leftChild).concat(postOrder(node.rightChild), node);
};

const height = <T>(node: node<T>): number => 
    Math.max(
        node.leftChild ? height(node.leftChild) + 1 : 0, 
        node.rightChild ? height(node.rightChild) + 1 : 0
    );

const depth = <T>(root: node<T> | null, node: node<T>): number => {
    if(root === node) return 0;
    if(root === null) return Infinity;
    return 1 + depth(root[root.value < node.value ? 'rightChild' : 'leftChild'], node);
};

const isBalanced = <T>(node: node<T>): boolean =>
    node.leftChild !== null && node.rightChild !== null
    ? isBalanced(node.leftChild) && isBalanced(node.rightChild)
    : height(node) < 2;