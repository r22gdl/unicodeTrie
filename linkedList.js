/* eslint spaced-comment: 0, jsx-a11y/href-no-hash: 0 */



/************************************ NODE CONSTRUCTOR *********************************************/
/*

The "Node" is the basic unit of our linked list class

**/

function Node(spec) {
  const node = spec;

  return {
    get value() { return node.value; },
    get isWord() { return node.isWord; },
    get child() { return node.child; },
    get sibling() { return node.sibling; },
    set child(child) { node.child = child; },
    set sibling(sibling) { node.sibling = sibling; },
  };
}

/************************************ GENERAL LINKED LIST METHODS *********************************************/
function nodeExistsInLinkedList(head, value) {
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
}

function getNodeFromLinkedList(head, value) {
  if (nodeExistsInLinkedList(head, value) === false) {
    throw 'getNode(head, value) called without first calling LinkedList.nodeExistsInLinkedList(head, value)';
  }
  let current = head;
  let next;
  while (current.value !== value) {
    next = current.sibling;
    current = next;
  }
  return current;
}

function getTailNodeOfLinkedList(someHead) {
  let current = someHead;
  let next = current.sibling;
  while (next !== null) {
    current = next;
    next = next.sibling;
  }
  return current;
}

function appendNodeToTailOfLinkedList(thisRoot, head, nodeToInsert) {
  const someRoot = thisRoot;
  // empty linked list
  if (head === null) {
    someRoot.child = nodeToInsert;
  } else {
    getTailNodeOfLinkedList(head).sibling = nodeToInsert;
  }
}

function makeLinkedListNode(char, bool) {
  const nodeSpecs = {
    value: char,
    isWord: bool,
    sibling: null,
    child: null,
  };
  return Node(nodeSpecs);
}

/************************************ LINKED LIST METHODS TO BE EXPORTED *********************************************/
const LinkedList = {
  nodeExistsInLinkedList,
  getNodeFromLinkedList,
  getTailNodeOfLinkedList,
  appendNodeToTailOfLinkedList,
  makeLinkedListNode,
};

/************************************ EXPORTS *********************************************/

exports.LinkedList = LinkedList;
