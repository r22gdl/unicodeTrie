// Avoiding Object.create() and the new operator

// const node = {
//   value : '',
//   isWord: true,
//   sibling: null, // node
//   child: null, // node
// };

// ************************ USING GETTERS/SETTERS ************************

function Node (spec) {
  let node = spec;

  return {
    get value() { return node.value; },
    get isWord() { return node.isWord; },
    get child() { return node.child; },
    get sibling() { return node.sibling; },
    set child(child) { node.child = child; },
    set sibling(sibling) { node.sibling = sibling; },
  };

}

exports.Node = Node;

// ****************** NOT USING GETTERS/SETTERS, INSTEAD USING EXPLICIT METHODS ********************
// const Node = function _Node (spec) {
//   let node = spec;

//   function getValue() {
//     return node.value;
//   }
//   function getChild() {
//     return node.child;
//   }
//   function getNext() {
//     return node.next;
//   }
//   function setChild(child) {
//     node.child = child;
//   }
//   function setNext(next) {
//     node.next = next;
//   }

//   let nodeMethods = {};
//   nodeMethods.getValue = getValue;
//   nodeMethods.getChild = getChild;
//   nodeMethods.getNext = getNext;
//   nodeMethods.setChild = setChild;
//   nodeMethods.setNext = setNext;

//   return nodeMethods;
// };

// exports.Node = Node;

// *********************************Using a starting object and then Object.create() ******************************************* //
// note: Object.create() depends on functions `function F() {}`, protoype property `F.prototype = o`, `return new F()`
// const node = {
//   value : '',
//   sibling: null, // node
//   child: null, // node
// };


// const masterNode = Object.create(masterNode);


