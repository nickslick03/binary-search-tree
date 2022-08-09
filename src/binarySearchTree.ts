export function buildTree<T>(initialArray: T[]) {
    const headNode = 
    chainNodes(
        removeDuplicates(
            mergeSort(initialArray)
            )
        ) as headNode<T>;
    headNode.insert = (value: T) => insert<T>(headNode, value);
    headNode.find = (value: T) => find<T>(headNode, value);
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
    remove(value: T): boolean;
    
}

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
    return ((child: 'leftChild' | 'rightChild'): node<T> | null => {
        if(node[child] === null) {
            const newNode = createNode(value, null, null);
            node[child] = newNode;
            return newNode;
        }
        return insert(node[child] as node<T>, value);
    })(value < node.value ? 'leftChild' : 'rightChild');
};

const find = <T>(node: node<T> | null, value: T): node<T> | null => {
    if(node === null) return null;
    if(node.value === value) return node;
    return value < node.value ? find(node.leftChild, value) : find(node.rightChild, value);
};
