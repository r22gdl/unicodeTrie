const { Node } = require('./node.js');
const bytepack = require('./bytepack.js');

/************************************ LIBRARY METHODS *****************************************/

const walkThruPrefix = function _walkThruPrefix(startNode, prefix) {

  let current = startNode;

  let next = current.child;

  while (prefix[0] !== undefined) {

    while (next.value !== prefix[0]) {
      current = next;
      next = next.sibling;
    }

    current = next;

    next = current.child;

    prefix = prefix.slice(1, prefix.length);
  }
  return current;
};

const isPresent = function _isPresent(head, value) {
  let valueIsPresent = false;

  let current = head;

  let next;

  while(current !== null) {

    if (current.value === value) {

      valueIsPresent = true;
    }

    next = current.sibling;

    current = next;
  }

  return valueIsPresent;
};

const getNode = function _getNode(head, value) {
  if(isPresent(head, value) === false){
    throw 'getNode(head, value) called without first calling isPresent(head, value)';
  }

  let current = head;

  let next;

  while(current.value !== value) {
    next = current.sibling;
    current = next;
  }

  return current;
};

const getTail = function _getTail(someHead) {
  let current = someHead;

  let next = current.sibling;

  while(next !== null) {
    current = next;
    next = next.sibling;
  }

  return current;
};

const appendAtTail = function _appendAtTail(someRoot, head, nodeToInsert) {
  if(head === null) {
    someRoot.child = nodeToInsert;
  } else {
    getTail(head).sibling = nodeToInsert;
  }
};

const insertNode = function _insertNode(nodeToInsert, prefix, someRoot) {
  const charToInsert = nodeToInsert.value;
  let current = someRoot;
  let subTrieRoot = walkThruPrefix(current, prefix);
  // the child of any node is the head of another linked list. This linked list represents a single level in a subTrie
  if (subTrieRoot.child === null) {
    subTrieRoot.child = nodeToInsert;
  } else if(isPresent(subTrieRoot.child, charToInsert)){
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

  arr.forEach(function addSymbolToString(symbol){
    str = str + symbol;
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

  let queue = [];

  // while queue not empty
  while (someRoot !== undefined) {
    child = someRoot.child;

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

function trieToByteArrayClosure() {
  let byteArray = [];

  function onChild (child) {
    byteArray = byteArray.concat(bytepack.unicodeToByteArray(child.value));
  }

  function onParent (parent) {
    byteArray = byteArray.concat(bytepack.unicodeToByteArray(parent.value));
  }

  function getByteArray () {
    return byteArray;
  }

  return {
    onChild: onChild,
    onParent: onParent,
    getReturnValue: getByteArray,
  };
}

function trieToBitArrayClosure() {
  const bitArray = [];

  function onChild (child) {
    bitArray.push(1);
  }

  function onParent(parent) {
    bitArray.push(0);
  }

  function getBitArray() {
    return bitArray;
  }

  return {
    onParent : onParent,
    onChild: onChild,
    getReturnValue: getBitArray,
  };
}


/************************************ CONSTRUCTOR *********************************************/


const Trie = function _Trie() {
  const superRootNode = Node(getSuperRootNodeSpecs());

  const rootNode = Node(getRootNodeSpecs());

  superRootNode.child = rootNode;

  const isStringInTrieHelper = function _isStringInTrieHelper(str, head) {
    arr = stringToSymbolArray(str);

    // if symbol array is empty, we've recursed through entire string meaning string is stored in trie
    if(arr[0] === undefined) {
      return true;

    // if we recurse on an empty subTrie or the current symbol is nowhere to be found at current level, the string is not stored in trie
    } if (head === null || (isPresent(head, arr[0]) === false)) {
      return false;

    // recurse on the remaining part of the string
    } else {
      // every node is the root of a subTrie within larger Trie
      const subTrieRoot = getNode(head, arr[0]);
      arr = arr.slice(1);

      str = symbolArrayToString(arr);

      return isStringInTrieHelper(str, subTrieRoot.child);
    }
  };

  const trieToBitArray = function _trieToBitArray() {
    const myClosure = trieToBitArrayClosure();

    levelOrderMap(myClosure, superRootNode);

    return myClosure.getReturnValue();
  };

  const trieToByteArray = function _trieToByteArray() {
    const myClosure = trieToByteArrayClosure();

    levelOrderMap(myClosure);

    return myClosure.getReturnValue();
  };

  const isStringInTrie = function _isStringInTrie(str) {
    return isStringInTrieHelper(str, rootNode.child);
  };

  const stringToTrie = function _stringtoTrie(str) {
    const strArr = stringToSymbolArray(str);

    strArr.forEach(function charToTrieWrapper(someChar, index, array) {
      charToTrie(someChar, index, array, rootNode);
    });
  };

  return {
    trieToBitArray: trieToBitArray,
    trieToByteArray: trieToByteArray,
    isStringInTrie: isStringInTrie,
    stringToTrie: stringToTrie,
  };
}

/************************************ EXPORT **************************************************/

exports.Trie = Trie;