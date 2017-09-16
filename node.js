const Node = function _Node(spec) {
  const node = spec;

  return {
    get value() { return node.value; },
    get isWord() { return node.isWord; },
    get child() { return node.child; },
    get sibling() { return node.sibling; },
    set child(child) { node.child = child; },
    set sibling(sibling) { node.sibling = sibling; },
  };
};

exports.Node = Node;
