/* eslint spaced-comment: 0, jsx-a11y/href-no-hash: 0 */
const Bytepack = require('./bytepack.js');
const { LinkedList } = require('./LinkedList.js');

/************************************ GENERAL TRIE METHODS *****************************************/

const walkThruPrefix = function _walkThruPrefix(startNode, prefix) {
  let remainingPrefix = prefix;
  let current = startNode;
  let next = current.child;

  while (next !== null && remainingPrefix[0] !== undefined) {
    while (next.sibling !== null && next.value !== remainingPrefix[0]) {
      current = next;
      next = next.sibling;
    }
    current = next;
    next = current.child;
    remainingPrefix = remainingPrefix.slice(1, remainingPrefix.length);
  }
  return current;
};

const insertNodeIntoTrie = function _insertNodeIntoTrie(nodeToInsert, prefix, someRoot) {
  const charToInsert = nodeToInsert.value;
  const current = someRoot;
  const subTrieRoot = walkThruPrefix(current, prefix);

  // the child of any node is the head of another linked list.
  // This linked list represents a single level in a subTrie
  if (subTrieRoot.child === null) {
    subTrieRoot.child = nodeToInsert;
  } else if (LinkedList.nodeExistsInLinkedList(subTrieRoot.child, charToInsert)) {
    // do nothing, we should not insert a node that already exists at a given level in the trie
  } else {
    LinkedList.appendNodeToTailOfLinkedList(subTrieRoot, subTrieRoot.child, nodeToInsert);
  }
};

const addSymbolToTrie = function _addSymbolToTrie(currentChar, index, array, someRoot) {
  // if last character, then character denotes word
  const denotesWord = (index === (array.length - 1));
  const myNode = LinkedList.makeLinkedListNode(currentChar, denotesWord);
  const prefix = array.slice(0, index);

  return insertNodeIntoTrie(myNode, prefix, someRoot);
};

const stringToSymbolArray = function _stringToSymbolArray(str) {
  return str.split('');
};

const symbolArrayToString = function _symbolArrayToString(arr) {
  let str = '';
  arr.forEach((symbol) => {
    str += symbol;
  });

  return str;
};

const getSuperRootNodeSpecs = function _getSuperRootNodeSpecs() {
  const nodeSpecs = {
    value: 0xFF, // EXPLAIN
    isWord: false,
    sibling: null,
    child: null,
  };

  return nodeSpecs;
};

const getRootNodeSpecs = function _getRootNodeSpecs() {
  const nodeSpecs = {
    value: 0xFF, // EXPLAIN
    isWord: true,
    sibling: null, // node
    child: null, // node
  };

  return nodeSpecs;
};

// provide a closure with methods and an object
const levelOrderMap = function _levelOrderMap(closure, thisRoot) {
  let someRoot = thisRoot;
  const queue = [];

  // while queue not empty
  while (someRoot !== undefined) {
    let child = someRoot.child;

    while (child !== null) {
      closure.onChild(child);
      queue.push(child);
      child = child.sibling;
    }

    closure.onParent(someRoot);
    someRoot = queue.shift();
  }

  return closure;
};

const trieToUnicodeSymbolArrayClosure = function _trieToUnicodeSymbolArrayClosure() {
  let byteArray = [];

  function onChild(child) {
    byteArray = byteArray.concat(Bytepack.unicodeSymbolsToExpandedByteArray(child.value));
  }

  function onParent(parent) {
    byteArray = byteArray.concat(Bytepack.unicodeSymbolsToExpandedByteArray(parent.value));
  }

  function getReturnValue() {
    return byteArray;
  }

  return {
    onChild,
    onParent,
    getReturnValue,
  };
};

const trieToBitArrayClosure = function _trieToBitArrayClosure() {
  const bitArray = [];

  function onChild() {
    bitArray.push(1);
  }

  function onParent() {
    bitArray.push(0);
  }

  function getReturnValue() {
    return bitArray;
  }

  return {
    onChild,
    onParent,
    getReturnValue,
  };
};

const getPositionsOfZerosInTrieClosure = function _getPositionsOfZerosInTrieClosure() {
  let indexInBitArray = 0;
  const positionsOfZeros = [];

  function incrementIndexInBitArray() {
    indexInBitArray += 1;
  }

  function onChild() {
    incrementIndexInBitArray();
  }

  function onParent() {
    positionsOfZeros.push(Math.floor(indexInBitArray / Bytepack.byteWidth));
    incrementIndexInBitArray();
  }

  function getReturnValue() {
    return positionsOfZeros;
  }

  return {
    onChild,
    onParent,
    getReturnValue,
  };
};

const trieToSymbolStringClosure = function _trieToSymbolStringClosure() {
  let str = '';

  function onChild() {
    // do nothing
  }

  function onParent(parent) {
    if (parent.value === 0xFF) {
      str += '_';
    } else {
      str += parent.value;
    }
  }

  function getReturnValue() {
    return str;
  }

  return {
    onChild,
    onParent,
    getReturnValue,
  };
};

const getNodesThatDenoteWordsClosure = function _getNodesThatDenoteWordsClosure() {
  let nodeNumber = 0;
  const nodesThatDenoteWords = [];

  function incrementNodeNumber() {
    nodeNumber += 1;
  }

  function onChild() {
    // do nothing
  }

  function onParent(parent) {
    if (parent.isWord === true) {
      nodesThatDenoteWords.push(nodeNumber);
    }
    incrementNodeNumber();
  }

  function getReturnValue() {
    return nodesThatDenoteWords;
  }

  return {
    onChild,
    onParent,
    getReturnValue,
  };
};

const isStringInTrieHelper = function _isStringInTrieHelper(str, head) {
  let arr = stringToSymbolArray(str);

  // if symbol array is empty, we've recursed thru entire string
  if (arr[0] === undefined) {
    return true;
  }
  // if we recurse on empty subTrie or symbol is nowhere to be found at current level
  if (head === null || (LinkedList.nodeExistsInLinkedList(head, arr[0]) === false)) {
    return false;
  }
  // every node is the root of a subTrie within larger Trie
  const subTrieRoot = LinkedList.getNodeFromLinkedList(head, arr[0]);
  arr = arr.slice(1);
  const remainingStr = symbolArrayToString(arr);

  return isStringInTrieHelper(remainingStr, subTrieRoot.child);
};

/************************************ TRIE CONSTRUCTOR *********************************************/

/*

We define a Trie as a doubly linked-list.

**/

const Trie = function _Trie() {
  const superRootNodeSpecs = getSuperRootNodeSpecs();
  const superRootNode = LinkedList.makeLinkedListNode(superRootNodeSpecs.value, superRootNodeSpecs.isWord);
  const rootNodeSpecs = getRootNodeSpecs();
  const rootNode = LinkedList.makeLinkedListNode(rootNodeSpecs.value, rootNodeSpecs.isWord);
  superRootNode.child = rootNode;

  const trieToBitArray = function _trieToBitArray() {
    const myClosure = trieToBitArrayClosure();
    levelOrderMap(myClosure, superRootNode);
    return myClosure.getReturnValue();
  };

  const trieToUnicodeSymbolArray = function _trieToUnicodeSymbolArray() {
    const myClosure = trieToUnicodeSymbolArrayClosure();
    levelOrderMap(myClosure, superRootNode);
    return myClosure.getReturnValue();
  };

  const trieToSymbolString = function _trieToSymbolString() {
    const myClosure = trieToSymbolStringClosure();
    levelOrderMap(myClosure, rootNode);
    return myClosure.getReturnValue();
  };

  const getPositionsOfZerosInTrie = function _getPositionsOfZerosInTrie() {
    const myClosure = getPositionsOfZerosInTrieClosure();
    levelOrderMap(myClosure, superRootNode);
    return myClosure.getReturnValue();
  };

  /*
  returns an array of node numbers (the number representing the order of the node in level order
  traversal) for nodes that denote the end of a complete word in trie
  **/
  const getNodesThatDenoteWords = function _getNodesThatDenoteWords() {
    const myClosure = getNodesThatDenoteWordsClosure();
    levelOrderMap(myClosure, rootNode);
    return myClosure.getReturnValue();
  };

  const isStringInTrie = function _isStringInTrie(str) {
    return isStringInTrieHelper(str, rootNode.child);
  };

  const addStringToTrie = function _addStringToTrie(str) {
    const strArr = stringToSymbolArray(str);
    strArr.forEach((someSymbol, index, array) => {
      addSymbolToTrie(someSymbol, index, array, rootNode);
    });
  };


  return {
    trieToBitArray,
    trieToUnicodeSymbolArray,
    trieToSymbolString,
    getPositionsOfZerosInTrie,
    getNodesThatDenoteWords,
    isStringInTrie,
    addStringToTrie,
  };
};

/************************************ EXPORT **************************************************/

exports.Trie = Trie;
