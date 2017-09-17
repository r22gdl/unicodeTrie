/* eslint spaced-comment: 0, jsx-a11y/href-no-hash: 0, max-len: 0, no-console: 0*/
const Bytepack = require('./bytepack.js');
const { Trie } = require('./trie.js');
const { Base64SuccinctTrie } = require('./succinctTrie.js');

const myTrie = Trie();

myTrie.stringToTrie('I');
myTrie.stringToTrie('<3');
myTrie.stringToTrie('⏣⅀ARNY⏣');
console.log(myTrie.isStringInTrie('I')); // true
console.log(myTrie.isStringInTrie('<3')); // true
console.log(myTrie.isStringInTrie('⏣⅀ARNY⏣')); // true
console.log(myTrie.isStringInTrie('⅀ARNY')); //false

const bitArray = myTrie.trieToBitArray();
const base64String = Bytepack.bitArrayToBase64String(bitArray);
const unicodeSymbolString = myTrie.trieToSymbolString();
const expandedUnicodeSymbolArray = Bytepack.unicodeSymbolsToExpandedByteArray(unicodeSymbolString);
const positionsOfZeros = myTrie.getPositionsOfZerosInTrie();

// Note: positionsOfZeros is a data structure that, together with the select() method mentioned
// in Steve Havnov's post, helps implement the Base64SuccinctTrie.isStringInSuccinctTrie() method

const mySuccintTrie = Base64SuccinctTrie(base64String, expandedUnicodeSymbolArray, positionsOfZeros);

console.log(mySuccintTrie.isStringInSuccintTrie('<')); // true
console.log(mySuccintTrie.isStringInSuccintTrie('⏣⅀ARNY⏣')); // true
console.log(mySuccintTrie.isStringInSuccintTrie('3')); // false
console.log(mySuccintTrie.isStringInSuccintTrie('⏣⅀ARNY♛')); // false
