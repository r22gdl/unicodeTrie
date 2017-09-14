const bytepack = require('./bytepack.js');
const trie = require('./trie.js')


const rootNode = trie.rootNode;

trie.stringToTrie('as');
trie.stringToTrie('at');
trie.stringToTrie('s');
trie.stringToTrie('dad');
trie.isStringArrayInTrie(trie.stringToArray('as'), rootNode, rootNode.child);
trie.isStringArrayInTrie(trie.stringToArray('at'), rootNode, rootNode.child);
trie.isStringArrayInTrie(trie.stringToArray('s'), rootNode, rootNode.child);
trie.isStringArrayInTrie(trie.stringToArray('dad'), rootNode, rootNode.child);
console.log(bytepack.bitArrayToByteString(trie.trieToBitArray()));


// trie.isStringArrayInTrie(trie.stringToArray('at'), rootNode, rootNode.child);



console.log(bytepack.unicodeToByteArray('ß'));

// level_order_navigate(callback)

// get iterable set of words
// create trie
// navigate trie in level order
// add words toByteArray



// Trie composition:
// every Trie consists of a rootNode whose child is the head of a linked list
// This linked list is a collection of nodes representing a single unicode UTF-8 character
// Every node in a linked list may be the root of a trie


