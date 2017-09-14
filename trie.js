const { Node } = require('./node.js');
const bytepack = require('./bytepack.js');

// bytepack.toByteArray()
// bytepack.parse();

// toTrie()
  // accept string
  // for each char in string
    // create node
    // insert node

// fact: a prefix of any char in string will always be present in trie IFF
// we insert every string from first char to last character

// Return: root node of a subTrie, where root node represents last character in prefix provided

/********************************** METHODS *************************************************/
const walkThruPrefix = function _walkThruPrefix(startNode, prefix) {
  // console.log('walkThruPrefix()');
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
  // console.log('returning: ', current.value);
  return current;
};

// Return: is a character present in a linkedList
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

// Return: node with given value in a linkedList
// Note: not to be called without first calling isPresent
const getNode = function _getNode(head, value) {
  // console.log('getNode()');
  if(isPresent(head, value) === false){
    throw 'getNode(head, value) called without first calling isPresent(head, value)';
  }
  let current = head;
  let next;
  while(current.value !== value) {
    next = current.sibling;
    current = next;
  }
  // console.log('returning: ', current.value);
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

const appendAtTail = function _appendAtTail(root, head, nodeToInsert) {
  if(head === null) {
    root.child = nodeToInsert;
  } else {
    getTail(head).sibling = nodeToInsert;
  }
};

// the child of any node is the head of another linkedList
const insertNode = function _insertNode(nodeToInsert, prefix) {
  //for each char in prefix, get Node
  // console.log('insertNode()');
  const charToInsert = nodeToInsert.value;
  // console.log('charToInsert: ', charToInsert);
  // console.log('prefix: ', prefix);
  let current = rootNode;
  let subTrieRoot = walkThruPrefix(current, prefix);
  if (subTrieRoot.child === null) {
    // console.log('subTrieRoot.child === null');
    // console.log('subTrieRoot.child = nodeToInsert');
    subTrieRoot.child = nodeToInsert;
    // console.log('subTrieRoot.child.value: ', subTrieRoot.child.value);
  } else if(isPresent(subTrieRoot.child, charToInsert)){
    // console.log('node already present: ', charToInsert);
  } else {
    // console.log('node not present: ', charToInsert);
    appendAtTail(subTrieRoot, subTrieRoot.child, nodeToInsert);
    // console.log('appendAtTail(subTrieRoot, subTrieRoot.child, nodeToInsert)');
    // console.log('getTail(subTrieRoot).value: ', getTail(subTrieRoot).value);
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


const charToTrie = function _charToTrie(currentChar, index, array) {
  // console.log('charToTrie(), currentChar: ', currentChar);
  // if last character, then character denotes word
  const denotesWord = (index === (array.length - 1));
  console.log('denotesWord: ', denotesWord);
  const myNode = makeNode(currentChar, denotesWord);
  // console.log('const myNode = makeNode(currentChar, denotesWord);');

  const prefix = array.slice(0, index);
  return insertNode(myNode, prefix);
};


const stringToArray = function _stringToArray(str) {
  return str.split('');
};

const arrayToString = function _arrayToString(arr) {
  var str = '';
  while(arr[0] !== undefined) {
    str += arr[0];
    arr = arr.slice(1);
  }
  return str;
};


const stringToTrie = function _stringtoTrie(str) {
  // console.log('stringToTrie()');
  const strArr = stringToArray(str);
  strArr.forEach(charToTrie);
};

const getSuperRootNodeSpecs = function _getSuperRootNodeSpecs() {
  const nodeSpecs = {
    value: 0xFF,
    isWord: false,
    sibling: null,
    child: null,
  };
  return nodeSpecs;
};

const getRootNodeSpecs = function _getRootNodeSpecs() {
  const nodeSpecs = {
    value: 0xFF,
    isWord: false,
    sibling: null, // node
    child: null, // node
  };
  return nodeSpecs;
};


// Note: recursive method
const isStringArrayInTrie = function _isStringArrayInTrie(arr, someRoot, head) {
  // console.log('isStringArrayInTrie()');
  // console.log('arr: ', arr);
  // console.log('someRoot.value: ', someRoot.value);
  if(head !== null) {
    // console.log('head.value: ', head.value);
  }
  if(arr[0] === undefined) {
    // console.log('arr[0] === undefined');
    console.log('returning true');
    return true;
  } if (head === null || (isPresent(head, arr[0]) === false)) {
    // console.log('head === null || (isPresent(head, arr[0]) === false)');
    console.log('returning false');
    return false;
  } else {
    // console.log('else');
    // console.log('const newRoot = getNode(head, arr[0])');
    const newRoot = getNode(head, arr[0]);
    return isStringArrayInTrie(arr.slice(1), newRoot, newRoot.child);
  }
};


const trieToBitArray = function _trieToBitArray() {
  let someRoot = superRootNode;
  let queue = [];
  let bitArray = [];
  let initialize = false;
  while (someRoot !== undefined) { // end of queue
    try {
      console.log('someRoot.value: ', someRoot.value);
      console.log('bytepack.unicodeToByteArray(someRoot.value): ', bytepack.unicodeToByteArray(someRoot.value));
      byteArray = byteArray.concat(bytepack.unicodeToByteArray(someRoot.value));
      child = someRoot.child;
      while (child !== null) {
        queue.push(child);
        bitArray.push(1);
        console.log('bytepack.unicodeToByteArray(child.value): ', bytepack.unicodeToByteArray(child.value));
        byteArray = byteArray.concat(bytepack.unicodeToByteArray(child.value));
        child = child.sibling;
      }
      // console.log('queue: ', queue);
      bitArray.push(0);
      someRoot = queue.shift();
      initialize = true;
      // console.log('someRoot !== null: ', (someRoot !== null));
      // console.log('!(initialize === true && queue.length === 0): ', !(initialize === true && queue.length === 0));
      // console.log('initialize === true: ', (initialize === true));
      // console.log('queue.length === 0: ', (queue.length === 0));
    } catch (e) {
      console.log(e);
    }
  }
  console.log(byteArray);
  return bitArray;
};

/********************************** GLOBALS *************************************************/

const superRootNode = Node(getSuperRootNodeSpecs());
const rootNode = Node(getRootNodeSpecs());
superRootNode.child = rootNode;

let byteArray = [];

/************************************ EXPORTS *********************************************/

exports.rootNode = rootNode;
exports.superRootNode = superRootNode;
exports.byteArray = byteArray;


exports.stringToTrie = stringToTrie;

exports.isStringArrayInTrie = isStringArrayInTrie;
exports.stringToArray = stringToArray;
exports.trieToBitArray = trieToBitArray;

