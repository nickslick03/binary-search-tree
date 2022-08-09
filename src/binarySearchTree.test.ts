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
    console.log(insertNode);

    
});