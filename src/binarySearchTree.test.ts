import { buildTree } from "./binarySearchTree";

test('bst', () => {
    const binaryTree = buildTree([3, 5, 1, 3, 2, 1, 2, 4, 3])
    expect(binaryTree.value).toEqual(3);

    const insertNode = binaryTree.insert(3.5);
    expect(binaryTree.rightChild?.leftChild?.leftChild?.value).toBe(3.5);
    expect(binaryTree.insert(3)).toBe(null);
    expect(binaryTree.insert(0)).toBeTruthy;
    expect(binaryTree.insert(10)).toBeTruthy;
    expect(binaryTree.insert(1.1)).toBeTruthy;


    expect(binaryTree.find(3.5)).toBe(insertNode);
    expect(binaryTree.find(110)).toBe(null);


    expect(binaryTree.remove(3.5)).toBe(true);
    expect(binaryTree.remove(2)).toBe(true);
    expect(binaryTree.remove(2)).toBe(false);
    expect(binaryTree.remove(3)).toBe(true);
    expect(binaryTree.remove(3)).toBe(false)
});

test('bst leveling', () => {
    const binaryTreeTwo = buildTree([2, 4, 6, 8, 10, 12, 14]);
    expect(binaryTreeTwo.levelOrder().map(node => node.value)).toEqual([8, 4, 12, 2, 6, 10, 14]);
    expect(binaryTreeTwo.preOrder().map(node => node.value)).toEqual([8, 4, 2, 6, 12, 10, 14]);
    expect(binaryTreeTwo.postOrder().map(node => node.value)).toEqual([2, 6, 4, 10, 14, 12, 8]);

    const binaryTreeThree = buildTree([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(binaryTreeThree.inOrder().map(node => node.value)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test('bst height & depth', () => {
    const binaryTree = buildTree([2, 4, 6, 8, 10, 12, 14]);
    const child = binaryTree.leftChild;
    
    expect(binaryTree.height(binaryTree)).toBe(2);
    if(child !== null) expect(binaryTree.height(child)).toBe(1);

    expect(binaryTree.depth(binaryTree)).toBe(0);
    if(child !== null) expect(binaryTree.depth(child)).toBe(1);
});