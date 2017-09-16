const { Node } = require('./node.js');
const bytepack = require('./bytepack.js');

/************************************ LIBRARY METHODS *****************************************/

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

const isPresent = function _isPresent(head, value) {
  let valueIsPresent = false;
  let current = head;
  let next;

  while (current !== null) {
    if (current.value === value) {
      valueIsPresent = true;
    }
    next = current.sibling;
    current = next;
  }

  return valueIsPresent;
};

const getNode = function _getNode(head, value) {
  if (isPresent(head, value) === false) {
    throw 'getNode(head, value) called without first calling isPresent(head, value)';
  }

  let current = head;
  let next;

  while (current.value !== value) {
    next = current.sibling;
    current = next;
  }

  return current;
};

const getTail = function _getTail(someHead) {
  let current = someHead;
  let next = current.sibling;

  while (next !== null) {
    current = next;
    next = next.sibling;
  }

  return current;
};

const appendAtTail = function _appendAtTail(thisRoot, head, nodeToInsert) {
  const someRoot = thisRoot;

  // empty linked list
  if (head === null) {
    someRoot.child = nodeToInsert;
  } else {
    getTail(head).sibling = nodeToInsert;
  }
};

const insertNode = function _insertNode(nodeToInsert, prefix, someRoot) {
  const charToInsert = nodeToInsert.value;
  const current = someRoot;
  const subTrieRoot = walkThruPrefix(current, prefix);

  // the child of any node is the head of another linked list.
  // This linked list represents a single level in a subTrie
  if (subTrieRoot.child === null) {
    subTrieRoot.child = nodeToInsert;
  } else if (isPresent(subTrieRoot.child, charToInsert)) {
    // do nothing
  } else {
    appendAtTail(subTrieRoot, subTrieRoot.child, nodeToInsert);
  }
};

const makeNode = function _makeNode(char, bool) {
  const nodeSpecs = {
    value: char,
    isWord: bool,
    sibling: null,
    child: null,
  };

  return Node(nodeSpecs);
};

const charToTrie = function _charToTrie(currentChar, index, array, someRoot) {
  // if last character, then character denotes word
  const denotesWord = (index === (array.length - 1));
  const myNode = makeNode(currentChar, denotesWord);
  const prefix = array.slice(0, index);

  return insertNode(myNode, prefix, someRoot);
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
    isWord: false,
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
    byteArray = byteArray.concat(bytepack.unicodeToByteArray(child.value));
  }

  function onParent(parent) {
    byteArray = byteArray.concat(bytepack.unicodeToByteArray(parent.value));
  }

  function getByteArray() {
    return byteArray;
  }

  return {
    onChild,
    onParent,
    getByteArray,
  };
};

const trieToBitArrayClosure = function _trieToBitArrayClosure() {
  const bitArray = [];

  function onChild(child) {
    bitArray.push(1);
  }

  function onParent(parent) {
    bitArray.push(0);
  }

  function getBitArray() {
    return bitArray;
  }

  return {
    onParent,
    onChild,
    getBitArray,
  };
};


/************************************ CONSTRUCTOR *********************************************/


const Trie = function _Trie() {
  const superRootNode = Node(getSuperRootNodeSpecs());
  const rootNode = Node(getRootNodeSpecs());
  superRootNode.child = rootNode;

  const isStringInTrieHelper = function _isStringInTrieHelper(str, head) {
    let arr = stringToSymbolArray(str);

    // if symbol array is empty, we've recursed thru entire string
    if (arr[0] === undefined) {
      return true;
    }
    // if we recurse on empty subTrie or symbol is nowhere to be found at current level
    if (head === null || (isPresent(head, arr[0]) === false)) {
      return false;
    }
    // every node is the root of a subTrie within larger Trie
    const subTrieRoot = getNode(head, arr[0]);
    arr = arr.slice(1);
    const remainingStr = symbolArrayToString(arr);

    return isStringInTrieHelper(remainingStr, subTrieRoot.child);
  };

  const trieToBitArray = function _trieToBitArray() {
    const myClosure = trieToBitArrayClosure();
    levelOrderMap(myClosure, superRootNode);
    return myClosure.getReturnValue();
  };

  const trieToUnicodeSymbolArray = function _trieToUnicodeSymbolArray() {
    const myClosure = trieToUnicodeSymbolArrayClosure();
    levelOrderMap(myClosure);
    return myClosure.getReturnValue();
  };

  const isStringInTrie = function _isStringInTrie(str) {
    return isStringInTrieHelper(str, rootNode.child);
  };

  const stringToTrie = function _stringtoTrie(str) {
    const strArr = stringToSymbolArray(str);
    strArr.forEach((someChar, index, array) => {
      charToTrie(someChar, index, array, rootNode);
    });
  };

  return {
    trieToBitArray,
    trieToUnicodeSymbolArray,
    isStringInTrie,
    stringToTrie,
  };
};

/************************************ EXPORT **************************************************/

exports.Trie = Trie;
